import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useSearchParams,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
} from 'lucide-react'
import { products } from './data/products'
import { shopTabs } from './data/shopCollections'
import Footer from './components/Footer'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import WishlistProductCard from './components/WishlistProductCard'
import ImageWithFallback from './components/ImageWithFallback'
import MobileBottomNav from './components/MobileBottomNav'
import SupportBubble from './components/SupportBubble'
import ShopPageContent from './components/shop/ShopPageContent'
import BenefitsSection from './components/home/BenefitsSection'
import BestSellersSection from './components/home/BestSellersSection'
import CategorySection from './components/home/CategorySection'
import HeroSection from './components/home/HeroSection'
import NewArrivalsSection from './components/home/NewArrivalsSection'
import PromoBannerSection from './components/home/PromoBannerSection'
import StorySection from './components/home/StorySection'
import TestimonialsSection from './components/home/TestimonialsSection'
import { formatPrice } from './utils/formatPrice'

const PRODUCT_STORAGE_KEY = 'ananyaCatalog'
const LINEN_SAREE_MIGRATION_KEY = 'ananyaCatalogLinenSareeSeeded'
const MUNGA_MASHRU_MIGRATION_KEY = 'ananyaCatalogMungaMashruSeeded'
const LINEN_COTTON_MIGRATION_KEY = 'ananyaCatalogLinenCottonSeeded'
const NAVY_LINEN_MIGRATION_KEY = 'ananyaCatalogNavyLinenSeeded'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const utilityClasses = {
  'section-wrap': 'w-full px-4 py-10 sm:px-7 sm:py-16',
  container: 'mx-auto w-full max-w-7xl px-4 sm:px-7',
  'shop-layout': 'grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]',
  'shop-sidebar': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5',
  'shop-sidebar__header': 'mb-5 flex items-center justify-between',
  'filter-group': 'mb-5 space-y-2',
  'filter-label': 'block text-sm font-semibold text-[#493b32]',
  'search-input': 'flex min-h-11 items-center gap-2 rounded-xl border border-[#ddd4bf] bg-[#fffdf7] px-3 text-[#71645b]',
  'chip-list': 'flex flex-wrap gap-2',
  chip: 'rounded-full border border-[#ddd4bf] px-3 py-1.5 text-xs text-[#71645b] transition hover:border-[#b88a3e]',
  selected: 'border-[#b88a3e] bg-[#b88a3e] text-[#2c1e19]',
  active: 'border-[#b88a3e] bg-[#b88a3e] text-[#2c1e19]',
  slider: 'w-full accent-[#b88a3e]',
  'price-range': 'flex justify-between text-xs text-[#817970]',
  'shop-content': 'min-w-0',
  'shop-toolbar': 'mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e2d9c5] pb-4',
  'shop-toolbar__topline': 'flex items-center gap-4 text-sm text-[#71645b]',
  'filter-toggle': 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#ddd4bf] px-4 font-semibold text-[#2c1e19] lg:hidden',
  'sort-select-wrap': 'flex items-center gap-2 text-sm text-[#71645b]',
  'product-grid': 'flex flex-wrap justify-center gap-4 sm:justify-start',
  'empty-state': 'w-full rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] px-5 py-14 text-center',
  'large-empty': 'flex min-h-[60vh] flex-col items-center justify-center gap-3',
  'product-page': 'mx-auto max-w-7xl',
  breadcrumbs: 'mb-6 flex flex-wrap gap-2 text-sm text-[#817970]',
  'product-detail-layout': 'grid gap-8 lg:grid-cols-2 lg:gap-12',
  'product-gallery': 'min-w-0',
  'product-gallery__main': 'overflow-hidden rounded-[28px] bg-[#eee7d7]',
  zoomable: 'aspect-[0.8] h-full w-full object-cover',
  'product-gallery__thumbs': 'mt-3 flex gap-3 overflow-x-auto',
  thumb: 'h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-transparent object-cover',
  'product-info': 'min-w-0 py-2',
  'section-label': 'mb-2 inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]',
  'section-title': 'text-3xl font-semibold leading-tight tracking-tight text-[#2c1e19] sm:text-4xl',
  serif: 'font-serif',
  'product-title': 'text-3xl font-semibold leading-tight tracking-tight text-[#2c1e19] sm:text-4xl',
  'rating-row': 'mt-3 flex items-center gap-2 text-sm text-[#71645b]',
  stars: 'flex items-center gap-1 text-[#b88a3e]',
  'price-row': 'mt-5 flex flex-wrap items-center gap-3',
  'current-price': 'text-2xl font-bold text-[#2c1e19]',
  'old-price': 'text-base text-[#817970] line-through',
  'discount-tag': 'rounded-full bg-[#eaf7f1] px-3 py-1 text-xs font-semibold text-[#247b5c]',
  'product-description': 'mt-5 text-base leading-7 text-[#71645b]',
  'detail-box': 'mt-6 rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5 text-sm leading-6 text-[#71645b]',
  'variant-block': 'mt-6',
  'variant-list': 'mt-3 flex flex-wrap gap-2',
  'variant-pill': 'rounded-full border border-[#ddd4bf] px-4 py-2 text-sm text-[#71645b]',
  'purchase-row': 'mt-6 flex flex-wrap items-center gap-3',
  'quantity-picker': 'inline-flex min-h-12 items-center gap-4 rounded-xl border border-[#ddd4bf] bg-[#fffdf7] px-3',
  small: 'min-h-9 gap-3 px-2',
  'primary-btn': 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2c1e19] px-5 font-semibold text-white transition hover:bg-[#49352c]',
  'secondary-btn': 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2c1e19] px-5 font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7]',
  'full-width': 'w-full',
  'justify-center': 'justify-center',
  'action-row': 'mt-4 flex flex-wrap items-center justify-between gap-3',
  'mini-action': 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#ddd4bf] px-4 text-sm font-semibold',
  'stock-status': 'text-sm font-medium text-[#247b5c]',
  'pincode-checker': 'mt-6 rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5',
  'pincode-input-row': 'mt-2 flex gap-2',
  'product-tabs': 'mt-10 flex border-b border-[#ddd4bf]',
  'product-tabs__content': 'py-6',
  'spec-grid': 'grid gap-3 sm:grid-cols-2',
  'review-panel': 'grid gap-4 md:grid-cols-2',
  'review-card': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5',
  'review-stars': 'mb-3 flex gap-1 text-[#b88a3e]',
  'related-section': 'mt-12',
  'section-header': 'mb-6 flex items-end justify-between gap-4',
  'cart-layout': 'grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]',
  'cart-items-panel': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5 sm:p-7',
  'compact-header': 'mb-5',
  'cart-item': 'flex gap-4 border-t border-[#e2d9c5] py-4',
  'cart-item__details': 'flex min-w-0 flex-1 flex-col justify-between gap-3',
  'cart-item__meta': 'flex flex-wrap items-center justify-between gap-3 text-sm text-[#71645b]',
  'remove-btn': 'inline-flex h-9 w-9 items-center justify-center rounded-full text-[#817970] hover:bg-[#f3e7e5] hover:text-[#a23b36]',
  'summary-panel': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5 sm:p-7',
  'summary-line': 'flex items-center justify-between gap-3 border-b border-[#eee7d7] py-3 text-sm text-[#71645b]',
  'coupon-box': 'my-4 flex gap-2',
  'summary-total': 'my-4 flex items-center justify-between text-lg font-bold',
  'checkout-layout': 'grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]',
  'checkout-form': 'space-y-5',
  'checkout-step': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5 sm:p-7',
  'field-grid': 'grid gap-4 sm:grid-cols-2',
  'two-columns': 'sm:grid-cols-2',
  field: 'flex min-w-0 flex-col gap-2',
  'form-control': 'w-full rounded-xl border border-[#ddd4bf] bg-[#fffdf7] px-3 py-2.5 text-sm text-[#2c1e19] outline-none transition placeholder:text-[#a29a8e] focus:border-[#b88a3e] focus:ring-2 focus:ring-[#b88a3e]/15',
  'full-span': 'sm:col-span-2',
  'radio-list': 'mt-3 grid gap-3 sm:grid-cols-2',
  'radio-option': 'flex items-center gap-3 rounded-xl border border-[#ddd4bf] p-4 text-sm',
  'checkout-summary': 'h-fit lg:sticky lg:top-28',
  'summary-items': 'space-y-3 border-b border-[#e2d9c5] pb-4',
  'summary-item': 'flex items-center justify-between gap-3 text-sm',
  'account-layout': 'grid gap-6 lg:grid-cols-2',
  'account-card': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5 sm:p-8',
  'tab-switcher': 'mb-6 flex border-b border-[#e2d9c5]',
  'account-form': 'space-y-4',
  'account-info': 'bg-[#efe7d5]',
  'admin-layout': 'space-y-6',
  'admin-header': 'flex flex-wrap items-center justify-between gap-4',
  'admin-metrics': 'grid grid-cols-2 gap-3 lg:grid-cols-4',
  'metric-card': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-4',
  'admin-panels': 'grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]',
  'admin-card': 'rounded-2xl border border-[#ddd4bf] bg-[#fffdf7] p-5',
  'admin-product-list': 'mt-4 space-y-3',
  'admin-product-item': 'rounded-xl border border-[#e2d9c5] p-4',
  'admin-product-top': 'flex items-start justify-between gap-3',
  'admin-product-meta': 'mt-2 flex flex-wrap gap-3 text-xs text-[#817970]',
  'admin-product-actions': 'mt-3 flex items-center gap-2',
  'icon-button': 'inline-flex h-10 w-10 items-center justify-center rounded-full text-[#493b32] hover:bg-[#eee7d7]',
}

