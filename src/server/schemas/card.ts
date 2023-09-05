import { z } from "zod";

export const addCardSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  limit: z.string().min(1, "Campo obrigatório"),
  balance: z.string().min(1, "Campo obrigatório"),
  main: z.optional(z.boolean()),
});
