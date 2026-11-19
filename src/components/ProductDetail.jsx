import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, Star } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'
import ProductCard from './ProductCard'
import { formatPrice } from '../utils/formatPrice'

const SERVICEABLE_PINCODES = ['110001', '400001', '560001', '700001', '600001']

const REVIEWS = [
  {
    quote: 'The drape and finish are stunning. It felt premium from the moment I unboxed it.',
    author: 'Ankita S.',
  },
  {
    quote: 'Beautiful zari work and an elegant silhouette. It is perfect for festive occasions.',
    author: 'Neha R.',
  },
]

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
]

const ui = {
  section: 'w-full bg-[#fffaf0] px-4 py-8 sm:px-7 sm:py-14',
  container: 'mx-auto w-full max-w-7xl',
  card: 'rounded-2xl border border-[#e2d9c5] bg-[#fffdf7]',
  eyebrow: 'text-[11px] font-bold uppercase tracking-[0.2em] text-[#81622f]',
  focus:
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]',
  btnPrimary:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2c1e19] px-5 text-sm font-semibold text-white transition hover:bg-[#49352c] disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2c1e19] px-5 text-sm font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7] disabled:cursor-not-allowed disabled:opacity-50',
  btnGhost:
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e2d9c5] px-4 text-sm font-semibold text-[#493b32] transition hover:border-[#b88a3e]',
  input:
    'w-full rounded-xl border border-[#ddd4bf] bg-white px-3.5 py-3 text-[15px] text-[#2c1e19] outline-none transition placeholder:text-[#a29a8e] focus:border-[#b88a3e] focus:ring-2 focus:ring-[#b88a3e]/20',
}

