import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h1 className="text-3xl font-bold">Order Passed Successfully!</h1>
            <p className="text-muted-foreground max-w-md">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="flex gap-4 mt-4">
                <Button asChild variant="outline">
                    <Link href="/">Return Home</Link>
                </Button>
                <Button asChild>
                    <Link href="/produits">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}
