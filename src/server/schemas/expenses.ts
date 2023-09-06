import { ExpenditureStatus } from "@prisma/client";
import { z } from "zod";

export const addFixedExpenseSchema = z.object({
  description: z.string().min(1, "Campo obrigatório"),
  value: z.number().min(0.01, "Campo obrigatório"),
  category: z.string().min(1, "Campo obrigatório"),
  paymentDate: z.string().min(1, "Campo obrigatório"),
});

export const addExpenseSchema = z.object({
  description: z.string().min(1, "Campo obrigatório"),
  value: z.number().min(0.01, "Campo obrigatório"),
  paymentDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) {
      const date = new Date(arg);

      return date;
    }
  }, z.date()),
  status: z.enum([ExpenditureStatus.PAID, ExpenditureStatus.WAITING], {
    required_error: "Campo obrigatório",
  }),
  category: z.string().min(1, "Campo obrigatório"),
  cardId: z.optional(z.number()),
});

export const updateFixedExpenseSchema = z.object({
  ...addFixedExpenseSchema.shape,
  expenseId: z.number(),
});

export const updateExpenseSchema = z.object({
  ...addExpenseSchema.shape,
  expenseId: z.number(),
});

export const payExpenseSchema = z.object({
  paid: z.boolean(),
  expenseId: z.number(),
});