function Stars({ rating, size = 14 }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[...Array(5)].map((_, index) => {
        const filled = index < rounded
        return (
          <Star
            key={index}
            size={size}
            strokeWidth={1.5}
            fill={filled ? '#d6ae55' : '#e5e0d2'}
            className={filled ? 'text-[#d6ae55]' : 'text-[#e5e0d2]'}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

function Spec({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-[#817970]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#2c1e19]">{value}</dd>
    </div>
  )
}

function ProductDetail({ addToCart, toggleWishlist, wishlist, products, product }) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [selectedVariant, setSelectedVariant] = useState(product.colors[0] || 'Classic')
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('description')

  const isWishlisted = wishlist.includes(product.id)
  const inStock = product.stock > 0
  const stockLabel = `${product.stock} ${product.stock === 1 ? 'piece' : 'pieces'}`
  const recentProducts = products.filter((item) => item.id !== product.id).slice(0, 4)
  const sareeColour =
    product.sareeColour || (product.color && product.color !== 'Classic' ? product.color : '')
  const savings = Math.max(0, Number(product.price) - Number(product.discountedPrice))

  const highlights = [
    { label: 'Fabric', value: product.material || product.fabric },
    { label: 'Weave', value: product.weave },
    { label: 'Saree colour', value: sareeColour },
    { label: 'Saree length', value: product.length },
    { label: 'Blouse colour', value: product.blouseColour },
    { label: 'Craft', value: product.craft },
  ].filter((spec) => spec.value)

  const specifications = [
    { label: 'Fabric', value: product.material || product.fabric },
    { label: 'Weave', value: product.weave },
    { label: 'Zari', value: product.zari },
    { label: 'Saree colour', value: sareeColour },
    { label: 'Saree length', value: product.length },
    { label: 'Blouse colour', value: product.blouseColour },
    { label: 'Blouse details', value: product.blouse },
    { label: 'Craft', value: product.craft },
    { label: 'Care', value: product.care },
    {
      label: 'Availability',
      value: inStock ? `${stockLabel} available` : 'Out of stock',
    },
  ].filter((spec) => spec.value)

  const hasBlousePrices =
    Number(product.plainBlousePrice) > 0 || Number(product.paddedBlousePrice) > 0

  const handlePincodeCheck = () => {
    const code = pincode.trim()
    if (!/^\d{6}$/.test(code)) {
      setDeliveryStatus({ ok: false, text: 'Enter a valid 6-digit PIN code.' })
      return
    }
    setDeliveryStatus(
      SERVICEABLE_PINCODES.includes(code)
        ? { ok: true, text: 'Delivery available in 4-6 business days.' }
        : { ok: false, text: 'This PIN code is currently unavailable for delivery.' },
    )
  }

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#817970]"
        >
          <Link to="/" className={`hover:text-[#2c1e19] ${ui.focus}`}>Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className={`hover:text-[#2c1e19] ${ui.focus}`}>Shop</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-[#2c1e19]" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-[#eee7d7] aspect-[4/5]">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
                {product.images.map((image, index) => {
                  const isSelected = selectedImage === image
                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={isSelected}
                      className={`h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${ui.focus} ${
                        isSelected ? 'border-[#b88a3e]' : 'border-transparent hover:border-[#e2d9c5]'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            {product.category && <span className={ui.eyebrow}>{product.category}</span>}

            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2c1e19] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#71645b]">
              <Stars rating={product.rating} />
              <span>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="mt-6 border-y border-[#e2d9c5] py-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-[#2c1e19]">
                  {formatPrice(product.discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-base text-[#817970] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-[#eaf7f1] px-3 py-1 text-xs font-semibold text-[#247b5c]">
                    {product.discount}% off
                  </span>
                  {savings > 0 && (
                    <span className="text-[#71645b]">You save {formatPrice(savings)}</span>
                  )}
                </div>
              )}
            </div>

            {highlights.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#e2d9c5] sm:grid-cols-3">
                {highlights.map((item) => (
                  <Spec
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    className="bg-[#fffdf7] p-4"
                  />
                ))}
              </dl>
            )}

            {product.colors.length > 0 && (
              <div className="mt-7">
                <span className="text-sm font-semibold text-[#493b32]">
                  Color: <span className="font-normal text-[#71645b]">{selectedVariant}</span>
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedVariant === color
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedVariant(color)}
                        aria-pressed={isSelected}
                        className={`rounded-full border px-4 py-2 text-sm transition ${ui.focus} ${
                          isSelected
                            ? 'border-[#b88a3e] bg-[#b88a3e] font-semibold text-[#2c1e19]'
                            : 'border-[#ddd4bf] bg-[#fffdf7] text-[#493b32] hover:border-[#b88a3e]'
                        }`}
                      >
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Purchase */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-[#ddd4bf] bg-white px-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-[#493b32] hover:bg-[#eee7d7] disabled:opacity-40 ${ui.focus}`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-semibold" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  disabled={!inStock || quantity >= product.stock}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-[#493b32] hover:bg-[#eee7d7] disabled:opacity-40 ${ui.focus}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className={`${ui.btnPrimary} ${ui.focus} flex-1`}
              >
                Add to cart
              </button>
              <button
                type="button"
                disabled={!inStock}
                onClick={() => {
                  addToCart(product, quantity, selectedVariant)
                  navigate('/checkout')
                }}
                className={`${ui.btnSecondary} ${ui.focus} flex-1`}
              >
                Buy now
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={isWishlisted}
                className={`${ui.btnGhost} ${ui.focus}`}
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? '#b88a3e' : 'none'}
                  className={isWishlisted ? 'text-[#b88a3e]' : ''}
                  aria-hidden="true"
                />
                {isWishlisted ? 'Saved' : 'Save to wishlist'}
              </button>
              <span
                className={`text-sm font-medium ${inStock ? 'text-[#247b5c]' : 'text-[#a23b36]'}`}
              >
                {inStock ? `${stockLabel} available` : 'Out of stock'}
              </span>
            </div>

            {/* Delivery */}
            <div className={`${ui.card} mt-6 p-5`}>
              <label htmlFor="pincode" className="text-sm font-semibold text-[#2c1e19]">
                Check delivery availability
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  id="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(event) => {
                    setPincode(event.target.value)
                    setDeliveryStatus(null)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handlePincodeCheck()
                  }}
                  placeholder="Enter PIN code"
                  className={ui.input}
                />
                <button
                  type="button"
                  onClick={handlePincodeCheck}
                  className={`${ui.btnSecondary} ${ui.focus} shrink-0`}
                >
                  Check
                </button>
              </div>
              {deliveryStatus && (
                <p
                  role="status"
                  className={`mt-3 text-sm ${deliveryStatus.ok ? 'text-[#247b5c]' : 'text-[#a23b36]'}`}
                >
                  {deliveryStatus.text}
                </p>
              )}
            </div>

            {/* Blouse stitching */}
            {product.blouseStitchingAvailable && (
              <section className={`${ui.card} mt-4 p-5`} aria-labelledby="blouse-heading">
                <h2 id="blouse-heading" className="font-semibold text-[#2c1e19]">
                  Blouse stitching
                </h2>
                <p className="mt-1 text-sm text-[#71645b]">Available on request.</p>

                {hasBlousePrices && (
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {Number(product.plainBlousePrice) > 0 && (
                      <Spec
                        label="Plain, non-padded blouse"
                        value={formatPrice(product.plainBlousePrice)}
                      />
                    )}
                    {Number(product.paddedBlousePrice) > 0 && (
                      <Spec label="Padded blouse" value={formatPrice(product.paddedBlousePrice)} />
                    )}
                  </dl>
                )}

                {product.blouseStitchingNote && (
                  <p className="mt-4 text-sm leading-6 text-[#71645b]">
                    {product.blouseStitchingNote}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-[#e2d9c5] [scrollbar-width:none]">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${ui.focus} ${
                    isActive
                      ? 'border-[#b88a3e] text-[#2c1e19]'
                      : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="py-8"
          >
            {activeTab === 'description' && (
              <p className="max-w-3xl text-base leading-7 text-[#71645b]">{product.description}</p>
            )}

            {activeTab === 'specifications' &&
              (specifications.length > 0 ? (
                <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#e2d9c5] sm:grid-cols-2">
                  {specifications.map((spec) => (
                    <Spec
                      key={spec.label}
                      label={spec.label}
                      value={spec.value}
                      className="bg-[#fffdf7] p-5"
                    />
                  ))}
                </dl>
              ) : (
                <p className="text-[#71645b]">Specifications will be updated soon.</p>
              ))}

            {activeTab === 'reviews' && (
              <div>
                <div className={`${ui.card} mb-4 flex flex-wrap items-center gap-4 p-5`}>
                  <span className="text-4xl font-semibold text-[#2c1e19]">{product.rating}</span>
                  <div>
                    <Stars rating={product.rating} size={18} />
                    <p className="mt-1 text-sm text-[#71645b]">Based on {product.reviews} reviews</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {REVIEWS.map((review) => (
                    <figure key={review.author} className={`${ui.card} p-6`}>
                      <Stars rating={5} />
                      <blockquote className="mt-3 text-[15px] leading-7 text-[#493b32]">
                        “{review.quote}”
                      </blockquote>
                      <figcaption className="mt-4 text-sm font-semibold text-[#2c1e19]">
                        — {review.author}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recentProducts.length > 0 && (
          <div className="mt-16 border-t border-[#e2d9c5] pt-12">
            <span className={ui.eyebrow}>Curated for you</span>
            <h2 className="mt-2 mb-8 text-2xl font-semibold tracking-tight text-[#2c1e19] sm:text-3xl">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {recentProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDetail