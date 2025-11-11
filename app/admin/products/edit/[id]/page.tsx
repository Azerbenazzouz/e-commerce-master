"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductById } from '@/actions/productsAction'
import ProductForm from '@/components/admin/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'

const ProductEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Prisma.ProductGetPayload<{ include: { category: true } }> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(productId)
        if (result.success && result.result) {
          setProduct(result.result as Prisma.ProductGetPayload<{ include: { category: true } }>)
        } else {
          setError(result.error || 'Produit non trouvé')
          notFound()
        }
      } catch {
        setError('Erreur lors du chargement du produit')
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleSuccess = () => {
    router.push(`/admin/products/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Erreur
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {error || 'Produit non trouvé'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/products/${productId}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Modifier le produit
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {product.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm 
        initialData={product} 
        isEditing={true} 
        onSuccess={handleSuccess} 
      />
    </div>
  )
}

export default ProductEditPage