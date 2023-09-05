import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addCardSchema } from "~/server/schemas/card";

export const cardRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.card.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getMain: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.card.findFirst({
      where: {
        userId: ctx.session.user.id,
        AND: {
          main: true,
        },
      },
    });
  }),

  add: protectedProcedure
    .input(addCardSchema)
    .mutation(async ({ ctx, input }) => {
      const existsMain = await ctx.prisma.card.findFirst({
        where: {
          userId: ctx.session.user.id,
          AND: {
            main: true,
          },
        },
      });

      if (existsMain?.id && input.main) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe um cartão principal cadastrado",
        });
      }

      return ctx.prisma.card.create({
        data: {
          name: input.name,
          limit: parseFloat(input.limit),
          userId: ctx.session.user.id,
          balance: parseFloat(input.balance),
          main: input.main,
        },
      });
    }),
});
