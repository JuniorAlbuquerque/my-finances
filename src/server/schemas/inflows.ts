import { z } from "zod";

export const addFixedInflowSchema = z.object({
  description: z.string().min(1, "Campo obrigatório"),
  value: z.number().min(0.01, "Campo obrigatório"),
  category: z.string().min(1, "Campo obrigatório"),
  paymentDate: z.string().min(1, "Campo obrigatório"),
});
