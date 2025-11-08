import { HeroCarousel } from "@/components/ecommerce/hero-carousel";
import { CategoryCards } from "@/components/ecommerce/category-cards";
import { FeaturedProducts } from "@/components/ecommerce/featured-products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <CategoryCards />
      <FeaturedProducts />
    </div>
  );
}
