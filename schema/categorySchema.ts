import z from "zod";

export const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string()
        .min(2, 'Le nom du produit doit contenir au moins 2 caractères.')
        .max(255, 'Le nom du produit ne peut pas dépasser 255 caractères.'),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;