"use server"

import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { orderSchema } from "@/schema/orderSchema";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getOrders({
    page = 1,
    limit = 10,
    search = "",
    status,
}: {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
}) {
    const skip = (page - 1) * limit;

    const where: any = {
        OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { id: { contains: search, mode: "insensitive" } },
        ],
    };

    if (status) {
        where.status = status;
    }

    try {
        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        const totalPages = Math.ceil(totalOrders / limit);

        return { orders, totalOrders, totalPages };
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
}

export async function getUserOrders() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return [];
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw new Error("Failed to fetch user orders");
    }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        const currentStatus = order.status;

        let stockAdjustment = 0;

        const isShippedOrDelivered = (s: OrderStatus) =>
            s === OrderStatus.SHIPPED || s === OrderStatus.DELIVERED;

        if (!isShippedOrDelivered(currentStatus) && isShippedOrDelivered(newStatus)) {
            // Pending -> Shipped/Delivered
            // Stock already decremented at creation, so no change needed unless we want to be strict.
            // But wait, if we consider Pending as "Reserved", then Shipped is just "Gone".
            // So no stock adjustment needed here if createOrder decrements.
            stockAdjustment = 0;
        } else if (isShippedOrDelivered(currentStatus) && newStatus === OrderStatus.CANCELLED) {
            // Shipped/Delivered -> Cancelled
            // Item returned to stock
            stockAdjustment = 1;
        } else if (currentStatus === OrderStatus.PENDING && newStatus === OrderStatus.CANCELLED) {
            // Pending -> Cancelled
            // Release reservation
            stockAdjustment = 1;
        } else if (currentStatus === OrderStatus.CANCELLED && newStatus === OrderStatus.PENDING) {
            // Cancelled -> Pending
            // Re-reserve
            stockAdjustment = -1;
        } else if (currentStatus === OrderStatus.CANCELLED && isShippedOrDelivered(newStatus)) {
            // Cancelled -> Shipped/Delivered
            // Take from stock
            stockAdjustment = -1;
        }

        await prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: { status: newStatus },
            });

            // Update stock if needed
            if (stockAdjustment !== 0) {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity * stockAdjustment,
                            },
                        },
                    });
                }
            }
        });

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Failed to update order status" };
    }
}


export async function createOrder(data: z.infer<typeof orderSchema>) {
    const result = orderSchema.safeParse(data);

    if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
    }

    const { name, address, email, phone, items, total } = result.data;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    try {
        const order = await prisma.$transaction(async (tx) => {
            // Check stock for all items first
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }
            }

            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    name,
                    address,
                    email,
                    phone,
                    total,
                    userId: session?.user?.id,
                    status: OrderStatus.PENDING,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            // Update stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        return { success: true, orderId: order.id };
    } catch (error: any) {
        console.error("Error creating order:", error);
        return { success: false, error: error.message || "Failed to create order" };
    }
}

export async function cancelOrder(orderId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        if (order.userId !== session.user.id) {
            return { success: false, error: "Unauthorized" };
        }

        if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
            return { success: false, error: "Cannot cancel shipped or delivered order" };
        }

        if (order.status === OrderStatus.CANCELLED) {
            return { success: false, error: "Order already cancelled" };
        }

        await prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED },
            });

            // Restore stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }
        });

        revalidatePath("/orders");
        return { success: true };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, error: "Failed to cancel order" };
    }
}
