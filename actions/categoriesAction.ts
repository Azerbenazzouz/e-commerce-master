"use server"

import { prisma } from "@/lib/db";
import { CategorySchema, CategorySchemaType } from "@/schema/categorySchema";
import { ZodError } from "zod";

export const getAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany({});
        return {
            success: true,
            result: categories
        }

    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            success: false,
            error: "Failed to fetch categories"
        }
    }
}

export const getCategoryById = async (categoryId: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            return { success: false, error: "Category not found." };
        }
        return { success: true, result: category };
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        return { success: false, error: "Failed to fetch category." };
    }
}

export const createCategory = async (data: CategorySchemaType) => {
    try {
        CategorySchema.parse(data);

        const newCategory = await prisma.category.create({
            data: { name: data.name }
        });
        return {
            success: true,
            result: newCategory,
            message: "Category created successfully."
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return { 
                success: false, 
                error: "Validation error.",
            };
        }
        console.error("Error creating category:", error);
        return { success: false, error: "Failed to create category." };
    }
}

export const deleteCategory = async (categoryId: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            return { success: false, error: "Category not found." };
        }
        await prisma.category.delete({
            where: { id: categoryId }
        });
        return {
            success: true,
            message: "Category deleted successfully."
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, error: "Failed to delete category." };
    }
}


