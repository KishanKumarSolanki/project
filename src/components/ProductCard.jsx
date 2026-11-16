import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import ImageWithFallback from './ImageWithFallback'

function ProductCard({ product, addToCart, toggleWishlist, isWishlisted }) {
  return (
    <motion.article
      className="w-[82vw] max-w-[390px] shrink-0 snap-start overflow-hidden rounded-[26px] border border-[#ddd4bf] bg-[#fffdf7] shadow-[0_8px_24px_rgba(44,30,25,0.05)] sm:w-[340px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative aspect-[0.84] overflow-hidden bg-[#ede7db]">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <ImageWithFallback src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-[#2c1e19] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">{product.badge || 'Handwoven'}</span>
        {product.discount > 0 && <span className="absolute right-3 top-3 rounded-full bg-[#009e78] px-3 py-1.5 text-xs font-bold text-white">-{product.discount}%</span>}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#fffdf7] text-[#493b32] shadow-md transition hover:text-[#b98791]"
        >
          <Heart size={22} strokeWidth={1.8} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[11px] sm:text-xs">
          <span className="truncate font-bold uppercase tracking-[0.12em] text-[#b98791]">{product.fabric || product.category}</span>
          <span className="shrink-0 text-[#71645b]">{product.category.replace(' Sarees', '')}</span>
        </div>
        <Link to={`/product/${product.id}`} className="mt-2 block">
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#2c1e19] sm:text-lg">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[#c7bda8]" aria-label={`${product.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'} />)}
            <span className="ml-1 text-sm text-[#71645b]">({product.reviews})</span>
          </div>
          {product.stock < 3 && <span className="text-xs font-semibold text-[#b4232b]">Only {product.stock} left!</span>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <strong className="text-xl text-[#2c1e19]">{formatPrice(product.discountedPrice)}</strong>
          {product.discount > 0 && (
            <>
              <span className="text-sm text-[#817970] line-through">{formatPrice(product.price)}</span>
              <span className="rounded-full bg-[#eaf7f1] px-2.5 py-1 text-xs font-semibold text-[#247b5c]">Save {formatPrice(product.price - product.discountedPrice)}</span>
            </>
          )}
        </div>
        <button type="button" onClick={() => addToCart(product, 1)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2c1e19] px-4 text-sm font-semibold text-[#fffdf7] transition hover:bg-[#49352c]">
          <ShoppingBag size={18} /> Add to bag
        </button>
      </div>
    </motion.article>
  )
}

export default ProductCard
