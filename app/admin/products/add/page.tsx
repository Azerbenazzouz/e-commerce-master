"use client"

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/admin/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ProductAddPage = () => {
  const router = useRouter()

  const handleSuccess = (product: unknown) => {
    router.push(`/admin/products/${(product as { id: string }).id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Ajouter un produit
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Créez un nouveau produit pour votre catalogue
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm isEditing={false} onSuccess={handleSuccess} />
    </div>
  )
}

export default ProductAddPage
