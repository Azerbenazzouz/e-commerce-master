"use client"

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProductById } from '@/actions/productsAction'
import { FullProduct } from '@/model/ProductModel'

const ProductDetailsPage = () => {
    const [product, setProduct] = useState<FullProduct>()
    const params = useParams()
    const id = params.id as string

    useEffect(() => {
        const fetchProduct = async () => {
            await getProductById(id)
                .then((res) => {
                    if (res.success && res.result) {
                        setProduct(res.result as FullProduct)
                    }
                })
        }
        fetchProduct()
    }, [id])

  if (!product) {
    notFound()
  }

  const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'

  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : Object.entries(product.specifications as Record<string, unknown>).map(([key, value]) => ({ label: key, value: String(value) }))

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {product.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {product.category?.name}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="text-center">
                    <Image
                      src={DEFAULT_IMAGE}
                      alt="No image"
                      width={100}
                      height={100}
                      className="mx-auto mb-2 opacity-50"
                    />
                    <p className="text-slate-500 dark:text-slate-400">
                      Aucune image
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Prix
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {product.price.toFixed(2)} TND
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-slate-500 line-through">
                    {product.originalPrice.toFixed(2)} TND
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Stock
                </div>
                <Badge
                  variant={product.stock > 0 ? 'default' : 'destructive'}
                  className="text-base"
                >
                  {product.stock} unités
                </Badge>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Note
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-yellow-400 text-xl">★</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Popularité
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {product.popularity}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex gap-2">
                {product.isNew && (
                  <Badge className="flex-1 justify-center">Nouveau</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-slate-600 dark:text-slate-400 mb-1">
                  Créé
                </div>
                <div className="text-slate-900 dark:text-slate-100">
                  {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="text-slate-600 dark:text-slate-400 mb-1">
                  Modifié
                </div>
                <div className="text-slate-900 dark:text-slate-100">
                  {new Date(product.updatedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Link href={`/admin/products/edit/${product.id}`}>
            <Button className="w-full">Modifier le produit</Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </CardContent>
      </Card>

      {/* Specifications */}
      {specifications && specifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spécifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {specifications.map((spec, index) => {
                if (typeof spec === 'object' && spec !== null && 'label' in spec && 'value' in spec) {
                  return (
                    <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {spec.label as string}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {spec.value as string}
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avis ({product.reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {review.user?.name || 'Anonyme'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{review.rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {review.comment}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductDetailsPage