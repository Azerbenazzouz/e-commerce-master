import { Review } from "@prisma/client";
import { User } from "better-auth";

export interface UserWithReviews extends User {
    reviews: Review[]
}