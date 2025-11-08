import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { type Product } from "@/lib/products-data"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const generateArray = (length: number) => Array.from({ length }, (_, i) => i)


export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <Link href={`/produits/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            {product.badge && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground text-xs sm:text-sm">
                {product.badge}
              </Badge>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="mb-2 text-balance text-sm font-semibold leading-tight line-clamp-2 sm:text-base">
              {product.name}
            </h3>
            {/* Notation avec accessibilité */}
            <div className="mb-3 flex items-center gap-1">
              <div className="flex" role="img" aria-label={`Note: ${product.rating} sur 5 étoiles`}>
                {generateArray(5).map((i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground sm:text-sm">({product.reviews})</span>
            </div>
            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold sm:text-2xl">{product.price} TND</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through sm:text-sm">
                  {product.originalPrice} TND
                </span>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          className="w-full bg-accent text-accent-foreground transition-colors hover:bg-accent/90 text-xs sm:text-sm"
          onClick={() => onAddToCart(product)}
          aria-label={`Ajouter ${product.name} au panier`}
        >
          <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ajouter au panier</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </CardFooter>
    </Card>
  )
}