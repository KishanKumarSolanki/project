import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/formatPrice'
import ImageWithFallback from './ImageWithFallback'

function WishlistProductCard({ product, toggleWishlist, isWishlisted = true }) {
  return (
    <motion.article
      className="relative min-w-0 overflow-hidden rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] shadow-[0_6px_18px_rgba(44,30,25,0.05)]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="group block">
          <div className="relative aspect-[0.78] overflow-hidden bg-[#ede7db]">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#2c1e19] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
              {product.badge || 'Handwoven'}
            </span>
            {product.discount > 0 && (
              <span className="absolute right-2.5 top-2.5 rounded-full bg-[#009e78] px-2.5 py-1 text-[10px] font-bold text-white">
                -{product.discount}%
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fffdf7] shadow-md transition hover:scale-105 ${isWishlisted ? 'text-[#b98791]' : 'text-[#493b32]'}`}
        >
          <Heart size={19} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
      </div>
      <Link to={`/product/${product.id}`} className="block">
        <div className="px-3 pb-3 pt-2.5">
          <div className="mb-1 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.1em] text-[#b98791]">
            <span className="truncate font-bold">{product.fabric || product.category}</span>
            <span className="shrink-0 text-[#71645b]">{product.category.replace(' Sarees', '')}</span>
          </div>
          <h2 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-[#2c1e19] sm:text-sm">
            {product.name}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <strong className="text-sm text-[#2c1e19] sm:text-base">{formatPrice(product.discountedPrice)}</strong>
            {product.discount > 0 && <span className="text-[10px] text-[#817970] line-through sm:text-xs">{formatPrice(product.price)}</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default WishlistProductCard
