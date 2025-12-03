import { Order, OrderItem, Product } from "@prisma/client";
import { User } from "better-auth";

export interface FullOrder extends Order {
    user?: User
    items: FullOrderItem[]
}

export interface FullOrderItem extends OrderItem {
    product: Product
}