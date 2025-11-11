"use client"

import { Suspense } from "react"
import { ProductsPageContent } from "@/components/ecommerce/products/ProductsPageContent"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ProductsLoadingFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <Skeleton className="mb-2 h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        {/* Controls skeleton */}
        <div className="mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Products grid skeleton */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden w-64 lg:block">
            <Card className="sticky top-4 p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </Card>
          </div>

          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoadingFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}
