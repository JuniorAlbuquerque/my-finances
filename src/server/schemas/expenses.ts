import { ExpenditureStatus } from "@prisma/client";
import { z } from "zod";

export const addFixedExpenseSchema = z.object({
  description: z.string().min(1, "Campo obrigatório"),
  value: z.number().min(0.01, "Campo obrigatório"),
  category: z.string().min(1, "Campo obrigatório"),
  paymentDate: z.string().min(1, "Campo obrigatório"),
});

export const addExpenseSchema = z.object({
  description: z.string(),
  value: z.number(),
  paymentDate: z.date(),
  status: z.enum([ExpenditureStatus.PAID, ExpenditureStatus.WAITING]),
  category: z.string(),
  fixed: z.optional(z.boolean()),
});