function tw(classNames) {
  return classNames.split(/\s+/).map((name) => utilityClasses[name] || name).join(' ')
}

const getStoredProducts = () => {
  if (typeof window === 'undefined') return products

  const saved = window.localStorage.getItem(PRODUCT_STORAGE_KEY)
  if (!saved) return products

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : products
  } catch {
    return products
  }
}

function App() {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return []
    const saved = window.localStorage.getItem('sareeCart')
    return saved ? JSON.parse(saved) : []
  })

  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === 'undefined') return []
    const saved = window.localStorage.getItem('sareeWishlist')
    return saved ? JSON.parse(saved) : []
  })

  const [catalog, setCatalog] = useState(getStoredProducts)

  useEffect(() => {
    window.localStorage.setItem('sareeCart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    window.localStorage.setItem('sareeWishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    if (window.localStorage.getItem(LINEN_SAREE_MIGRATION_KEY) === 'true') return

    const linenSaree = products.find((product) => product.id === 'floral-printed-pure-linen-saree')
    if (linenSaree) {
      setCatalog((current) => current.some((product) => product.id === linenSaree.id)
        ? current
        : [linenSaree, ...current])
    }
    window.localStorage.setItem(LINEN_SAREE_MIGRATION_KEY, 'true')
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem(MUNGA_MASHRU_MIGRATION_KEY) === 'true') return

    const mungaMashruSaree = products.find((product) => product.id === 'munga-mashru-pure-silk-saree')
    if (mungaMashruSaree) {
      setCatalog((current) => current.some((product) => product.id === mungaMashruSaree.id)
        ? current
        : [mungaMashruSaree, ...current])
    }
    window.localStorage.setItem(MUNGA_MASHRU_MIGRATION_KEY, 'true')
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem(LINEN_COTTON_MIGRATION_KEY) === 'true') return

    const linenCottonSaree = products.find((product) => product.id === 'linen-cotton-block-printed-saree')
    if (linenCottonSaree) {
      setCatalog((current) => current.some((product) => product.id === linenCottonSaree.id)
        ? current
        : [linenCottonSaree, ...current])
    }
    window.localStorage.setItem(LINEN_COTTON_MIGRATION_KEY, 'true')
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem(NAVY_LINEN_MIGRATION_KEY) === 'true') return

    const navyLinenSaree = products.find((product) => product.id === 'navy-blue-pure-linen-saree')
    if (navyLinenSaree) {
      setCatalog((current) => current.some((product) => product.id === navyLinenSaree.id)
        ? current
        : [navyLinenSaree, ...current])
    }
    window.localStorage.setItem(NAVY_LINEN_MIGRATION_KEY, 'true')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(catalog))
  }, [catalog])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddProduct = (product) => {
    setCatalog((current) => [product, ...current])
  }

  const handleUpdateProduct = (productId, updatedProduct) => {
    setCatalog((current) =>
      current.map((item) => (item.id === productId ? { ...item, ...updatedProduct } : item)),
    )
  }

  const handleDeleteProduct = (productId) => {
    setCatalog((current) => current.filter((item) => item.id !== productId))
  }

  const addToCart = (product, quantity = 1, variant = product.colors?.[0] ?? 'Classic') => {
    if (!product || product.stock < 1) return

    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.variant === variant,
      )

      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          variant,
          image: product.images[0],
          price: product.discountedPrice,
          quantity: Math.min(quantity, product.stock),
        },
      ]
    })
  }

  const updateQuantity = (productId, variant, delta) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId || item.variant !== variant) return [item]
        const nextQuantity = item.quantity + delta
        return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }]
      }),
    )
  }

  const removeFromCart = (productId, variant) => {
    setCart((current) =>
      current.filter((item) => !(item.id === productId && item.variant === variant)),
    )
  }

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1499 ? 0 : cart.length ? 199 : 0
  const discount = subtotal * 0.12
  const total = Math.max(subtotal - discount + shipping, 0)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={tw('min-h-screen bg-[#f8f5e9] pb-20 text-[#2c1e19] md:pb-0')}>
        <Header cartCount={cartCount} wishlist={wishlist} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  products={catalog}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopPage
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  products={catalog}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductPage
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  products={catalog}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={discount}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  products={catalog.filter((product) => wishlist.includes(product.id))}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route
              path="/checkout"
              element={<CheckoutPage cart={cart} total={total} shipping={shipping} />}
            />
            <Route path="/account" element={<AccountPage />} />
            <Route
              path="/admin"
              element={
                <AdminPage
                  products={catalog}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <SupportBubble />
        <MobileBottomNav cartCount={cartCount} wishlistCount={wishlist.length} />
      </div>
    </BrowserRouter>
  )
}

