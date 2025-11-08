"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { allProducts, type Product } from "@/lib/products-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { FilterContent } from "@/components/ecommerce/products/productsFilter"
import { ProductCard } from "@/components/ecommerce/products/ProductCard"

const ITEMS_PER_PAGE = 12
const DEFAULT_PRICE_RANGE = [0, 1500] as const

const generateArray = (length: number) => Array.from({ length }, (_, i) => i)

export default function ProductsPage() {
  const { addItem } = useCart()
  
  // États
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [priceRange, setPriceRange] = useState<number[]>([...DEFAULT_PRICE_RANGE])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  const handlePriceChange = useCallback((range: number[]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }, [])

  const handleRatingChange = useCallback((rating: number) => {
    setMinRating(rating)
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSelectedCategory("Tous")
    setPriceRange([...DEFAULT_PRICE_RANGE])
    setMinRating(0)
    setCurrentPage(1)
  }, [])

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }, [addItem])

  // Filtre et tri optimisés avec useMemo =>✅ will be from the backend
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const categoryMatch = selectedCategory === "Tous" || product.category === selectedCategory
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      const ratingMatch = product.rating >= minRating
      return categoryMatch && priceMatch && ratingMatch
    })

    // Tri des produits
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "popularity":
          return b.popularity - a.popularity
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, priceRange, minRating, sortBy])

  // Pagination ✅ will be from the backend
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // Compte des produits ✅ will be from the backend
  const productCount = filteredAndSortedProducts.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* En-tête */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-balance mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Catalogue de produits
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Découvrez notre sélection de {allProducts.length} produits de qualité
          </p>
        </div>

        {/* Contrôles - Mobile First */}
        <div className="mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bouton filtre mobile */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="lg:hidden bg-transparent text-xs sm:text-sm"
                  aria-label="Ouvrir les filtres"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>Affinez votre recherche de produits</SheetDescription>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto">
                  <FilterContent
                    selectedCategory={selectedCategory}
                    priceRange={priceRange}
                    minRating={minRating}
                    onCategoryChange={(cat) => {
                      handleCategoryChange(cat)
                      setSheetOpen(false)
                    }}
                    onPriceChange={handlePriceChange}
                    onRatingChange={handleRatingChange}
                    onReset={() => {
                      handleResetFilters()
                      setSheetOpen(false)
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <p className="text-xs text-muted-foreground sm:text-sm">
              {productCount} produit{productCount !== 1 ? "s" : ""} trouvé{productCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Label htmlFor="sort" className="font-medium shrink-0">
              Trier:
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-[140px] sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="price-asc">Prix ↑</SelectItem>
                <SelectItem value="price-desc">Prix ↓</SelectItem>
                <SelectItem value="newest">Nouveautés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contenu principal - Mobile First Layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Barre latérale filtre - Desktop only */}
          <aside className="hidden w-full lg:block lg:w-64 shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-4 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold">Filtres</h2>
                <FilterContent 
                  selectedCategory={selectedCategory}
                  priceRange={priceRange}
                  minRating={minRating}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onRatingChange={handleRatingChange}
                  onReset={handleResetFilters}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Grille des produits */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  Aucun produit ne correspond à vos critères
                </p>
                <Button 
                  onClick={handleResetFilters}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Réinitialiser les filtres
                </Button>
              </Card>
            ) : (
              <>
                {/* Grille responsive - mobile first */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav 
                    className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      size="sm"
                      aria-label="Page précédente"
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex gap-1">
                      {generateArray(totalPages).map((i) => {
                        const pageNum = i + 1
                        // Affichage intelligent des pages
                        const showPage = 
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)

                        if (!showPage && pageNum === currentPage - 2) {
                          return <span key="ellipsis-start" className="px-1">…</span>
                        }
                        if (!showPage && pageNum === currentPage + 2) {
                          return <span key="ellipsis-end" className="px-1">…</span>
                        }

                        return showPage ? (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
                            size="sm"
                            aria-label={`Page ${pageNum}`}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                          >
                            {pageNum}
                          </Button>
                        ) : null
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      size="sm"
                      aria-label="Page suivante"
                    >
                      Suivant
                    </Button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
