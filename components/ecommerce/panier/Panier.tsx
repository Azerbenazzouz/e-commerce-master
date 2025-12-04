"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderSchema } from "@/schema/orderSchema";
import { createOrder } from "@/actions/orderActions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Panier = () => {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = authClient.useSession();

    const form = useForm<OrderSchema>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            name: "",
            address: "",
            email: "",
            phone: "",
            items: [],
            total: 0,
        },
    });

    // Update form default values when session loads
    useEffect(() => {
        if (session?.user) {
            form.setValue("name", session.user.name || "");
            form.setValue("email", session.user.email || "");
            // form.setValue("image", session.user.image || ""); // Not in schema
            // If address and phone are in user object, set them too. 
            // Based on schema, they might be.
            // Let's assume they are available on the user object or we might need to fetch profile.
            // For now, we'll try to set them if they exist.
            if ((session.user as any).address) form.setValue("address", (session.user as any).address);
            if ((session.user as any).phone) form.setValue("phone", (session.user as any).phone);
        }
    }, [session, form]);

    // Update items and total in form when cart changes
    useEffect(() => {
        form.setValue(
            "items",
            items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
            }))
        );
        form.setValue("total", totalPrice);
    }, [items, totalPrice, form]);

    const onSubmit = async (data: OrderSchema) => {
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createOrder(data);
            if (result.success) {
                clearCart();
                toast.success("Order placed successfully!");
                router.push("/panier/success");
            } else {
                toast.error(result.error || "Failed to place order");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-8">Add some products to your cart to continue.</p>
                <Button onClick={() => router.push("/products")}>Browse Products</Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    {...form.register("name")}
                                    placeholder="John Doe"
                                />
                                {form.formState.errors.name && (
                                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...form.register("email")}
                                    placeholder="john@example.com"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    {...form.register("phone")}
                                    placeholder="+1 234 567 890"
                                />
                                {form.formState.errors.phone && (
                                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    {...form.register("address")}
                                    placeholder="123 Main St, City, Country"
                                />
                                {form.formState.errors.address && (
                                    <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Panier;