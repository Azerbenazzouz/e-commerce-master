"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye, TrendingUp, Zap, Tag } from "lucide-react"
import Link from "next/link"
import { allProducts } from "@/lib/products-data"
import { useCart } from "@/context/cart-context"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

const products = allProducts.slice(0, 8)

export function FeaturedProducts() {
  const { addItem } = useCart()
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set())

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    
    // Visual feedback
    setAddedToCart(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedToCart(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 2000)
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return null
    
    const styles = {
      "Nouveau": { icon: Zap, class: "bg-blue-500/90 text-white" },
      "Promo": { icon: Tag, class: "bg-red-500/90 text-white" },
      "Top vente": { icon: TrendingUp, class: "bg-green-500/90 text-white" },
    }
    
    return styles[badge as keyof typeof styles] || { icon: Tag, class: "bg-accent text-accent-foreground" }
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Produits vedettes
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Découvrez notre sélection des meilleurs produits du moment
            </p>
          </div>
          <Link href="/produits">
            <Button variant="outline" className="group">
              Voir tout
              <ShoppingCart className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </Link>
        </div>

        {/* Products Grid - Mobile First */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice)
            const badgeStyle = getBadgeStyle(product.badge)
            const isFavorite = favorites.has(product.id)
            const justAdded = addedToCart.has(product.id)

            return (
              <Card 
                key={product.id} 
                className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-0 relative">
                  {/* Image Container */}
                  <Link href={`/produits/${product.id}`} className="block relative">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Quick actions overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Aperçu rapide
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex flex-col gap-2">
                      {product.badge && badgeStyle && (
                        <Badge className={cn("backdrop-blur-sm shadow-lg text-xs", badgeStyle.class)}>
                          <badgeStyle.icon className="mr-1 h-3 w-3" />
                          {product.badge}
                        </Badge>
                      )}
                      {discount > 0 && (
                        <Badge className="bg-red-500/90 text-white backdrop-blur-sm shadow-lg text-xs font-bold">
                          -{discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(product.id)
                      }}
                      className={cn(
                        "absolute right-2 top-2 sm:right-3 sm:top-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-lg",
                        isFavorite 
                          ? "bg-red-500 text-white scale-110" 
                          : "bg-white/80 text-gray-600 hover:bg-white hover:scale-110"
                      )}
                      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart 
                        className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} 
                      />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 space-y-2">
                    <Link href={`/produits/${product.id}`}>
                      <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-10 sm:min-h-12">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors",
                              i < Math.floor(product.rating) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        {product.price} TND
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through">
                          {product.originalPrice} TND
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Footer with CTA */}
                <CardFooter className="p-3 sm:p-4 pt-0">
                  <Button
                    className={cn(
                      "w-full transition-all duration-300 group/btn",
                      justAdded 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                  >
                    <ShoppingCart className={cn(
                      "mr-2 h-4 w-4 transition-transform",
                      justAdded ? "scale-0" : "group-hover/btn:scale-110"
                    )} />
                    <span className="text-xs sm:text-sm font-medium">
                      {justAdded ? "✓ Ajouté au panier" : "Ajouter au panier"}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
