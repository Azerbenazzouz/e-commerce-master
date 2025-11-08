import z from "zod";

export const RegisterSchema = z.object({
  email: z.string()
    .email(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères.'),
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères.'),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string()
    .email(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères.'),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;