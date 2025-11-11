import { Category, ImageDB, Product, Review, User } from "@prisma/client";

export interface FullProduct extends Product {
    images: ImageDB[];
    category: Category;
    reviews: FullReview[];
}

export interface FullReview extends Review {
    user: User;
}