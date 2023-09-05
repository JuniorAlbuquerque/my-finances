import { addFixedInflowSchema } from "~/server/schemas/inflows";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const inflowsRouter = createTRPCRouter({
  addFixedInflow: protectedProcedure
    .input(addFixedInflowSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fixedInflows.create({
        data: {
          ...input,
          paymentDate: parseInt(input.paymentDate),
          userId: ctx.session.user.id,
        },
      });
    }),

  getAllFixedInflows: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.fixedInflows.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
