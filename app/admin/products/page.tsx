import React, { Suspense } from 'react'
import ProductsList from '@/components/admin/products/ProductsList'
import { ProductsLoadingSkeleton } from '@/components/admin/products/ProductsLoadingSkeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllCategories } from '@/actions/categoriesAction'

async function getCategories() {
  try {
    const categories = await getAllCategories()
    .then(res => {
      if (res.success && res.result) {
        return res.result
      }
      return []
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function ProductListPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Gestion des Produits
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      {/* Products List */}
      <Suspense fallback={<ProductsLoadingSkeleton rows={10} />}>
        <ProductsList categories={categories ?? []} />
      </Suspense>
    </div>
  )
}