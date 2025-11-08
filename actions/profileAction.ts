"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileUpdateSchema, ProfileUpdateSchemaType } from "@/schema/profileSchema";
import { headers } from "next/headers";


export const getProfile = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers() // You might need to pass actual headers here
        });
        if (!session?.user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });
        return {
            success: true,
            result: user,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
}

export const updateProfile = async (data: ProfileUpdateSchemaType) => {
    try {
        ProfileUpdateSchema.parse(data);

        const session = await auth.api.getSession({
            headers: await headers() // You might need to pass actual headers here

        });
        if (!session?.user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                phone: data.phone || null,
            },
        });

        return {
            success: true,
            result: user,
        };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
}