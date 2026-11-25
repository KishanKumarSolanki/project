import BenefitsSection from '../components/home/BenefitsSection'
import BestSellersSection from '../components/home/BestSellersSection'
import CategorySection from '../components/home/CategorySection'
import HeroSection from '../components/home/HeroSection'
import NewArrivalsSection from '../components/home/NewArrivalsSection'
import StorySection from '../components/home/StorySection'
import TestimonialsSection from '../components/home/TestimonialsSection'

function HomePage({ addToCart, toggleWishlist, wishlist, products, categories }) {
  const bestSellers = products.slice(0, 4)
  const featuredProducts = products.slice(4, 8)

  return (
    <>
      <HeroSection />
      {categories.length > 0 && <CategorySection categories={categories} />}
      {bestSellers.length > 0 && (
        <BestSellersSection
          bestSellers={bestSellers}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}
      {featuredProducts.length > 0 && (
        <NewArrivalsSection
          featuredProducts={featuredProducts}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}
      <BenefitsSection />
      <StorySection />
      <TestimonialsSection />
    </>
  )
}

export default HomePage
