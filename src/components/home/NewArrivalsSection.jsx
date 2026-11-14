import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard'

function NewArrivalsSection({ featuredProducts, addToCart, toggleWishlist, wishlist, setQuickView }) {
  return (
    <section className="section-wrap" id="new-arrivals">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">Just arrived</span>
            <h2 className="section-title">New arrivals</h2>
          </div>
          <Link to="/shop" className="outline-btn">View all</Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
              onQuickView={setQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewArrivalsSection
