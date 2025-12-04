import { z } from "zod";

export const orderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().min(1),
            price: z.number(),
        })
    ).min(1, "Cart cannot be empty"),
    total: z.number(),
});

export type OrderSchema = z.infer<typeof orderSchema>;