function HomePage({ addToCart, toggleWishlist, wishlist, products }) {
  const featuredProducts = products.slice(0, 4)
  const bestSellers = products.slice(2, 6)

  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellersSection
        bestSellers={bestSellers}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
      />
      <NewArrivalsSection
        featuredProducts={featuredProducts}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
      />
      <BenefitsSection />
      <StorySection />
      <PromoBannerSection />
      <TestimonialsSection />
    </>
  )
}

function WishlistPage({ products, toggleWishlist }) {
  return (
    <section className={tw('mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-7 sm:py-16')}>
      <div className={tw('mb-8')}>
        <span className={tw('text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]')}>Your saved pieces</span>
        <h1 className={tw('mt-2 text-4xl font-semibold tracking-tight text-[#2c1e19] sm:text-5xl')}>Wishlist</h1>
      </div>
      {products.length ? (
        <div className={tw('grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4')}>
          {products.map((product) => (
            <WishlistProductCard key={product.id} product={product} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      ) : (
        <div className={tw('rounded-[28px] border border-[#ddd4bf] bg-[#fffdf7] px-6 py-14 text-center sm:py-20')}>
          <Heart className={tw('mx-auto text-[#b98791]')} size={40} strokeWidth={1.6} />
          <h2 className={tw('mt-4 text-2xl font-semibold text-[#2c1e19]')}>Your wishlist is waiting</h2>
          <p className={tw('mt-2 text-[#71645b]')}>Save the sarees you love and find them here later.</p>
          <Link to="/shop" className={tw('mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#2c1e19] px-6 font-semibold text-white')}>Explore sarees</Link>
        </div>
      )}
    </section>
  )
}

function ShopPage({ addToCart, toggleWishlist, wishlist, products }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || 'All'
  const maxPrice = Number(searchParams.get('maxPrice')) || 7000
  const [sortBy, setSortBy] = useState(() => {
    const sort = searchParams.get('sort')
    return sort === 'new' ? 'newest' : sort === 'popular' ? 'popular' : 'featured'
  })

  const setSelectedCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams)
    if (category === 'All') nextParams.delete('category')
    else nextParams.set('category', category)
    setSearchParams(nextParams, { replace: true })
  }

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    const tab = shopTabs.find((item) => item.category === selectedCategory)
    const productCategory = tab?.productCategory || selectedCategory

    return [...products]
      .filter((product) => {
        const matchesSearch = !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.fabric.toLowerCase().includes(query)
        const matchesCategory = productCategory === 'All' || productCategory === 'Sale' || product.category === productCategory
        const matchesSale = productCategory !== 'Sale' || product.discount > 0
        const matchesPrice = product.discountedPrice <= maxPrice
        return matchesSearch && matchesCategory && matchesSale && matchesPrice
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice
        if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice
        if (sortBy === 'newest') return b.discount - a.discount
        return b.rating - a.rating
      })
  }, [products, search, selectedCategory, maxPrice, sortBy])

  return (
    <ShopPageContent
      filteredProducts={filteredProducts}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sortBy={sortBy}
      setSortBy={setSortBy}
    />
  )
}
function ProductPage({ addToCart, toggleWishlist, wishlist, products }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)

  if (!product) return <NotFound />

  return <ProductDetail key={product.id} product={product} toggleWishlist={toggleWishlist} wishlist={wishlist} addToCart={addToCart} products={products} />
}

