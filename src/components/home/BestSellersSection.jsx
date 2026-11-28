import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard'

function BestSellersSection({ bestSellers, addToCart, toggleWishlist, wishlist }) {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
          <div className="min-w-0 text-left">
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-5xl">Best sellers</h2>
            <p className="mt-1.5 text-sm text-[#71645b] sm:mt-2 sm:text-lg">What shoppers love most right now</p>
          </div>
          <Link
            to="/shop?sort=popular"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d6cbb5] bg-[#fffdf7] px-3.5 py-2 text-xs font-semibold tracking-wide text-[#2c1e19] shadow-sm transition duration-300 hover:border-[#b88a3e] hover:bg-[#2c1e19] hover:text-white hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View all
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellersSection
