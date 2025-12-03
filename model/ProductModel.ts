import { Category, ImageDB, Product, Review, User } from "@prisma/client";

export interface ProductWithRelations extends Product {
    images: ImageDB[]
    category: Category
    reviews: (Review & { user: User })[]
}