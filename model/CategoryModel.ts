import { Category, ImageDB } from "@prisma/client";

export interface CategoryWithRelations extends Category {
    image: ImageDB | null
}
