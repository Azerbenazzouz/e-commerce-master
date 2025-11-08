
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Star } from "lucide-react"
import * as React from "react"
import { categories } from "@/lib/products-data"

interface FilterContentProps {
  selectedCategory: string
  priceRange: number[]
  minRating: number
  onCategoryChange: (category: string) => void
  onPriceChange: (range: number[]) => void
  onRatingChange: (rating: number) => void
  onReset: () => void
}

const RATING_OPTIONS = [0, 3, 4, 4.5] as const

export const FilterContent: React.FC<FilterContentProps> = ({
  selectedCategory,
  priceRange,
  minRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      {/* Filtre Catégorie */}
      <div>
        <Label className="mb-3 block text-sm font-semibold">Catégorie</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={selectedCategory === category ? "bg-accent text-accent-foreground" : ""}
              aria-pressed={selectedCategory === category}
              aria-label={`Filtrer par catégorie ${category}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Filtre Prix */}
      <div>
        <Label className="mb-3 block text-sm font-semibold">
          Plage de prix: <span className="text-accent">{priceRange[0]} TND - {priceRange[1]} TND</span>
        </Label>
        <Slider
          min={0}
          max={1500}
          step={10}
          value={priceRange}
          onValueChange={onPriceChange}
          className="mt-2"
          aria-label="Filtre de prix"
        />
      </div>

      {/* Filtre Notation */}
      <div>
        <Label className="mb-3 block text-sm font-semibold">Note minimum</Label>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onRatingChange(rating)}
              className={minRating === rating ? "bg-accent text-accent-foreground" : ""}
              aria-pressed={minRating === rating}
              aria-label={rating === 0 ? "Montrer tous les produits" : `Produits avec au moins ${rating} étoiles`}
            >
              {rating === 0 ? "Tous" : `${rating}+`}
              {rating > 0 && <Star className="ml-1 h-3 w-3 fill-current" aria-hidden="true" />}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={onReset} 
        className="w-full bg-transparent"
        aria-label="Réinitialiser tous les filtres"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  )
}