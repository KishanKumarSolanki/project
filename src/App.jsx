import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Filter,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { products } from './data/products'
import Footer from './components/Footer'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import MobileBottomNav from './components/MobileBottomNav'
import BenefitsSection from './components/home/BenefitsSection'
import BestSellersSection from './components/home/BestSellersSection'
import CategorySection from './components/home/CategorySection'
import HeroSection from './components/home/HeroSection'
import NewArrivalsSection from './components/home/NewArrivalsSection'
import PromoBannerSection from './components/home/PromoBannerSection'
import StorySection from './components/home/StorySection'
import { formatPrice } from './utils/formatPrice'

const PRODUCT_STORAGE_KEY = 'ananyaCatalog'

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
      <div className="luxury-shell">
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
        <MobileBottomNav cartCount={cartCount} wishlistCount={wishlist.length} />
      </div>
    </BrowserRouter>
  )
}

function HomePage({ addToCart, toggleWishlist, wishlist, products }) {
  const [quickView, setQuickView] = useState(null)
  const featuredProducts = products.slice(0, 4)
  const bestSellers = products.slice(2, 6)

  return (
    <>
      <HeroSection />
      <CategorySection />
      <NewArrivalsSection
        featuredProducts={featuredProducts}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
        setQuickView={setQuickView}
      />
      <PromoBannerSection />
      <BestSellersSection
        bestSellers={bestSellers}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
        setQuickView={setQuickView}
      />
      <StorySection />
      <BenefitsSection />

      <AnimatePresence>
        {quickView && (
          <QuickViewModal
            product={quickView}
            addToCart={addToCart}
            onClose={() => setQuickView(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ShopPage({ addToCart, toggleWishlist, wishlist, products }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFabric, setSelectedFabric] = useState('All')
  const [selectedColor, setSelectedColor] = useState('All')
  const [selectedOccasion, setSelectedOccasion] = useState('All')
  const [maxPrice, setMaxPrice] = useState(7000)
  const [sortBy, setSortBy] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()

    return [...products]
      .filter((product) => {
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.fabric.toLowerCase().includes(query)

        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory
        const matchesFabric = selectedFabric === 'All' || product.fabric === selectedFabric
        const matchesColor =
          selectedColor === 'All' || product.colors.includes(selectedColor)
        const matchesOccasion =
          selectedOccasion === 'All' || product.occasion === selectedOccasion
        const matchesPrice = product.discountedPrice <= maxPrice

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFabric &&
          matchesColor &&
          matchesOccasion &&
          matchesPrice
        )
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.discountedPrice - b.discountedPrice
          case 'price-high':
            return b.discountedPrice - a.discountedPrice
          case 'popular':
            return b.rating - a.rating
          case 'newest':
            return b.discount - a.discount
          default:
            return b.rating * 10 - a.rating * 10
        }
      })
  }, [search, selectedCategory, selectedFabric, selectedColor, selectedOccasion, maxPrice, sortBy])

  const categoryOptions = ['All', ...new Set(products.map((product) => product.category))]
  const fabricOptions = ['All', ...new Set(products.map((product) => product.fabric))]
  const colorOptions = ['All', ...new Set(products.flatMap((product) => product.colors))]
  const occasionOptions = ['All', ...new Set(products.map((product) => product.occasion))]

  return (
    <section className="section-wrap">
      <div className="container shop-layout">
        <aside className={`shop-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="shop-sidebar__header">
            <span className="section-label">Filters</span>
            <button type="button" className="icon-button" onClick={() => setMobileFiltersOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div className="search-input">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sarees" />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="chip-list">
              {categoryOptions.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`chip ${selectedCategory === category ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Fabric</label>
            <div className="chip-list">
              {fabricOptions.map((fabric) => (
                <button
                  type="button"
                  key={fabric}
                  className={`chip ${selectedFabric === fabric ? 'selected' : ''}`}
                  onClick={() => setSelectedFabric(fabric)}
                >
                  {fabric}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <input
              type="range"
              min="1500"
              max="7000"
              step="100"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="slider"
            />
            <div className="price-range">
              <span>₹1500</span>
              <span>₹{maxPrice}</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Color</label>
            <div className="chip-list">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`chip ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Occasion</label>
            <div className="chip-list">
              {occasionOptions.map((occasion) => (
                <button
                  type="button"
                  key={occasion}
                  className={`chip ${selectedOccasion === occasion ? 'selected' : ''}`}
                  onClick={() => setSelectedOccasion(occasion)}
                >
                  {occasion}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="shop-content">
          <div className="shop-toolbar">
            <div className="shop-toolbar__topline">
              <button type="button" className="filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
                <Filter size={16} />
                Filters
              </button>
              <span>{filteredProducts.length} products</span>
            </div>

            <div className="sort-select-wrap">
              <label htmlFor="sortBy">Sort by</label>
              <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="popular">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No sarees match your filters.</h3>
                <button type="button" className="secondary-btn" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedFabric('All'); setSelectedColor('All'); setSelectedOccasion('All'); setMaxPrice(7000); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductPage({ addToCart, toggleWishlist, wishlist, products }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((item) => item.id === id)
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '')
  const [selectedVariant, setSelectedVariant] = useState(product?.colors?.[0] || 'Classic')
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    if (!product) return
    setSelectedImage(product.images[0])
    setSelectedVariant(product.colors[0])
    setQuantity(1)
    setRecentlyViewed((current) => [product.id, ...current.filter((entry) => entry !== product.id)].slice(0, 4))
  }, [product])

  if (!product) {
    return <NotFound />
  }

  const recentProducts = products.filter((item) => recentlyViewed.includes(item.id))

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
    <section className="section-wrap product-page">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img src={selectedImage} alt={product.name} className="zoomable" />
            </div>
            <div className="product-gallery__thumbs">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={`thumb ${selectedImage === image ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <span className="section-label">{product.category}</span>
            <h1 className="serif product-title">{product.name}</h1>
            <div className="rating-row">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill={index < Math.round(product.rating) ? '#d6ae55' : '#dfe2e8'} strokeWidth={1.5} />
                ))}
              </div>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="price-row">
              <span className="current-price">{formatPrice(product.discountedPrice)}</span>
              <span className="old-price">{formatPrice(product.price)}</span>
              <span className="discount-tag">{product.discount}% Off</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="detail-box">
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

            <div className="variant-block">
              <span>Available Colors</span>
              <div className="variant-list">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`variant-pill ${selectedVariant === color ? 'selected' : ''}`}
                    onClick={() => setSelectedVariant(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="purchase-row">
              <div className="quantity-picker">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" className="primary-btn full-width" onClick={() => addToCart(product, quantity, selectedVariant)}>
                Add to Cart
              </button>
              <button type="button" className="secondary-btn" onClick={() => { addToCart(product, quantity, selectedVariant); navigate('/checkout'); }}>
                Buy Now
              </button>
            </div>

            <div className="action-row">
              <button type="button" className="mini-action" onClick={() => toggleWishlist(product.id)}>
                <Heart size={16} fill={wishlist.includes(product.id) ? '#651F32' : 'none'} />
                {wishlist.includes(product.id) ? 'Saved' : 'Wishlist'}
              </button>
              <span className="stock-status">{product.stock > 0 ? `In stock: ${product.stock} left` : 'Out of stock'}</span>
            </div>

            <div className="pincode-checker">
              <label>Check delivery availability</label>
              <div className="pincode-input-row">
                <input value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter PIN code" />
                <button type="button" className="secondary-btn" onClick={handlePincodeCheck}>
                  Check
                </button>
              </div>
              {deliveryStatus && <small>{deliveryStatus}</small>}
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <button type="button" className={product.activeTab === 'description' ? 'active' : ''}>Description</button>
          <button type="button">Specifications</button>
          <button type="button">Reviews</button>
        </div>

        <div className="product-tabs__content">
          <div className="spec-grid">
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

          <div className="review-panel">
            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill="#d6ae55" strokeWidth={1.5} />
                ))}
              </div>
              <p>“The drape and finish are stunning. It felt premium from the moment I unboxed it.”</p>
              <strong>— Ankita S.</strong>
            </div>
            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} fill="#d6ae55" strokeWidth={1.5} />
                ))}
              </div>
              <p>“Beautiful zari work and an elegant silhouette. It is perfect for festive occasions.”</p>
              <strong>— Neha R.</strong>
            </div>
          </div>
        </div>

        {recentProducts.length > 0 && (
          <div className="related-section">
            <div className="section-header">
              <div>
                <span className="section-label">Recently Viewed</span>
                <h2 className="section-title">You may also like</h2>
              </div>
            </div>
            <div className="product-grid">
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
      <section className="section-wrap">
        <div className="container empty-state large-empty">
          <ShoppingBag size={42} />
          <h2>Your cart is empty</h2>
          <p>Explore our latest saree drops and add your favourites to the cart.</p>
          <Link to="/shop" className="primary-btn">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-wrap">
      <div className="container cart-layout">
        <div className="cart-items-panel">
          <div className="section-header compact-header">
            <div>
              <span className="section-label">Your Bag</span>
              <h2 className="section-title">Shopping Cart</h2>
            </div>
            <Link to="/shop" className="secondary-btn">
              Continue Shopping
            </Link>
          </div>

          {cart.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.variant}`}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item__details">
                <h3>{item.name}</h3>
                <p>{item.variant}</p>
                <div className="cart-item__meta">
                  <strong>{formatPrice(item.price)}</strong>
                  <div className="quantity-picker small">
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
              <button type="button" className="remove-btn" onClick={() => removeFromCart(item.id, item.variant)}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="summary-panel">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <strong>-{formatPrice(discountValue)}</strong>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
          </div>

          <div className="coupon-box">
            <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Coupon code" />
            <button type="button" className="secondary-btn" onClick={() => setAppliedCoupon(couponCode.trim() || '')}>
              Apply
            </button>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(totalWithCoupon)}</strong>
          </div>

          <Link to="/checkout" className="primary-btn full-width justify-center">
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
      <section className="section-wrap">
        <div className="container empty-state large-empty">
          <Check size={42} />
          <h2>Order placed successfully</h2>
          <p>Your booking is confirmed and a confirmation message has been sent to your email.</p>
          <Link to="/shop" className="primary-btn">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-wrap">
      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="checkout-step">
            <span className="section-label">Step 1</span>
            <h3>Customer Information</h3>
            <div className="field-grid two-columns">
              <div className="field">
                <label>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <small>{errors.fullName}</small>}
              </div>
              <div className="field">
                <label>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />
                {errors.email && <small>{errors.email}</small>}
              </div>
              <div className="field">
                <label>Mobile Number</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} />
                {errors.mobile && <small>{errors.mobile}</small>}
              </div>
            </div>
          </div>

          <div className="checkout-step">
            <span className="section-label">Step 2</span>
            <h3>Shipping Address</h3>
            <div className="field-grid two-columns">
              <div className="field full-span">
                <label>House/Flat Number</label>
                <input name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <small>{errors.address}</small>}
              </div>
              <div className="field">
                <label>City</label>
                <input name="city" value={formData.city} onChange={handleChange} />
                {errors.city && <small>{errors.city}</small>}
              </div>
              <div className="field">
                <label>State</label>
                <input name="state" value={formData.state} onChange={handleChange} />
                {errors.state && <small>{errors.state}</small>}
              </div>
              <div className="field">
                <label>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="field">
                <label>PIN Code</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} />
                {errors.pincode && <small>{errors.pincode}</small>}
              </div>
            </div>
          </div>

          <div className="checkout-step">
            <span className="section-label">Step 3</span>
            <h3>Delivery Method</h3>
            <div className="radio-list">
              {['Standard Delivery', 'Express Delivery', 'Pickup at Store'].map((method) => (
                <label key={method} className="radio-option">
                  <input
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

          <div className="checkout-step">
            <span className="section-label">Step 4</span>
            <h3>Payment Method</h3>
            <div className="radio-list">
              {['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets', 'Cash on Delivery'].map((method) => (
                <label key={method} className="radio-option">
                  <input
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

          <button type="submit" className="primary-btn full-width justify-center">
            Place Order
          </button>
        </form>

        <aside className="summary-panel checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="summary-item">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <strong>-₹699</strong>
          </div>
          <div className="summary-total">
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
    <section className="section-wrap">
      <div className="container account-layout">
        <div className="account-card">
          <div className="tab-switcher">
            <button type="button" className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>
              Login
            </button>
            <button type="button" className={activeTab === 'signup' ? 'active' : ''} onClick={() => setActiveTab('signup')}>
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            <form className="account-form">
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="name@example.com" />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button type="button" className="primary-btn full-width justify-center">
                Login
              </button>
            </form>
          ) : (
            <form className="account-form">
              <div className="field">
                <label>Full Name</label>
                <input type="text" placeholder="Enter full name" />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="name@example.com" />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" placeholder="Create password" />
              </div>
              <button type="button" className="primary-btn full-width justify-center">
                Create Account
              </button>
            </form>
          )}
        </div>

        <div className="account-card account-info">
          <span className="section-label">Customer Access</span>
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
    <section className="section-wrap">
      <div className="container admin-layout">
        <div className="admin-header">
          <div>
            <span className="section-label">Admin Dashboard</span>
            <h2 className="section-title">Luxury Brand Inventory</h2>
          </div>
          <button type="button" className="secondary-btn" onClick={resetForm}>Reset Form</button>
        </div>

        <div className="admin-metrics">
          <div className="metric-card">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="metric-card">
            <span>Featured Stock</span>
            <strong>{products.reduce((sum, item) => sum + item.stock, 0)}</strong>
          </div>
          <div className="metric-card">
            <span>Avg Rating</span>
            <strong>{(products.reduce((sum, item) => sum + item.rating, 0) / (products.length || 1)).toFixed(1)}</strong>
          </div>
          <div className="metric-card">
            <span>Best Seller</span>
            <strong>{products[0]?.name?.split(' ')[0] || 'New'}</strong>
          </div>
        </div>

        <div className="admin-panels">
          <div className="admin-card">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="field-grid two-columns">
                <div className="field">
                  <label htmlFor="name">Product Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleInputChange} placeholder="Royal Silk Saree" required />
                </div>
                <div className="field">
                  <label htmlFor="category">Category</label>
                  <input id="category" name="category" value={form.category} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="fabric">Fabric</label>
                  <input id="fabric" name="fabric" value={form.fabric} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="occasion">Occasion</label>
                  <input id="occasion" name="occasion" value={form.occasion} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="price">Price</label>
                  <input id="price" name="price" type="number" value={form.price} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="discountedPrice">Selling Price</label>
                  <input id="discountedPrice" name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="discount">Discount %</label>
                  <input id="discount" name="discount" type="number" value={form.discount} onChange={handleInputChange} />
                </div>
                <div className="field">
                  <label htmlFor="stock">Stock</label>
                  <input id="stock" name="stock" type="number" value={form.stock} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="rating">Rating</label>
                  <input id="rating" name="rating" type="number" step="0.1" value={form.rating} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="reviews">Reviews</label>
                  <input id="reviews" name="reviews" type="number" value={form.reviews} onChange={handleInputChange} required />
                </div>
                <div className="field full-span">
                  <label htmlFor="colors">Colors (comma separated)</label>
                  <input id="colors" name="colors" value={form.colors} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="color">Primary Color</label>
                  <input id="color" name="color" value={form.color} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="material">Material</label>
                  <input id="material" name="material" value={form.material} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="length">Length</label>
                  <input id="length" name="length" value={form.length} onChange={handleInputChange} required />
                </div>
                <div className="field">
                  <label htmlFor="blouse">Blouse</label>
                  <input id="blouse" name="blouse" value={form.blouse} onChange={handleInputChange} required />
                </div>
                <div className="field full-span">
                  <label htmlFor="images">Image URLs (comma separated)</label>
                  <textarea id="images" name="images" value={form.images} onChange={handleInputChange} rows="3" required />
                </div>
                <div className="field full-span">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={form.description} onChange={handleInputChange} rows="4" required />
                </div>
                <div className="field full-span">
                  <label htmlFor="care">Care Instructions</label>
                  <input id="care" name="care" value={form.care} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="purchase-row" style={{ marginTop: '1rem' }}>
                <button type="submit" className="primary-btn">
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h3>Current Inventory</h3>
            <div className="admin-product-list">
              {products.map((product) => (
                <div key={product.id} className="admin-product-item">
                  <div className="admin-product-top">
                    <div>
                      <strong>{product.name}</strong>
                      <div className="admin-product-meta">
                        <span>{product.category}</span>
                        <span>{product.stock} in stock</span>
                      </div>
                    </div>
                    <span className="discount-tag">₹{product.discountedPrice}</span>
                  </div>
                  <div className="admin-product-actions">
                    <button type="button" className="secondary-btn" onClick={() => handleEdit(product)}>Edit</button>
                    <button type="button" className="icon-button" onClick={() => handleDelete(product.id)} aria-label={`Delete ${product.name}`}>
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

function QuickViewModal({ product, addToCart, onClose }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="quick-view-modal"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close quick view">
          <X size={18} />
        </button>
        <div className="quick-view-grid">
          <img src={product.images[0]} alt={product.name} />
          <div>
            <span className="section-label">{product.category}</span>
            <h3>{product.name}</h3>
            <div className="price-row">
              <span className="current-price">{formatPrice(product.discountedPrice)}</span>
              <span className="old-price">{formatPrice(product.price)}</span>
            </div>
            <p>{product.description}</p>
            <button type="button" className="primary-btn full-width justify-center" onClick={() => { addToCart(product, 1); onClose(); }}>
              Add to Cart
            </button>
            <Link to={`/product/${product.id}`} className="secondary-btn full-width justify-center" onClick={onClose}>
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function NotFound() {
  return (
    <section className="section-wrap">
      <div className="container empty-state large-empty">
        <Search size={42} />
        <h2>Nothing found here</h2>
        <p>The page you are looking for is unavailable.</p>
        <Link to="/shop" className="primary-btn">
          Explore Sarees
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

export default App