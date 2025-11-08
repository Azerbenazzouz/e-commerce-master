import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Shirt, Home, Dumbbell, Sparkles, Book, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Électronique",
    icon: Smartphone,
    image: "/electronics-devices.jpg",
    count: "2,450 produits",
    href: "/produits?category=Électronique",
    color: "from-blue-500/80 to-cyan-500/80",
    featured: true,
  },
  {
    name: "Mode",
    icon: Shirt,
    image: "/diverse-fashion-collection.png",
    count: "3,890 produits",
    href: "/produits?category=Mode",
    color: "from-pink-500/80 to-rose-500/80",
    featured: true,
  },
  {
    name: "Maison & Jardin",
    icon: Home,
    image: "/home-garden-decor.jpg",
    count: "1,670 produits",
    href: "/produits?category=Maison & Jardin",
    color: "from-green-500/80 to-emerald-500/80",
  },
  {
    name: "Sports & Loisirs",
    icon: Dumbbell,
    image: "/assorted-sports-gear.png",
    count: "980 produits",
    href: "/produits?category=Sports & Loisirs",
    color: "from-orange-500/80 to-amber-500/80",
  },
  {
    name: "Beauté & Santé",
    icon: Sparkles,
    image: "/beauty-cosmetics.png",
    count: "1,230 produits",
    href: "/produits?category=Beauté & Santé",
    color: "from-purple-500/80 to-fuchsia-500/80",
  },
  {
    name: "Livres",
    icon: Book,
    image: "/books-library.jpg",
    count: "5,670 produits",
    href: "/produits?category=Livres",
    color: "from-indigo-500/80 to-blue-500/80",
  },
]

export function CategoryCards() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header with better spacing */}
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Explorez nos catégories
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez notre sélection de produits organisés par catégorie pour faciliter votre shopping
          </p>
        </div>

        {/* Advanced Grid Layout - Featured + Regular */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            const isFeatured = category.featured
            
            return (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "group relative",
                  // Featured items take 2 columns on desktop, full on mobile
                  isFeatured && "lg:col-span-2"
                )}
              >
                <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                  <CardContent className="p-0 relative h-full">
                    {/* Dynamic height based on featured status */}
                    <div className={cn(
                      "relative overflow-hidden",
                      isFeatured ? "aspect-video sm:aspect-21/9" : "aspect-square sm:aspect-4/5"
                    )}>
                      {/* Image with parallax effect */}
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                        sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"}
                      />
                      
                      {/* Gradient overlays - colored based on category */}
                      <div className={cn(
                        "absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      )} />
                      <div className={cn(
                        "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                        category.color
                      )} />

                      {/* Content */}
                      <div className="absolute inset-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
                        {/* Top: Icon with colored background */}
                        <div className="flex justify-between items-start">
                          <div className={cn(
                            "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg",
                            "bg-white/20 group-hover:bg-white/30"
                          )}>
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1">
                            <ArrowRight className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Bottom: Category info */}
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className={cn(
                            "font-bold text-white transition-all duration-300 group-hover:translate-x-1",
                            isFeatured ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg lg:text-xl"
                          )}>
                            {category.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-xs sm:text-sm text-white/80 font-medium transition-all duration-300 group-hover:text-white">
                              {category.count}
                            </p>
                            {isFeatured && (
                              <span className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm text-white/90 font-medium group-hover:text-white transition-colors">
                                Découvrir
                                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Featured badge */}
                      {isFeatured && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                          <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary-foreground shadow-lg">
                            Populaire
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <Link 
            href="/produits"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-foreground/80 hover:text-foreground transition-colors group"
          >
            Voir toutes les catégories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
