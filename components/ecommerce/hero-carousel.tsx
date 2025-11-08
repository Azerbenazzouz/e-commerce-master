"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Nouvelle Collection Printemps",
    description: "Découvrez les dernières tendances de la saison",
    image: "/spring-fashion.png",
    cta: "Découvrir",
    href: "/produits?category=Mode",
    badge: "Nouveau",
  },
  {
    id: 2,
    title: "Promotions Exceptionnelles",
    description: "Jusqu'à -50% sur une sélection de produits",
    image: "/sale-promotion-banner.jpg",
    cta: "Profiter",
    href: "/promotions",
    badge: "-50%",
  },
  {
    id: 3,
    title: "Nouveautés Tech",
    description: "Les derniers gadgets et innovations technologiques",
    image: "/technology-gadgets.jpg",
    cta: "Explorer",
    href: "/produits?category=Électronique",
    badge: "Tech",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-muted to-muted/50 shadow-lg">
      {/* Mobile-first: taller on mobile, wider on desktop */}
      <div className="relative aspect-video sm:aspect-21/9 md:aspect-21/7">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105",
            )}
          >
            <Image 
              src={slide.image || "/placeholder.svg"} 
              alt={slide.title} 
              className="h-full w-full object-cover" 
              fill
              priority={index === 0}
            />
            {/* Gradient overlay - stronger on mobile for text readability */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30 sm:from-black/70 sm:via-black/50 sm:to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Content - Mobile-first layout */}
            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="container mx-auto px-4 pb-16 sm:pb-0 sm:px-6 lg:px-8">
                <div className="max-w-full px-6 sm:px-4 sm:max-w-2xl space-y-2 sm:space-y-4 md:space-y-6">                  
                  {/* Title - Smaller on mobile */}
                  <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-left-6 duration-700 delay-100">
                    {slide.title}
                  </h2>
                  
                  {/* Description - More concise on mobile */}
                  <p className="text-pretty text-sm text-white/90 sm:text-base md:text-lg lg:text-xl max-w-lg animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-left-8 duration-700 delay-200">
                    {slide.description}
                  </p>
                  
                  {/* CTA Buttons - Stack on mobile, horizontal on desktop */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-left-10 duration-700 delay-300">
                    <Link href={slide.href} className="w-full sm:w-auto">
                      <Button 
                        size="default"
                        className="w-full sm:w-auto sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/produits" className="w-full sm:w-auto">
                      <Button 
                        size="default"
                        variant="outline"
                        className="w-full sm:w-auto sm:px-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 shadow-lg transition-all duration-300"
                      >
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons - Smaller and positioned better on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
        onClick={goToPrevious}
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
        onClick={goToNext}
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      {/* Dots indicator - Smaller on mobile */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "w-6 sm:w-8 bg-white shadow-lg" 
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/70",
            )}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
