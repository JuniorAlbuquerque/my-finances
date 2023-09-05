import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  addExpenseSchema,
  addFixedExpenseSchema,
} from "~/server/schemas/expenses";

export const expensesRouter = createTRPCRouter({
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

  addExpense: protectedProcedure
    .input(addExpenseSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.expenditure.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
