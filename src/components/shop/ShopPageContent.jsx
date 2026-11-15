import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import WishlistProductCard from '../WishlistProductCard'
import { shopTabs } from '../../data/shopCollections'

function ShopPageContent({
  filteredProducts,
  addToCart,
  toggleWishlist,
  wishlist,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  const selectedTab = shopTabs.find((tab) => tab.category === selectedCategory)
  const activeTab = selectedTab?.name || shopTabs.find((tab) => tab.productCategory === selectedCategory)?.name || 'All'
  const headingCategory = activeTab !== 'All' ? activeTab : selectedCategory.replace(/ Sarees$/, '')

  return (
    <>
      <section className="relative overflow-hidden bg-[#fffaf0]">
        <svg className="pointer-events-none absolute -right-24 top-0 h-full w-[72%] opacity-[0.12] sm:w-1/2" viewBox="0 0 520 420" fill="none" aria-hidden="true">
          <defs>
            <pattern id="shop-diamonds" width="78" height="78" patternUnits="userSpaceOnUse">
              <path d="M39 1 77 39 39 77 1 39Z" stroke="#b88a3e" strokeWidth="1.2" />
              <path d="M39 21 57 39 39 57 21 39Z" stroke="#b88a3e" strokeWidth="1" />
              <circle cx="39" cy="39" r="3" fill="#b88a3e" />
            </pattern>
          </defs>
          <rect width="520" height="420" fill="url(#shop-diamonds)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-7 sm:pb-8 sm:pt-9">
          <div className="mb-8 flex items-center gap-2 text-sm text-[#71645b] sm:mb-10 sm:text-base">
            <Link to="/" className="hover:text-[#2c1e19]">Home</Link>
            <ChevronRight size={17} />
            <span className="font-semibold text-[#2c1e19]">Collections</span>
          </div>

          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f] sm:text-sm"><span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />Doritaaga</span>
            <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#2c1e19] sm:text-6xl">
              {selectedCategory === 'All' ? <>All <span className="text-[#b98791]">Collections</span></> : headingCategory}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#71645b] sm:mt-6 sm:text-2xl sm:leading-10">
              Handpicked weaves, curated by fabric and craft. Find the one that feels like you.
            </p>
          </div>
        </div>

        <div className="relative mt-4 border-b border-[#e5dcc8]">
          <div className="mx-auto flex max-w-7xl snap-x gap-2.5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:gap-3 sm:px-7">
            {shopTabs.map((tab) => {
              const isActive = activeTab === tab.name
              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => setSelectedCategory(tab.category)}
                  className={`shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm transition-colors sm:px-6 sm:py-3 sm:text-base ${isActive ? 'border-[#b88a3e] bg-[#b88a3e] font-semibold text-[#2c1e19] shadow-sm' : 'border-[#ded5c3] bg-[#fffdf7] text-[#493b32] hover:border-[#b88a3e] hover:text-[#85642e]'}`}
                >
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section id="shop-products" className="scroll-mt-28 border-t border-[#e2d9c5] bg-[#f4efdf] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]">Explore the weave</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2c1e19] sm:text-4xl">
                {selectedCategory === 'All' ? 'All sarees' : shopTabs.find((tab) => tab.category === selectedCategory)?.name || selectedCategory}
              </h2>
              <p className="mt-2 text-sm text-[#71645b]">{filteredProducts.length} pieces in this collection</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#71645b]" htmlFor="shop-sort">Sort by
              <select id="shop-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl border border-[#ddd4bf] bg-[#fffdf7] px-3 py-2.5 text-[#2c1e19] outline-none focus:border-[#b88a3e]">
                <option value="featured">Featured</option>
                <option value="popular">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
          {filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <WishlistProductCard key={product.id} product={product} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] px-5 py-14 text-center text-[#71645b]">
              No sarees match this search yet. Try another collection.
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default ShopPageContent
