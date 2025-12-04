"use client"

import React, { useTransition } from 'react'
import { OrderStatus } from '@prisma/client'
import { cancelOrder } from '@/actions/orderActions'
import { format } from 'date-fns'
import { Loader2, Package, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
    }
}

interface Order {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: Date | string;
    items: OrderItem[];
}

const MyOrders = ({ orders }: { orders: Order[] }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCancel = async (orderId: string) => {
        startTransition(async () => {
            const result = await cancelOrder(orderId);
            if (result.success) {
                toast.success("Order cancelled successfully");
                // router.refresh(); 
            } else {
                toast.error(result.error || "Failed to cancel order");
            }
        });
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20';
            case 'SHIPPED': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20';
            case 'DELIVERED': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20';
            case 'CANCELLED': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No orders found</h3>
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-base">Order #{order.id.slice(-8)}</CardTitle>
                                <CardDescription>
                                    Placed on {format(new Date(order.createdAt), "PPP")}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                    {order.status}
                                </Badge>
                                <span className="font-bold text-lg ml-4">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {item.quantity}x {item.product.name}
                                    </span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    {order.status === 'PENDING' && (
                        <CardFooter className="bg-muted/40 p-4 flex justify-end">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isPending}>
                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                        Cancel Order
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will cancel your order and refund the items to stock.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancel(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Confirm Cancellation
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    )}
                </Card>
            ))}
        </div>
    )
}

export default MyOrders