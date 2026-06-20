import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ error: "Zadejte platný e-mail." }).toLowerCase(),
  password: z.string().min(1, { error: "Zadejte heslo." }),
});

export const registrationSchema = z
  .object({
    name: z.string().trim().min(1, { error: "Zadejte jméno." }).max(120, { error: "Jméno je příliš dlouhé." }),
    email: z.string().trim().email({ error: "Zadejte platný e-mail." }).toLowerCase(),
    password: z.string().min(8, { error: "Heslo musí mít alespoň 8 znaků." }),
    passwordConfirmation: z.string().min(1, { error: "Potvrďte heslo." }),
    inviteCode: z.string().min(1, { error: "Zadejte registrační kód." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "Hesla se neshodují.",
    path: ["passwordConfirmation"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
