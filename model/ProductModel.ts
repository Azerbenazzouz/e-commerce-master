import { Category, ImageDB, Product, Review, User } from "@prisma/client";

export interface FullProduct extends Product {
    images: ImageDB[]
    category: Category
    reviews: ReviewWithUser[]
}

interface ReviewWithUser extends Review {
    user: User
}