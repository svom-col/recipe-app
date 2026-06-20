import { z } from "zod";

export const shareRecipeSchema = z.object({
  email: z.string().trim().email({ error: "Zadejte platný e-mail." }).toLowerCase(),
});

export type ShareRecipeInput = z.infer<typeof shareRecipeSchema>;
