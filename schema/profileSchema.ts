import z from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères.'),
  
  phone: z.string()
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères.')
    .optional()
    .or(z.literal('')),
});

export type ProfileUpdateSchemaType = z.infer<typeof ProfileUpdateSchema>;

export const ProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;