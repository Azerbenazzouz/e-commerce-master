"use server"

import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { ProductSchema, ProductSchemaType } from "@/schema/productSchema"
import { ZodError } from "zod"

interface GetAllProductsFilter {
    categoryId?: string
    searchTerm?: string
    sortBy?: 'priceAsc' | 'priceDesc' | 'newest' | 'popularity'
    pageSize?: number
    pageNumber?: number
    minPrice?: number
    maxPrice?: number
    minRating?: number
}

export const getAllProducts = async (filter?: GetAllProductsFilter) => {
    try {
        const where: Prisma.ProductWhereInput = {}
        const orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
        let skip = 0
        const take = filter?.pageSize || 20

        if (filter?.categoryId && filter.categoryId !== "Tous") {
            where.categoryId = filter.categoryId
        }
        if (filter?.searchTerm) {
            where.OR = [
                { name: { contains: filter.searchTerm, mode: 'insensitive' } },
                { description: { contains: filter.searchTerm, mode: 'insensitive' } },
            ]
        }
        if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
            where.price = {
                gte: filter?.minPrice,
                lte: filter?.maxPrice
            }
        }
        if (filter?.minRating) {
            where.rating = {
                gte: filter.minRating
            }
        }

        if (filter?.sortBy) {
            if (filter.sortBy === 'priceAsc') {
                orderBy.price = 'asc'
            } else if (filter.sortBy === 'priceDesc') {
                orderBy.price = 'desc'
            } else if (filter.sortBy === 'newest') {
                orderBy.createdAt = 'desc'
            } else if (filter.sortBy === 'popularity') {
                orderBy.popularity = 'desc'
            }
        }

        if (filter?.pageNumber && filter.pageNumber > 1) {
            skip = (filter.pageNumber - 1) * take
        }

        const [products, totalCount] = await Promise.all([
            await prisma.product.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    category: true,
                    images: true,
                    reviews: {
                        include: {
                            user: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ])

        return {
            success: true,
            result: products,
            totalCount,
            pageCount: Math.ceil(totalCount / take)
        }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { success: false, error: "Erreur lors de la récupération des produits." }
    }
}

export const getProductById = async (productId: string) => {
    try {
        const product = await prisma.product.findFirst({
            where: { id: productId },
            include: {
                category: true,
                images: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!product) {
            return { success: false, error: "Produit non trouvé." }
        }
        return { success: true, result: product }
    } catch (error) {
        console.error("Error fetching product by ID:", error)
        return { success: false, error: "Erreur lors de la récupération du produit." }
    }
}

export const createProduct = async (data: ProductSchemaType) => {
    try {
        // Validate the input data
        const validatedData = ProductSchema.parse(data)

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: validatedData.categoryId }
        })

        if (!category) {
            return { success: false, error: "La catégorie spécifiée n'existe pas." }
        }

        // Create the product
        const product = await prisma.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                originalPrice: validatedData.originalPrice,
                description: validatedData.description,
                categoryId: validatedData.categoryId,
                stock: validatedData.stock,
                rating: validatedData.rating,
                popularity: validatedData.popularity,
                isNew: validatedData.isNew,
                specifications: validatedData.specifications as Prisma.InputJsonValue,
            },
            include: {
                category: true,
            }
        })

        return {
            success: true,
            result: product,
            message: "Produit créé avec succès."
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                error: "Erreur de validation des données.",
                details: error.issues
            }
        }
        console.error("Error creating product:", error)
        return { success: false, error: "Erreur lors de la création du produit." }
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return { success: false, error: "Produit non trouvé." }
        }

        await prisma.product.delete({
            where: { id: productId }
        })

        return {
            success: true,
            message: "Produit supprimé avec succès."
        }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { success: false, error: "Erreur lors de la suppression du produit." }
    }
}

export const updateProduct = async (productId: string, data: Partial<ProductSchemaType>) => {
    try {
        // Validate the input data
        const validatedData = ProductSchema.partial().parse(data)

        // Check if category exists when updating category
        if (validatedData.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: validatedData.categoryId }
            })

            if (!category) {
                return { success: false, error: "La catégorie spécifiée n'existe pas." }
            }
        }

        // Update the product
        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                ...(validatedData.name && { name: validatedData.name }),
                ...(validatedData.price !== undefined && { price: validatedData.price }),
                ...(validatedData.originalPrice !== undefined && { originalPrice: validatedData.originalPrice }),
                ...(validatedData.description && { description: validatedData.description }),
                ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
                ...(validatedData.stock !== undefined && { stock: validatedData.stock }),
                ...(validatedData.rating !== undefined && { rating: validatedData.rating }),
                ...(validatedData.popularity !== undefined && { popularity: validatedData.popularity }),
                ...(validatedData.isNew !== undefined && { isNew: validatedData.isNew }),
                ...(validatedData.specifications && { specifications: validatedData.specifications as Prisma.InputJsonValue }),
            },
            include: {
                category: true,
            }
        })

        return {
            success: true,
            result: product,
            message: "Produit mis à jour avec succès."
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                error: "Erreur de validation des données.",
                details: error.issues
            }
        }
        console.error("Error updating product:", error)
        return { success: false, error: "Erreur lors de la mise à jour du produit." }
    }
}

export const getSimilarProducts = async (productId: string, categoryId: string) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: categoryId,
                id: { not: productId }
            },
            take: 4,
            include: {
                category: true,
                images: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return { success: true, result: products }
    } catch (error) {
        console.error("Error fetching similar products:", error)
        return { success: false, error: "Erreur lors de la récupération des produits similaires." }
    }
}