function ProductDetail({ addToCart, toggleWishlist, wishlist, products, product }) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [selectedVariant, setSelectedVariant] = useState(product.colors[0] || 'Classic')
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const recentProducts = products.filter((item) => item.id !== product.id).slice(0, 4)

  const handlePincodeCheck = () => {
    if (pincode.trim().length !== 6) {
      setDeliveryStatus('Enter a valid 6-digit PIN code.')
      return
    }
    const available = ['110001', '400001', '560001', '700001', '600001']
    setDeliveryStatus(
      available.includes(pincode.trim())
        ? 'Delivery available in 4-6 business days.'
        : 'This PIN code is currently unavailable for delivery.',
    )
  }

  return (
    <section className={tw('section-wrap product-page')}>
      <div className={tw('container')}>
        <div className={tw('breadcrumbs')}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className={tw('product-detail-layout')}>
          <div className={tw('product-gallery')}>
            <div className={tw('product-gallery__main')}>
              <ImageWithFallback src={selectedImage} alt={product.name} className={tw('zoomable')} />
            </div>
            <div className={tw('product-gallery__thumbs')}>
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={tw(`thumb ${selectedImage === image ? 'selected' : ''}`)}
                  onClick={() => setSelectedImage(image)}
                >
                  <ImageWithFallback src={image} alt={product.name} className="h-full w-full rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className={tw('product-info')}>
            <span className={tw('section-label')}>{product.category}</span>
            <h1 className={tw('serif product-title')}>{product.name}</h1>
            <div className={tw('rating-row')}>
              <div className={tw('stars')}>
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill={index < Math.round(product.rating) ? '#d6ae55' : '#dfe2e8'} strokeWidth={1.5} />
                ))}
              </div>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className={tw('price-row')}>
              <span className={tw('current-price')}>{formatPrice(product.discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className={tw('old-price')}>{formatPrice(product.price)}</span>
                  <span className={tw('discount-tag')}>{product.discount}% Off</span>
                </>
              )}
            </div>

            <p className={tw('product-description')}>{product.description}</p>

            <div className={tw('detail-box')}>
              <div>
                <span>Fabric</span>
                <strong>{product.material}</strong>
              </div>
              <div>
                <span>Saree Length</span>
                <strong>{product.length}</strong>
              </div>
              <div>
                <span>Blouse</span>
                <strong>{product.blouse}</strong>
              </div>
            </div>

            <div className={tw('variant-block')}>
              <span>Available Colors</span>
              <div className={tw('variant-list')}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={tw(`variant-pill ${selectedVariant === color ? 'selected' : ''}`)}
                    onClick={() => setSelectedVariant(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className={tw('purchase-row')}>
              <div className={tw('quantity-picker')}>
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" className={tw('primary-btn full-width')} onClick={() => addToCart(product, quantity, selectedVariant)}>
                Add to Cart
              </button>
              <button type="button" className={tw('secondary-btn')} onClick={() => { addToCart(product, quantity, selectedVariant); navigate('/checkout'); }}>
                Buy Now
              </button>
            </div>

            <div className={tw('action-row')}>
              <button type="button" className={tw('mini-action')} onClick={() => toggleWishlist(product.id)}>
                <Heart size={16} fill={wishlist.includes(product.id) ? '#651F32' : 'none'} />
                {wishlist.includes(product.id) ? 'Saved' : 'Wishlist'}
              </button>
              <span className={tw('stock-status')}>{product.stock > 0 ? `In stock: ${product.stock} left` : 'Out of stock'}</span>
            </div>

            <div className={tw('pincode-checker')}>
              <label>Check delivery availability</label>
              <div className={tw('pincode-input-row')}>
                <input className={tw('form-control')} value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter PIN code" />
                <button type="button" className={tw('secondary-btn')} onClick={handlePincodeCheck}>
                  Check
                </button>
              </div>
              {deliveryStatus && <small>{deliveryStatus}</small>}
            </div>
          </div>
        </div>

        <div className={tw('product-tabs')}>
          <button type="button" className={tw(`rounded-t-xl px-4 py-3 text-sm font-semibold ${product.activeTab === 'description' ? 'active' : 'text-[#817970]'}`)}>Description</button>
          <button type="button">Specifications</button>
          <button type="button">Reviews</button>
        </div>

        <div className={tw('product-tabs__content')}>
          <div className={tw('spec-grid')}>
            <div>
              <span>Fabric Details</span>
              <strong>{product.material}</strong>
            </div>
            <div>
              <span>Care Instructions</span>
              <strong>{product.care}</strong>
            </div>
            <div>
              <span>Availability</span>
              <strong>{product.stock > 0 ? 'Ready to ship' : 'Pre-order'}</strong>
            </div>
            <div>
              <span>Blouse Details</span>
              <strong>{product.blouse}</strong>
            </div>
          </div>

          <div className={tw('review-panel')}>
            <div className={tw('review-card')}>
              <div className={tw('review-stars')}>
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill="#d6ae55" strokeWidth={1.5} />
                ))}
              </div>
              <p>â€œThe drape and finish are stunning. It felt premium from the moment I unboxed it.â€</p>
              <strong>â€” Ankita S.</strong>
            </div>
            <div className={tw('review-card')}>
              <div className={tw('review-stars')}>
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill="#d6ae55" strokeWidth={1.5} />
                ))}
              </div>
              <p>â€œBeautiful zari work and an elegant silhouette. It is perfect for festive occasions.â€</p>
              <strong>â€” Neha R.</strong>
            </div>
          </div>
        </div>

        {recentProducts.length > 0 && (
          <div className={tw('related-section')}>
            <div className={tw('section-header')}>
              <div>
          <span className={tw('section-label')}>You may also like</span>
                <h2 className={tw('section-title')}>You may also like</h2>
              </div>
            </div>
            <div className={tw('product-grid')}>
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

function CartPage({ cart, subtotal, shipping, discount, updateQuantity, removeFromCart }) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const discountValue = appliedCoupon === 'NEW10' ? 699 : discount

  const totalWithCoupon = Math.max(subtotal + shipping - discountValue, 0)

  if (!cart.length) {
    return (
      <section className={tw('section-wrap')}>
        <div className={tw('container empty-state large-empty')}>
          <ShoppingBag size={42} />
          <h2>Your cart is empty</h2>
          <p>Explore our latest saree drops and add your favourites to the cart.</p>
          <Link to="/shop" className={tw('primary-btn')}>
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={tw('section-wrap')}>
      <div className={tw('container cart-layout')}>
        <div className={tw('cart-items-panel')}>
          <div className={tw('section-header compact-header')}>
            <div>
              <span className={tw('section-label')}>Your Bag</span>
              <h2 className={tw('section-title')}>Shopping Cart</h2>
            </div>
            <Link to="/shop" className={tw('secondary-btn')}>
              Continue Shopping
            </Link>
          </div>

          {cart.map((item) => (
            <div className={tw('cart-item')} key={`${item.id}-${item.variant}`}>
              <ImageWithFallback src={item.image} alt={item.name} className="h-24 w-20 shrink-0 rounded-xl object-cover" />
              <div className={tw('cart-item__details')}>
                <h3>{item.name}</h3>
                <p>{item.variant}</p>
                <div className={tw('cart-item__meta')}>
                  <strong>{formatPrice(item.price)}</strong>
                  <div className={tw('quantity-picker small')}>
                    <button type="button" onClick={() => updateQuantity(item.id, item.variant, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.variant, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" className={tw('remove-btn')} onClick={() => removeFromCart(item.id, item.variant)}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className={tw('summary-panel')}>
          <h3>Order Summary</h3>
          <div className={tw('summary-line')}>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className={tw('summary-line')}>
            <span>Discount</span>
            <strong>-{formatPrice(discountValue)}</strong>
          </div>
          <div className={tw('summary-line')}>
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
          </div>

          <div className={tw('coupon-box')}>
            <input className={tw('form-control')} value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Coupon code" />
            <button type="button" className={tw('secondary-btn')} onClick={() => setAppliedCoupon(couponCode.trim() || '')}>
              Apply
            </button>
          </div>

          <div className={tw('summary-total')}>
            <span>Total</span>
            <strong>{formatPrice(totalWithCoupon)}</strong>
          </div>

          <Link to="/checkout" className={tw('primary-btn full-width justify-center')}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  )
}

function CheckoutPage({ cart, total, shipping }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    deliveryMethod: 'Standard Delivery',
    paymentMethod: 'UPI',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Enter a valid email.'
    if (formData.mobile.length < 10) nextErrors.mobile = 'Enter a valid mobile number.'
    if (!formData.address.trim()) nextErrors.address = 'Street address is required.'
    if (!formData.city.trim()) nextErrors.city = 'City is required.'
    if (!formData.state.trim()) nextErrors.state = 'State is required.'
    if (!formData.pincode.trim()) nextErrors.pincode = 'PIN code is required.'

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!cart.length) {
      navigate('/shop')
      return
    }

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className={tw('section-wrap')}>
        <div className={tw('container empty-state large-empty')}>
          <Check size={42} />
          <h2>Order placed successfully</h2>
          <p>Your booking is confirmed and a confirmation message has been sent to your email.</p>
          <Link to="/shop" className={tw('primary-btn')}>
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={tw('section-wrap')}>
      <div className={tw('container checkout-layout')}>
        <form className={tw('checkout-form')} onSubmit={handleSubmit} noValidate>
          <div className={tw('checkout-step')}>
            <span className={tw('section-label')}>Step 1</span>
            <h3>Customer Information</h3>
            <div className={tw('field-grid two-columns')}>
              <div className={tw('field')}>
                <label>Full Name</label>
                <input className={tw('form-control')} name="fullName" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <small>{errors.fullName}</small>}
              </div>
              <div className={tw('field')}>
                <label>Email</label>
                <input className={tw('form-control')} name="email" type="email" value={formData.email} onChange={handleChange} />
                {errors.email && <small>{errors.email}</small>}
              </div>
              <div className={tw('field')}>
                <label>Mobile Number</label>
                <input className={tw('form-control')} name="mobile" value={formData.mobile} onChange={handleChange} />
                {errors.mobile && <small>{errors.mobile}</small>}
              </div>
            </div>
          </div>

          <div className={tw('checkout-step')}>
            <span className={tw('section-label')}>Step 2</span>
            <h3>Shipping Address</h3>
            <div className={tw('field-grid two-columns')}>
              <div className={tw('field full-span')}>
                <label>House/Flat Number</label>
                <input className={tw('form-control')} name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <small>{errors.address}</small>}
              </div>
              <div className={tw('field')}>
                <label>City</label>
                <input className={tw('form-control')} name="city" value={formData.city} onChange={handleChange} />
                {errors.city && <small>{errors.city}</small>}
              </div>
              <div className={tw('field')}>
                <label>State</label>
                <input className={tw('form-control')} name="state" value={formData.state} onChange={handleChange} />
                {errors.state && <small>{errors.state}</small>}
              </div>
              <div className={tw('field')}>
                <label>Country</label>
                <input className={tw('form-control')} name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className={tw('field')}>
                <label>PIN Code</label>
                <input className={tw('form-control')} name="pincode" value={formData.pincode} onChange={handleChange} />
                {errors.pincode && <small>{errors.pincode}</small>}
              </div>
            </div>
          </div>

          <div className={tw('checkout-step')}>
            <span className={tw('section-label')}>Step 3</span>
            <h3>Delivery Method</h3>
            <div className={tw('radio-list')}>
              {['Standard Delivery', 'Express Delivery', 'Pickup at Store'].map((method) => (
                <label key={method} className={tw('radio-option')}>
                  <input className={tw('form-control')}
                    type="radio"
                    name="deliveryMethod"
                    value={method}
                    checked={formData.deliveryMethod === method}
                    onChange={handleChange}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={tw('checkout-step')}>
            <span className={tw('section-label')}>Step 4</span>
            <h3>Payment Method</h3>
            <div className={tw('radio-list')}>
              {['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets', 'Cash on Delivery'].map((method) => (
                <label key={method} className={tw('radio-option')}>
                  <input className={tw('form-control')}
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={tw('primary-btn full-width justify-center')}>
            Place Order
          </button>
        </form>

        <aside className={tw('summary-panel checkout-summary')}>
          <h3>Order Summary</h3>
          <div className={tw('summary-items')}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} className={tw('summary-item')}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className={tw('summary-line')}>
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className={tw('summary-line')}>
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
          </div>
          <div className={tw('summary-line')}>
            <span>Discount</span>
            <strong>-â‚¹699</strong>
          </div>
          <div className={tw('summary-total')}>
            <span>Grand Total</span>
            <strong>{formatPrice(Math.max(total + shipping - 699, 0))}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

function AccountPage() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <section className={tw('section-wrap')}>
      <div className={tw('container account-layout')}>
        <div className={tw('account-card')}>
          <div className={tw('tab-switcher')}>
            <button type="button" className={tw(`rounded-t-xl px-4 py-3 text-sm font-semibold ${activeTab === 'login' ? 'active' : 'text-[#817970]'}`)} onClick={() => setActiveTab('login')}>
              Login
            </button>
            <button type="button" className={tw(`rounded-t-xl px-4 py-3 text-sm font-semibold ${activeTab === 'signup' ? 'active' : 'text-[#817970]'}`)} onClick={() => setActiveTab('signup')}>
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            <form className={tw('account-form')}>
              <div className={tw('field')}>
                <label>Email</label>
                <input className={tw('form-control')} type="email" placeholder="name@example.com" />
              </div>
              <div className={tw('field')}>
                <label>Password</label>
                <input className={tw('form-control')} type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
              </div>
              <button type="button" className={tw('primary-btn full-width justify-center')}>
                Login
              </button>
            </form>
          ) : (
            <form className={tw('account-form')}>
              <div className={tw('field')}>
                <label>Full Name</label>
                <input className={tw('form-control')} type="text" placeholder="Enter full name" />
              </div>
              <div className={tw('field')}>
                <label>Email</label>
                <input className={tw('form-control')} type="email" placeholder="name@example.com" />
              </div>
              <div className={tw('field')}>
                <label>Password</label>
                <input className={tw('form-control')} type="password" placeholder="Create password" />
              </div>
              <button type="button" className={tw('primary-btn full-width justify-center')}>
                Create Account
              </button>
            </form>
          )}
        </div>

        <div className={tw('account-card account-info')}>
          <span className={tw('section-label')}>Customer Access</span>
          <h3>Everything you need after purchase</h3>
          <ul>
            <li>Wishlist saved for future picks</li>
            <li>Order history and delivery tracking</li>
            <li>Saved addresses and secure checkout</li>
            <li>Easy returns and support requests</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function AdminPage({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const emptyForm = {
    id: '',
    name: '',
    category: 'Silk Sarees',
    fabric: 'Silk',
    price: 2999,
    discountedPrice: 2499,
    discount: 16,
    stock: 10,
    rating: 4.5,
    reviews: 0,
    badge: 'New',
    color: 'Ivory',
    colors: 'Ivory, Rose, Gold',
    occasion: 'Festive',
    material: 'Silk',
    length: '5.5 meters',
    blouse: 'Included',
    care: 'Dry clean preferred.',
    description: '',
    images: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  }

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const normalizeProduct = (rawProduct) => {
    const colors = rawProduct.colors
      ? rawProduct.colors
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [rawProduct.color].filter(Boolean)

    const images = rawProduct.images
      ? rawProduct.images
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        ]

    return {
      ...rawProduct,
      id: rawProduct.id || rawProduct.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(rawProduct.price) || 0,
      discountedPrice: Number(rawProduct.discountedPrice) || Number(rawProduct.price) || 0,
      discount: Number(rawProduct.discount) || 0,
      stock: Number(rawProduct.stock) || 0,
      rating: Number(rawProduct.rating) || 0,
      reviews: Number(rawProduct.reviews) || 0,
      colors: colors.length ? colors : [rawProduct.color || 'Classic'],
      images: images.length ? images : [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      ],
      color: rawProduct.color || colors[0] || 'Classic',
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedProduct = normalizeProduct(form)

    if (editingId) {
      onUpdateProduct(editingId, normalizedProduct)
    } else {
      onAddProduct(normalizedProduct)
    }

    resetForm()
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      ...product,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.color,
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images,
    })
  }

  const handleDelete = (productId) => {
    onDeleteProduct(productId)
    if (editingId === productId) resetForm()
  }

  return (
    <section className={tw('section-wrap')}>
      <div className={tw('container admin-layout')}>
        <div className={tw('admin-header')}>
          <div>
            <span className={tw('section-label')}>Admin Dashboard</span>
            <h2 className={tw('section-title')}>Luxury Brand Inventory</h2>
          </div>
          <button type="button" className={tw('secondary-btn')} onClick={resetForm}>Reset Form</button>
        </div>

        <div className={tw('admin-metrics')}>
          <div className={tw('metric-card')}>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className={tw('metric-card')}>
            <span>Featured Stock</span>
            <strong>{products.reduce((sum, item) => sum + item.stock, 0)}</strong>
          </div>
          <div className={tw('metric-card')}>
            <span>Avg Rating</span>
            <strong>{(products.reduce((sum, item) => sum + item.rating, 0) / (products.length || 1)).toFixed(1)}</strong>
          </div>
          <div className={tw('metric-card')}>
            <span>Best Seller</span>
            <strong>{products[0]?.name?.split(' ')[0] || 'New'}</strong>
          </div>
        </div>

        <div className={tw('admin-panels')}>
          <div className={tw('admin-card')}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form className={tw('account-form')} onSubmit={handleSubmit}>
              <div className={tw('field-grid two-columns')}>
                <div className={tw('field')}>
                  <label htmlFor="name">Product Name</label>
                  <input className={tw('form-control')} id="name" name="name" value={form.name} onChange={handleInputChange} placeholder="Royal Silk Saree" required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="category">Category</label>
                  <input className={tw('form-control')} id="category" name="category" value={form.category} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="fabric">Fabric</label>
                  <input className={tw('form-control')} id="fabric" name="fabric" value={form.fabric} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="occasion">Occasion</label>
                  <input className={tw('form-control')} id="occasion" name="occasion" value={form.occasion} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="price">Price</label>
                  <input className={tw('form-control')} id="price" name="price" type="number" value={form.price} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="discountedPrice">Selling Price</label>
                  <input className={tw('form-control')} id="discountedPrice" name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="discount">Discount %</label>
                  <input className={tw('form-control')} id="discount" name="discount" type="number" value={form.discount} onChange={handleInputChange} />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="stock">Stock</label>
                  <input className={tw('form-control')} id="stock" name="stock" type="number" value={form.stock} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="rating">Rating</label>
                  <input className={tw('form-control')} id="rating" name="rating" type="number" step="0.1" value={form.rating} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="reviews">Reviews</label>
                  <input className={tw('form-control')} id="reviews" name="reviews" type="number" value={form.reviews} onChange={handleInputChange} required />
                </div>
                <div className={tw('field full-span')}>
                  <label htmlFor="colors">Colors (comma separated)</label>
                  <input className={tw('form-control')} id="colors" name="colors" value={form.colors} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="color">Primary Color</label>
                  <input className={tw('form-control')} id="color" name="color" value={form.color} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="material">Material</label>
                  <input className={tw('form-control')} id="material" name="material" value={form.material} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="length">Length</label>
                  <input className={tw('form-control')} id="length" name="length" value={form.length} onChange={handleInputChange} required />
                </div>
                <div className={tw('field')}>
                  <label htmlFor="blouse">Blouse</label>
                  <input className={tw('form-control')} id="blouse" name="blouse" value={form.blouse} onChange={handleInputChange} required />
                </div>
                <div className={tw('field full-span')}>
                  <label htmlFor="images">Image URLs (comma separated)</label>
                  <textarea className={tw('form-control')} id="images" name="images" value={form.images} onChange={handleInputChange} rows="3" required />
                </div>
                <div className={tw('field full-span')}>
                  <label htmlFor="description">Description</label>
                  <textarea className={tw('form-control')} id="description" name="description" value={form.description} onChange={handleInputChange} rows="4" required />
                </div>
                <div className={tw('field full-span')}>
                  <label htmlFor="care">Care Instructions</label>
                  <input className={tw('form-control')} id="care" name="care" value={form.care} onChange={handleInputChange} required />
                </div>
              </div>

              <div className={tw('purchase-row mt-4')}>
                <button type="submit" className={tw('primary-btn')}>
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" className={tw('secondary-btn')} onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className={tw('admin-card')}>
            <h3>Current Inventory</h3>
            <div className={tw('admin-product-list')}>
              {products.map((product) => (
                <div key={product.id} className={tw('admin-product-item')}>
                  <div className={tw('admin-product-top')}>
                    <div>
                      <strong>{product.name}</strong>
                      <div className={tw('admin-product-meta')}>
                        <span>{product.category}</span>
                        <span>{product.stock} in stock</span>
                      </div>
                    </div>
                    <span className={tw('discount-tag')}>â‚¹{product.discountedPrice}</span>
                  </div>
                  <div className={tw('admin-product-actions')}>
                    <button type="button" className={tw('secondary-btn')} onClick={() => handleEdit(product)}>Edit</button>
                    <button type="button" className={tw('icon-button')} onClick={() => handleDelete(product.id)} aria-label={`Delete ${product.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className={tw('section-wrap')}>
      <div className={tw('container empty-state large-empty')}>
        <Search size={42} />
        <h2>Nothing found here</h2>
        <p>The page you are looking for is unavailable.</p>
        <Link to="/shop" className={tw('primary-btn')}>
          Explore Sarees
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

export default App
