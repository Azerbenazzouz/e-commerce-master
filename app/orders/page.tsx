"use client"

import { useEffect, useState } from 'react'
import { getUserOrders } from '@/actions/orderActions'
import MyOrders from '@/components/ecommerce/myorders/MyOrders'
import { Loader2 } from 'lucide-react'

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getUserOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-background">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>
                <MyOrders orders={orders} />
            </div>
        </div>
    )
}

export default MyOrdersPage