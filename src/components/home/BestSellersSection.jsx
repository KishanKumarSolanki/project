import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard'

function BestSellersSection({ bestSellers, addToCart, toggleWishlist, wishlist }) {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
          <div>
            <h2 className="text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-5xl">Best sellers</h2>
            <p className="mt-2 text-sm text-[#71645b] sm:text-lg">What shoppers love most right now</p>
          </div>
          <Link to="/shop?sort=popular" className="mb-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#b98791] sm:gap-2 sm:text-base">View all <ArrowRight size={18} /></Link>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:gap-5 sm:px-0">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellersSection
