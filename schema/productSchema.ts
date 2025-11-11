import z from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(2, 'Le nom du produit doit contenir au moins 2 caractères.')
    .max(255, 'Le nom du produit ne peut pas dépasser 255 caractères.'),
  
  price: z.coerce.number()
    .positive('Le prix doit être positif.')
    .min(0.01, 'Le prix doit être au moins 0.01.'),
  
  originalPrice: z.coerce.number()
    .positive('Le prix original doit être positif.')
    .optional()
    .nullable(),
  
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères.')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères.'),

  images: z.array(
    z.file()
  ).optional().default([]),

  categoryId: z.string()
    .min(1, 'La catégorie est requise.'),
  
  stock: z.coerce.number()
    .int('Le stock doit être un nombre entier.')
    .min(0, 'Le stock ne peut pas être négatif.')
    .default(0),
  
  rating: z.coerce.number()
    .min(0, 'La note doit être au moins 0.')
    .max(5, 'La note ne peut pas dépasser 5.')
    .default(0),
  
  popularity: z.coerce.number()
    .int('La popularité doit être un nombre entier.')
    .min(0, 'La popularité ne peut pas être négative.')
    .default(0),
  
  isNew: z.boolean()
    .default(true),
  
  specifications: z.array(z.object({
    label: z.string(),
    value: z.string(),
  }))
    .optional()
    .default([]),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

// Schema for updating a product (all fields optional except id)
export const ProductUpdateSchema = ProductSchema.partial().extend({
  id: z.string().min(1, 'L\'ID du produit est requis.'),
});

export type ProductUpdateSchemaType = z.infer<typeof ProductUpdateSchema>;
