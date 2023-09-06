import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getStartAndEndOfMonth } from "~/utils/getStartAndEndOfMonth";

export const reportRouter = createTRPCRouter({
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

    const expensePerDay = parseFloat(
      (expenses?._sum?.value! / end.getDate()).toFixed(2)
    );
    const expensePerWeek = parseFloat((expenses?._sum?.value! / 7).toFixed(2));

    return {
      entries: inflows?._sum?.value!,
      expenses: expenses?._sum?.value!,
      expensePerDay,
      expensePerWeek,
      balance: inflows?._sum?.value! - expenses?._sum?.value!,
    };
  }),

  groupByCategory: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.expenditure.groupBy({
      by: ["category"],
      where: {
        userId: ctx.session.user.id,
      },
      _sum: {
        value: true,
      },
    });

    return categories;
  }),

  groupByMonth: protectedProcedure.query(async ({ ctx }) => {
    const months: Record<number, { entries: number; expenses: number }> = {};

    const expenses = await ctx.prisma.expenditure.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const inflows = await ctx.prisma.inflow.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    for (const expense of expenses) {
      const date = new Date(expense.paymentDate);
      const month = date.getMonth() + 1;

      if (!months[month]) {
        months[month] = {
          entries: 0,
          expenses: 0,
        };
      }

      const temp = months[month];

      temp!.expenses += expense.value;
    }

    for (const inflow of inflows) {
      const date = new Date(inflow.paymentDate);
      const month = date.getMonth() + 1;

      if (!months[month]) {
        months[month] = {
          entries: 0,
          expenses: 0,
        };
      }

      const temp = months[month];

      temp!.entries += inflow.value;
    }

    return months;
  }),
});
