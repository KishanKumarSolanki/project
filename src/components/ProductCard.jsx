import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

function ProductCard({ product, addToCart, toggleWishlist, isWishlisted, onQuickView }) {
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.images[0]} alt={product.name} />
        </Link>
        {product.badge && <span className="badge">{product.badge}</span>}
        <button
          type="button"
          className="wishlist-btn"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-card__body">
        <div className="card-row">
          <span className="product-category">{product.category}</span>
          <div className="rating-tiny">
            <Star size={12} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <h3>{product.name}</h3>
        <div className="price-row compact">
          <span className="current-price">{formatPrice(product.discountedPrice)}</span>
          <span className="old-price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-actions">
          <button type="button" className="primary-btn" onClick={() => addToCart(product, 1)}>
            Add to Cart
          </button>
          <button type="button" className="secondary-btn" onClick={() => onQuickView?.(product)}>
            Quick View
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
