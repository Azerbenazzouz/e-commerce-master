"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Star, Minus, Plus, ShoppingCart, Check, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductById, getSimilarProducts } from "@/actions/productsAction"
import { FullProduct } from "@/model/ProductModel"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import Image from "next/image"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string // ID is string in DB
  const { addItem } = useCart()

  const [product, setProduct] = useState<FullProduct | null>(null)
  const [similarProducts, setSimilarProducts] = useState<FullProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const productRes = await getProductById(productId)
        if (productRes.success && productRes.result) {
          const prod = productRes.result as FullProduct
          setProduct(prod)

          if (prod.categoryId) {
            const similarRes = await getSimilarProducts(prod.id, prod.categoryId)
            if (similarRes.success && similarRes.result) {
              setSimilarProducts(similarRes.result as FullProduct[])
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data", error)
      } finally {
        setLoading(false)
      }
    }
    if (productId) {
      fetchData()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Link href="/produits">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images.map(img => img.url)
  // Fallback if no images
  if (images.length === 0) images.push("/placeholder.svg")

  const reviews = product.reviews

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
      })
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < (product.stock || 99)) setQuantity(quantity + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-foreground">
              Produits
            </Link>
            <span>/</span>
            <Link href={`/produits?category=${product.category?.name || 'Tous'}`} className="hover:text-foreground">
              {product.category?.name || 'Catégorie'}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                    }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.isNew && (
                <Badge className="mb-3 bg-blue-500 hover:bg-blue-600">
                  Nouveau
                </Badge>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-balance">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({reviews.length} avis)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{product.price.toFixed(2)} TND</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.originalPrice.toFixed(2)} TND</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock && product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">En stock ({product.stock} disponibles)</span>
                </>
              ) : (
                <span className="text-destructive font-medium">Rupture de stock</span>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">{product.description}</p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantité :</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    disabled={quantity >= (product.stock || 99)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Truck className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Livraison gratuite</div>
                  <div className="text-muted-foreground">Dès 50TND d&#39;achat</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Garantie 2 ans</div>
                  <div className="text-muted-foreground">Produit certifié</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <RotateCcw className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Retour gratuit</div>
                  <div className="text-muted-foreground">Sous 30 jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (product.specifications as any[]).length > 0 && (
          <Card className="p-6 mb-16">
            <h2 className="text-2xl font-bold mb-6">Caractéristiques techniques</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(product.specifications as any[]).map((spec, index) => (
                <div key={index} className="flex justify-between py-3 border-b last:border-0">
                  <span className="font-medium">{spec.label}</span>
                  <span className="text-muted-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.user?.name || "Anonyme"}</span>
                      {/* {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Achat vérifié
                        </Badge>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link key={similarProduct.id} href={`/produits/${similarProduct.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <Image
                        src={similarProduct.images[0]?.url || "/placeholder.svg"}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{similarProduct.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(similarProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                              }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({similarProduct.reviews.length})</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">{similarProduct.price.toFixed(2)} TND</span>
                        {similarProduct.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {similarProduct.originalPrice.toFixed(2)} TND
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
