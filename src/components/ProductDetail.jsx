import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'
import ProductCard from './ProductCard'
import { formatPrice } from '../utils/formatPrice'

const SERVICEABLE_PINCODES = ['110001', '400001', '560001', '700001', '600001']

const REVIEWS = [
  {
    quote: 'The drape and finish are stunning. It felt premium from the moment I unboxed it.',
    author: 'Ankita S.',
    city: 'Mumbai',
  },
  {
    quote: 'Beautiful zari work and an elegant silhouette. It is perfect for festive occasions.',
    author: 'Neha R.',
    city: 'Bengaluru',
  },
]

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
]

const ASSURANCE_ITEMS = [
  { label: 'Authentic handloom', Icon: ShieldCheck },
  { label: 'Free delivery ₹1,999+', Icon: Truck },
  { label: '7-day easy returns', Icon: RotateCcw },
]

const ui = {
  section: 'w-full bg-[#fffaf0] px-4 pb-24 pt-6 sm:px-7 sm:py-14',
  container: 'mx-auto w-full max-w-7xl',
  card: 'rounded-2xl border border-[#e6decb] bg-[#fffdf7] shadow-[0_8px_24px_rgba(44,30,25,0.03)]',
  eyebrow: 'text-[11px] font-bold uppercase tracking-[0.22em] text-[#85642e]',
  focus:
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]',
  btnPrimary:
    'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2c1e19] px-5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#3f2c25] disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary:
    'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#2c1e19] bg-transparent px-5 text-sm font-semibold tracking-wide text-[#2c1e19] transition hover:bg-[#f2ead9] disabled:cursor-not-allowed disabled:opacity-50',
  btnGhost:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e2d9c5] bg-[#fffdf7] px-4 text-sm font-semibold text-[#493b32] transition hover:border-[#b88a3e] hover:text-[#2c1e19]',
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
            fill={filled ? '#c49a55' : '#e5e0d2'}
            className={filled ? 'text-[#c49a55]' : 'text-[#e5e0d2]'}
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
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7f73]">
        {label}
      </dt>
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
    { label: 'Fall, pico', value: product.fallPico },
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
    { label: 'Fall, pico', value: product.fallPico },
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
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-[#817970] sm:mb-7 sm:text-sm"
        >
          <Link to="/" className={`hover:text-[#2c1e19] ${ui.focus}`}>
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className={`hover:text-[#2c1e19] ${ui.focus}`}>
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate font-semibold text-[#2c1e19]" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:gap-14">
          {/* Left Column: Gallery */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#e6decb] bg-[#f3ede0] shadow-[0_20px_50px_rgba(44,30,25,0.08)]">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500"
              />

              {/* Subtle top badges */}
              <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                {product.badge && (
                  <span className="rounded-full bg-[#2c1e19]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f7efe4] backdrop-blur-xs">
                    {product.badge}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="rounded-full bg-[#fffdf7]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#85642e] shadow-xs">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Quick Wishlist button on image */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={isWishlisted}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#e6decb] bg-[#fffdf7]/90 text-[#2c1e19] shadow-sm backdrop-blur-xs transition hover:scale-105 ${ui.focus}`}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#b88a3e' : 'none'}
                  className={isWishlisted ? 'text-[#b88a3e]' : ''}
                />
              </button>
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
                      className={`h-22 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-20 ${ui.focus} ${
                        isSelected
                          ? 'border-[#b88a3e] shadow-sm'
                          : 'border-transparent opacity-75 hover:border-[#e2d9c5] hover:opacity-100'
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

          {/* Right Column: Product Info & Actions */}
          <div className="min-w-0">
            {product.category && (
              <div className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[#b88a3e]" />
                <span className={ui.eyebrow}>{product.category}</span>
              </div>
            )}

            <h1 className="mt-2.5 font-serif text-3xl font-semibold leading-[1.15] tracking-tight text-[#2c1e19] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#71645b]">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e6decb] bg-[#fffdf7] px-3 py-1">
                <Stars rating={product.rating} />
                <span className="font-semibold text-[#2c1e19]">{product.rating}</span>
              </div>
              <span>{product.reviews} verified reviews</span>
            </div>

            {/* Pricing Card */}
            <div className="mt-6 rounded-2xl border border-[#e6decb] bg-[#faf6ea] p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight text-[#2c1e19] sm:text-4xl">
                    {formatPrice(product.discountedPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-base text-[#8a7f73] line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    inStock
                      ? 'bg-[#eaf7f1] text-[#247b5c]'
                      : 'bg-[#fdeeed] text-[#a23b36]'
                  }`}
                >
                  <CheckCircle2 size={13} aria-hidden="true" />
                  {inStock ? `${stockLabel} available` : 'Out of stock'}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                {product.discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#eaf7f1] px-2.5 py-0.5 text-xs font-semibold text-[#247b5c]">
                    {product.discount}% off
                  </span>
                )}
                {savings > 0 && (
                  <span className="font-medium text-[#5c5147]">
                    You save {formatPrice(savings)}
                  </span>
                )}
                <span className="text-[#8a7f73]">· Inclusive of all taxes</span>
              </div>
            </div>

            {/* Color Variants */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#493b32]">
                  Color: <span className="font-semibold text-[#85642e]">{selectedVariant}</span>
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
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
                            ? 'border-[#b88a3e] bg-[#b88a3e] font-semibold text-[#2c1e19] shadow-xs'
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

            {/* Quantity & Wishlist Row */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-[#ddd4bf] bg-white px-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-[#493b32] hover:bg-[#eee7d7] disabled:opacity-40 ${ui.focus}`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
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
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!inStock}
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className={`${ui.btnPrimary} ${ui.focus} w-full`}
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
                className={`${ui.btnSecondary} ${ui.focus} w-full`}
              >
                Buy now
              </button>
            </div>

            {/* Trust Assurance Strip */}
            <ul className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-[#e6decb] bg-[#faf6ea] p-3 text-center">
              {ASSURANCE_ITEMS.map(({ label, Icon }) => (
                <li key={label} className="flex flex-col items-center gap-1.5 px-1">
                  <Icon size={18} className="text-[#85642e]" aria-hidden="true" />
                  <span className="text-[11px] font-medium leading-tight text-[#493b32]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Delivery Check */}
            <div className={`${ui.card} mt-5 p-5`}>
              <label
                htmlFor="pincode"
                className="flex items-center gap-2 text-sm font-semibold text-[#2c1e19]"
              >
                <MapPin size={16} className="text-[#85642e]" aria-hidden="true" />
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
                  placeholder="Enter 6-digit PIN code"
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
                  className={`mt-3 text-sm font-medium ${deliveryStatus.ok ? 'text-[#247b5c]' : 'text-[#a23b36]'}`}
                >
                  {deliveryStatus.text}
                </p>
              )}
            </div>

            {/* Key Specifications Grid (no empty orphan cells) */}
            {highlights.length > 0 && (
              <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {highlights.map((item) => (
                  <Spec
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    className="rounded-xl border border-[#e6decb] bg-[#fffdf7] px-3.5 py-3 shadow-[0_2px_8px_rgba(44,30,25,0.02)]"
                  />
                ))}
              </dl>
            )}

            {/* Blouse stitching */}
            {product.blouseStitchingAvailable && (
              <section className={`${ui.card} mt-4 p-5`} aria-labelledby="blouse-heading">
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-[#85642e]" aria-hidden="true" />
                  <h2 id="blouse-heading" className="font-semibold text-[#2c1e19]">
                    Blouse stitching
                  </h2>
                </div>
                <p className="mt-1 text-sm text-[#71645b]">Available on request.</p>

                {hasBlousePrices && (
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    {Number(product.plainBlousePrice) > 0 && (
                      <Spec
                        label="Plain, non-padded blouse"
                        value={formatPrice(product.plainBlousePrice)}
                        className="rounded-xl bg-[#faf6ea] p-3"
                      />
                    )}
                    {Number(product.paddedBlousePrice) > 0 && (
                      <Spec
                        label="Padded blouse"
                        value={formatPrice(product.paddedBlousePrice)}
                        className="rounded-xl bg-[#faf6ea] p-3"
                      />
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

            {/* Fall & pico customization */}
            {(product.fallPicoAvailable || product.fallPico) && (
              <section className={`${ui.card} mt-4 p-5`} aria-labelledby="fall-pico-heading">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#85642e]" aria-hidden="true" />
                  <h2 id="fall-pico-heading" className="font-semibold text-[#2c1e19]">
                    Fall & Pico
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-[#71645b]">
                  {product.fallPico ||
                    (Number(product.fallPicoPrice) > 0
                      ? `Available at ${formatPrice(product.fallPicoPrice)}`
                      : 'Complimentary / Included on request')}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div
            role="tablist"
            aria-label="Product information"
            className="flex gap-2 overflow-x-auto border-b border-[#e2d9c5] [scrollbar-width:none]"
          >
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
              <div className="rounded-2xl border border-[#e6decb] bg-[#fffdf7] p-6">
                <p className="max-w-3xl text-base leading-7 text-[#5c5147]">
                  {product.description || 'Handwoven by skilled Indian artisans with timeless attention to detail.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' &&
              (specifications.length > 0 ? (
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {specifications.map((spec) => (
                    <Spec
                      key={spec.label}
                      label={spec.label}
                      value={spec.value}
                      className="rounded-xl border border-[#e6decb] bg-[#fffdf7] p-4"
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
                    <p className="mt-1 text-sm text-[#71645b]">
                      Based on {product.reviews} reviews
                    </p>
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
                        — {review.author}{' '}
                        <span className="font-normal text-[#8a7f73]">· {review.city}</span>
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
          <div className="mt-14 border-t border-[#e2d9c5] pt-12">
            <span className={ui.eyebrow}>Curated for you</span>
            <h2 className="mt-2 mb-8 font-serif text-2xl font-semibold tracking-tight text-[#2c1e19] sm:text-3xl">
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
