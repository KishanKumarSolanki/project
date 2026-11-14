import ProductCard from '../ProductCard'

function BestSellersSection({ bestSellers, addToCart, toggleWishlist, wishlist, setQuickView }) {
  return (
    <section className="section-wrap">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">Loved by you</span>
            <h2 className="section-title">Our best sellers</h2>
          </div>
        </div>
        <div className="best-sellers-row">
          {bestSellers.map((product) => (
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

export default BestSellersSection
