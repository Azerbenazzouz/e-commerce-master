"use client"

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Edit,
  Calendar,
  Package,
  Star,
  TrendingUp,
  Tag,
  Clock
} from 'lucide-react'
import { getProductById } from '@/actions/productsAction'
import { FullProduct } from '@/model/ProductModel'

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<FullProduct>()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      await getProductById(id)
        .then((res) => {
          if (res.success && res.result) {
            setProduct(res.result as FullProduct)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-muted-foreground'>Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'

  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : Object.entries(product.specifications as Record<string, unknown>).map(([key, value]) => ({ label: key, value: String(value) }))

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link href="/admin/products" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour aux produits
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
            <div className="flex gap-2">
              {product.isNew && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400">Nouveau</Badge>}
              <Badge variant={product.stock > 0 ? 'outline' : 'destructive'} className={product.stock > 0 ? "text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20" : ""}>
                {product.stock > 0 ? 'En Stock' : 'Épuisé'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span>{product.category?.name || 'Non catégorisé'}</span>
          </div>
        </div>

        <Link href={`/admin/products/edit/${product.id}`}>
          <Button className="gap-2 shadow-sm">
            <Edit className="h-4 w-4" />
            Modifier le produit
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Image Gallery */}
          <Card className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
              {product.images && product.images.length > 0 ? (
                <div className="grid gap-4">
                  {/* Main Featured Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 px-6 pb-6">
                      {product.images.slice(1).map((image, index) => (
                        <div
                          key={image.id}
                          className="relative aspect-square overflow-hidden rounded-md border bg-muted/30 hover:ring-2 ring-primary/50 transition-all cursor-pointer"
                        >
                          <Image
                            src={image.url}
                            alt={image.altText || `${product.name} - ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-muted/10">
                  <div className="text-center space-y-2">
                    <div className="relative w-24 h-24 mx-auto opacity-20">
                      <Image src={DEFAULT_IMAGE} alt="No image" fill className="object-contain" />
                    </div>
                    <p className="text-muted-foreground">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          {specifications && specifications.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Spécifications Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {specifications.map((spec, index) => {
                    if (typeof spec === 'object' && spec !== null && 'label' in spec && 'value' in spec) {
                      return (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="text-sm font-medium text-muted-foreground">
                            {spec.label as string}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {spec.value as string}
                          </span>
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
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Avis Clients</CardTitle>
                  <Badge variant="secondary">{product.reviews.length} avis</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={review.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {(review.user?.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {review.user?.name || 'Utilisateur Anonyme'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                        <span className="font-bold text-yellow-600 dark:text-yellow-500 text-sm mr-1">{review.rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-11">
                      {review.comment}
                    </p>
                    {index < (product.reviews?.length || 0) - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">

          {/* Price & Stock Card */}
          <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prix de vente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toFixed(2)} <span className="text-xl">TND</span>
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                    {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Stock
                  </div>
                  <p className="text-xl font-semibold">{product.stock}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Popularité
                  </div>
                  <p className="text-xl font-semibold">{product.popularity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Note globale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">{product.rating.toFixed(1)}</span>
                <div className="mb-2 flex flex-col">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-muted/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Basé sur {product.reviews?.length || 0} avis</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card className="shadow-sm bg-muted/30">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Créé le
                </div>
                <span className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Modifié le
                </div>
                <span className="font-medium">
                  {new Date(product.updatedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage