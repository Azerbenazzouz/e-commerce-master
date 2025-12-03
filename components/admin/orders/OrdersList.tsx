"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getOrders, updateOrderStatus } from "@/actions/orderActions";
import { FullOrder } from "@/model/OrderModel";
import { OrderStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const OrdersList = () => {
    const [orders, setOrders] = useState<FullOrder[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    // Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Selected Order for Details
    const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders({
                page,
                limit,
                search,
                status: status === "ALL" ? undefined : status,
            });
            setOrders(res.orders as FullOrder[]);
            setTotalOrders(res.totalOrders);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, search, status]);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        startTransition(async () => {
            const res = await updateOrderStatus(orderId, newStatus);
            if (res.success) {
                toast.success("Order status updated");
                fetchOrders();
            } else {
                toast.error(res.error || "Failed to update status");
            }
        });
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "SHIPPED":
                return "bg-blue-500 hover:bg-blue-600";
            case "DELIVERED":
                return "bg-green-500 hover:bg-green-600";
            case "CANCELLED":
                return "bg-red-500 hover:bg-red-600";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, Name, or Email"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to page 1 on search
                            }}
                            className="pl-8"
                        />
                    </div>
                    <div className="w-full md:w-[200px]">
                        <Select
                            value={status}
                            onValueChange={(val) => {
                                setStatus(val as OrderStatus | "ALL");
                                setPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                {Object.values(OrderStatus).map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.id.slice(-8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                        </TableCell>
                                        <TableCell>${order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onValueChange={(val) =>
                                                    handleStatusChange(order.id, val as OrderStatus)
                                                }
                                                disabled={isPending}
                                            >
                                                <SelectTrigger
                                                    className={`w-[130px] text-white border-none ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(OrderStatus).map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {s}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setDetailsOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Details Dialog */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                                Order ID: {selectedOrder?.id}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Customer Info</h3>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Name:</span> {selectedOrder.name}</p>
                                            <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                                            <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                                            <p><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Order Info</h3>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Date:</span> {format(new Date(selectedOrder.createdAt), "PPP p")}</p>
                                            <p><span className="font-medium">Status:</span> <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                                            <p><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Order Items</h3>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead className="text-right">Price</TableHead>
                                                    <TableHead className="text-right">Quantity</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedOrder.items.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.product.name}</TableCell>
                                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default OrdersList;