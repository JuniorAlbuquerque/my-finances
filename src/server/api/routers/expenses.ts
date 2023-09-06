import { ExpenditureStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  addExpenseSchema,
  addFixedExpenseSchema,
  payExpenseSchema,
  updateExpenseSchema,
  updateFixedExpenseSchema,
} from "~/server/schemas/expenses";
import { z } from "zod";
import { getStartAndEndOfMonth } from "~/utils/getStartAndEndOfMonth";

export const expensesRouter = createTRPCRouter({
  getAllExpensesByMonth: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      const { start, end } = getStartAndEndOfMonth(input);

      return ctx.prisma.expenditure.findMany({
        where: {
          userId: ctx.session.user.id,
          AND: {
            paymentDate: {
              lte: end,
              gte: start,
            },
          },
        },
      });
    }),

  getAllFixedExpenses: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.fixedExpenses.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  addFixedExpense: protectedProcedure
    .input(addFixedExpenseSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fixedExpenses.create({
        data: {
          ...input,
          paymentDate: parseInt(input?.paymentDate),
          userId: ctx.session.user.id,
        },
      });
    }),

  updateFixedExpense: protectedProcedure
    .input(updateFixedExpenseSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fixedExpenses.update({
        where: {
          id: input.expenseId,
        },
        data: {
          ...input,
          paymentDate: parseInt(input?.paymentDate),
          userId: ctx.session.user.id,
        },
      });
    }),

  addExpense: protectedProcedure
    .input(addExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const isExpenseCard = input.category === "card";

      if (isExpenseCard && !input.cardId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Deve ser informado um cartão para a categoria cartão",
        });
      }

      const date = input.paymentDate;

      date.setDate(date.getDate() + 1);

      return await ctx.prisma.expenditure.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          paymentDate: date,
        },
      });
    }),

  updateExpense: protectedProcedure
    .input(updateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.expenditure.update({
        where: {
          id: input.expenseId,
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),

  payExpense: protectedProcedure
    .input(payExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.expenditure.update({
        where: {
          id: input.expenseId,
          userId: ctx.session.user.id,
        },
        data: {
          status: ExpenditureStatus.PAID,
        },
      });
    }),

  syncFixedExpense: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { start, end } = getStartAndEndOfMonth(input);

      const fixedExpenses = await ctx.prisma.fixedExpenses.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const expenses = await ctx.prisma.expenditure.findMany({
        where: {
          userId: ctx.session.user.id,
          AND: {
            paymentDate: {
              lte: end,
              gte: start,
            },
          },
        },
      });

      for (const expense of fixedExpenses) {
        const currentDate = new Date(
          new Date().getFullYear(),
          input,
          expense.paymentDate
        );

        const existsExpense = expenses?.find(
          (exp) => exp.fixedId === expense.id
        );

        if (!existsExpense) {
          await ctx.prisma.expenditure.create({
            data: {
              category: expense.category,
              description: expense.description,
              status: ExpenditureStatus.WAITING,
              value: expense.value,
              paymentDate: currentDate,
              fixed: true,
              fixedId: expense?.id,
              userId: expense.userId,
            },
          });
        }
      }
    }),

  getLastMonthInfo: protectedProcedure.query(async ({ ctx }) => {
    const date = new Date();

    const { start, end } = getStartAndEndOfMonth(date.getMonth());

    const expenses = await ctx.prisma.expenditure.aggregate({
      where: {
        userId: ctx.session.user.id,
        AND: {
          paymentDate: {
            lte: end,
            gte: start,
          },
        },
      },
      _sum: {
        value: true,
      },
    });

    const inflows = await ctx.prisma.inflow.aggregate({
      where: {
        userId: ctx.session.user.id,
        AND: {
          paymentDate: {
            lte: end,
            gte: start,
          },
        },
      },
      _sum: {
        value: true,
      },
    });

    return {
      entries: inflows?._sum,
      expenses: expenses?._sum,
    };
  }),
});
