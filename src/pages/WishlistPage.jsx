import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import WishlistProductCard from '../components/WishlistProductCard'
import { ui } from '../constants/store'

function WishlistPage({ products, toggleWishlist }) {
  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className="mb-8">
          <span className={ui.eyebrow}>Your saved pieces</span>
          <h1 className={`mt-2 ${ui.h1}`}>Wishlist</h1>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <WishlistProductCard
                key={product.id}
                product={product}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div
            className={`${ui.card} flex flex-col items-center gap-3 px-6 py-14 text-center sm:py-20`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e9ec] text-[#b98791]">
              <Heart size={28} strokeWidth={1.6} />
            </span>
            <h2 className={ui.h2}>Your wishlist is waiting</h2>
            <p className={`max-w-sm ${ui.body}`}>
              Save the sarees you love and find them here later.
            </p>
            <Link to="/shop" className={`${ui.btnPrimary} mt-4`}>
              Explore sarees
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default WishlistPage
