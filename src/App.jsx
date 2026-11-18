import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
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
  X,
} from 'lucide-react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { products } from './data/products'
import { shopTabs } from './data/shopCollections'
import { auth, db } from './firebase'
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

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const PRODUCT_STORAGE_KEY = 'ananyaCatalog'
const CART_STORAGE_KEY = 'sareeCart'
const WISHLIST_STORAGE_KEY = 'sareeWishlist'
const ORDERS_STORAGE_KEY = 'ananyaOrders'
const SEED_PREFIX = 'ananyaCatalog'
const SEED_PRODUCT_IDS = [
  'floral-printed-pure-linen-saree',
  'munga-mashru-pure-silk-saree',
  'linen-cotton-block-printed-saree',
  'navy-blue-pure-linen-saree',
]
const SERVICEABLE_PINCODES = ['110001', '400001', '560001', '700001', '600001']
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
const SHIPPING_THRESHOLD = 1499
const SHIPPING_FEE = 199
const DISCOUNT_RATE = 0.12

const DELIVERY_OPTIONS = [
  { value: 'Standard Delivery', description: '4-6 business days' },
  { value: 'Express Delivery', description: 'Faster delivery' },
  { value: 'Pickup at Store', description: 'Collect from our store' },
]

const PAYMENT_OPTIONS = [
  { value: 'Cash on Delivery', description: 'Pay in cash when your order arrives' },
  { value: 'UPI' },
  { value: 'Credit/Debit Cards' },
  { value: 'Net Banking' },
  { value: 'Wallets' },
]

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Console.',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in popup. Allow popups and try again.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/unauthorized-domain': 'Add this website domain to Firebase Authentication authorized domains.',
  'auth/weak-password': 'Choose a password with at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled.',
}

/* ------------------------------------------------------------------ */
/* Design tokens (Tailwind classes reused across the app)             */
/* ------------------------------------------------------------------ */

const ui = {
  page: 'min-h-screen bg-[#f8f5e9] pb-24 text-[#2c1e19] md:pb-0',
  section: 'w-full px-4 py-8 sm:px-7 sm:py-14',
  container: 'mx-auto w-full max-w-7xl',
  card: 'rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] shadow-[0_1px_2px_rgba(44,30,25,0.04)]',
  cardPad: 'p-5 sm:p-7',
  eyebrow: 'text-[11px] font-bold uppercase tracking-[0.2em] text-[#81622f]',
  h1: 'text-3xl font-semibold leading-tight tracking-tight text-[#2c1e19] sm:text-4xl lg:text-5xl',
  h2: 'text-2xl font-semibold leading-tight tracking-tight text-[#2c1e19] sm:text-3xl',
  h3: 'text-lg font-semibold text-[#2c1e19]',
  body: 'text-sm leading-6 text-[#71645b]',
  muted: 'text-xs text-[#817970]',
  btnPrimary:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2c1e19] px-5 text-sm font-semibold text-white transition hover:bg-[#49352c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  btnSecondary:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2c1e19] px-5 text-sm font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  btnGhost:
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e2d9c5] px-4 text-sm font-semibold text-[#493b32] transition hover:border-[#b88a3e]',
  input:
    'w-full rounded-xl border border-[#e2d9c5] bg-white px-3.5 py-3 text-[15px] text-[#2c1e19] outline-none transition placeholder:text-[#a29a8e] focus:border-[#b88a3e] focus:ring-2 focus:ring-[#b88a3e]/20',
  label: 'mb-1.5 block text-sm font-medium text-[#493b32]',
  errorText: 'mt-1.5 text-xs text-[#a23b36]',
  alertError: 'rounded-xl bg-[#f3e7e5] p-3 text-sm text-[#a23b36]',
  badge: 'inline-flex items-center rounded-full bg-[#eaf7f1] px-3 py-1 text-xs font-semibold text-[#247b5c]',
  stepBadge:
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2c1e19] text-xs font-bold text-white',
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode or quota). Fail silently.
  }
}

const getStoredProducts = () => {
  const saved = readStorage(PRODUCT_STORAGE_KEY, null)
  return Array.isArray(saved) && saved.length > 0 ? saved : products
}

const getAuthErrorMessage = (error) =>
  AUTH_ERROR_MESSAGES[error?.code] || 'Unable to authenticate. Please try again.'

const getAddressKey = (address) =>
  [address.street, address.city, address.state, address.zip, address.country]
    .map((value) => String(value || '').trim().toLowerCase())
    .join('|')

const googleProvider = new GoogleAuthProvider()

/* ------------------------------------------------------------------ */
/* Firestore services                                                 */
/* ------------------------------------------------------------------ */

const saveUserProfile = async (firebaseUser) => {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const snapshot = await getDoc(userRef)
  const existing = snapshot.exists() ? snapshot.data() : {}

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      name:
        firebaseUser.displayName ||
        existing.name ||
        firebaseUser.email?.split('@')[0] ||
        'Customer',
      email: firebaseUser.email || existing.email || null,
      ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
      ...(!snapshot.exists() ? { role: 'customer', createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

const saveCheckoutAddress = async (firebaseUser, formData) => {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const snapshot = await getDoc(userRef)
  const profile = snapshot.exists() ? snapshot.data() : {}
  const addresses = Array.isArray(profile.addresses)
    ? profile.addresses.filter((address) => address && typeof address === 'object')
    : []

  const address = {
    street: formData.address.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    zip: formData.pincode.trim(),
    country: formData.country.trim() || 'India',
  }

  const matchIndex = addresses.findIndex(
    (saved) => getAddressKey(saved) === getAddressKey(address),
  )
  const hasDefault = addresses.some((saved) => saved.isDefault === true)
  const makeDefault = !hasDefault
  let nextAddresses

  if (matchIndex >= 0) {
    nextAddresses = addresses.map((saved, index) =>
      index === matchIndex && makeDefault ? { ...saved, isDefault: true } : saved,
    )
  } else {
    nextAddresses = [
      ...addresses.map((saved) => (makeDefault ? { ...saved, isDefault: false } : saved)),
      {
        id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...address,
        isDefault: makeDefault,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      name:
        formData.fullName.trim() ||
        firebaseUser.displayName ||
        profile.name ||
        firebaseUser.email?.split('@')[0] ||
        'Customer',
      email: formData.email.trim() || firebaseUser.email || profile.email || null,
      ...(formData.mobile.trim() ? { phone: formData.mobile.trim() } : {}),
      addresses: nextAddresses,
      ...(!snapshot.exists() ? { role: 'customer', createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

const saveOrderToFirestore = async (firebaseUser, order) => {
  await setDoc(doc(db, 'orders', order.id), {
    ...order,
    uid: firebaseUser.uid,
    createdAt: serverTimestamp(),
  })
}

/* ------------------------------------------------------------------ */
/* Small UI primitives                                                */
/* ------------------------------------------------------------------ */

function Field({ label, error, className = '', children }) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <label className={ui.label}>{label}</label>
      {children}
      {error && <p className={ui.errorText}>{error}</p>}
    </div>
  )
}

function StepHeader({ step, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className={ui.stepBadge}>{step}</span>
        <h3 className={ui.h3}>{title}</h3>
      </div>
      {subtitle && <p className={`mt-2 pl-10 ${ui.body}`}>{subtitle}</p>}
    </div>
  )
}

function OptionCard({ name, value, description, checked, onChange }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        checked
          ? 'border-[#b88a3e] bg-[#fbf6ea] ring-1 ring-[#b88a3e]'
          : 'border-[#e2d9c5] bg-white hover:border-[#b88a3e]/60'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#b88a3e]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#2c1e19]">{value}</span>
        {description && <span className="mt-0.5 block text-xs text-[#71645b]">{description}</span>}
      </span>
    </label>
  )
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <span className={ui.eyebrow}>{eyebrow}</span>}
        <h2 className={`mt-2 ${ui.h2}`}>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, actionLabel = 'Explore Sarees', actionTo = '/shop' }) {
  return (
    <section className={ui.section}>
      <div className={`${ui.container} flex justify-center`}>
        <div className={`${ui.card} flex w-full max-w-lg flex-col items-center gap-3 px-6 py-14 text-center sm:py-20`}>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eee7d7] text-[#81622f]">
            <Icon size={28} strokeWidth={1.6} />
          </span>
          <h2 className={ui.h2}>{title}</h2>
          <p className={`max-w-sm ${ui.body}`}>{description}</p>
          <Link to={actionTo} className={`${ui.btnPrimary} mt-4`}>
            {actionLabel}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* App shell                                                          */
/* ------------------------------------------------------------------ */

function App() {
  const [cart, setCart] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_STORAGE_KEY, []))
  const [catalog, setCatalog] = useState(getStoredProducts)
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser)
  const [authReady, setAuthReady] = useState(Boolean(auth.currentUser))
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginMode, setLoginMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ fullName: '', email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const openLoginPrompt = useCallback(() => setShowLoginPrompt(true), [])

  useEffect(() => writeStorage(CART_STORAGE_KEY, cart), [cart])
  useEffect(() => writeStorage(WISHLIST_STORAGE_KEY, wishlist), [wishlist])
  useEffect(() => writeStorage(PRODUCT_STORAGE_KEY, catalog), [catalog])

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setFirebaseUser(currentUser)
    setAuthReady(true)
    if (currentUser) {
      setShowLoginPrompt(false)
    }
  }), [])

  useEffect(() => {
    if (!showLoginPrompt) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowLoginPrompt(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLoginPrompt])

  // One-time seeding of newer catalog items for returning visitors.
  useEffect(() => {
    SEED_PRODUCT_IDS.forEach((productId) => {
      const flagKey = `${SEED_PREFIX}${productId}Seeded`
      if (window.localStorage.getItem(flagKey) === 'true') return

      const seedProduct = products.find((product) => product.id === productId)
      if (seedProduct) {
        setCatalog((current) =>
          current.some((product) => product.id === productId) ? current : [seedProduct, ...current],
        )
      }
      window.localStorage.setItem(flagKey, 'true')
    })
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddProduct = (product) => setCatalog((current) => [product, ...current])

  const handleUpdateProduct = (productId, updatedProduct) =>
    setCatalog((current) =>
      current.map((item) => (item.id === productId ? { ...item, ...updatedProduct } : item)),
    )

  const handleDeleteProduct = (productId) =>
    setCatalog((current) => current.filter((item) => item.id !== productId))

  const addToCart = (product, quantity = 1, variant = product.colors?.[0] ?? 'Classic') => {
    if (!product || product.stock < 1) return

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.variant === variant)

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

  const handleLoginPromptSubmit = async (event) => {
    event.preventDefault()
    setLoginError('')
    setIsAuthenticating(true)

    try {
      if (loginMode === 'signup') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          loginForm.email.trim(),
          loginForm.password,
        )
        if (loginForm.fullName.trim()) {
          await updateProfile(credential.user, { displayName: loginForm.fullName.trim() })
        }
      } else {
        await signInWithEmailAndPassword(auth, loginForm.email.trim(), loginForm.password)
      }
    } catch (error) {
      setLoginError(getAuthErrorMessage(error))
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLoginPromptGoogleSignIn = async () => {
    setLoginError('')
    setIsAuthenticating(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setLoginError(getAuthErrorMessage(error))
    } finally {
      setIsAuthenticating(false)
    }
  }

  const updateQuantity = (productId, variant, delta) =>
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId || item.variant !== variant) return [item]
        const nextQuantity = item.quantity + delta
        return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }]
      }),
    )

  const removeFromCart = (productId, variant) =>
    setCart((current) =>
      current.filter((item) => !(item.id === productId && item.variant === variant)),
    )

  const toggleWishlist = (productId) =>
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : cart.length ? SHIPPING_FEE : 0
  const discount = subtotal * DISCOUNT_RATE

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={ui.page}>
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
              element={
                firebaseUser ? (
                  <CheckoutPage
                    cart={cart}
                    subtotal={subtotal}
                    shipping={shipping}
                    discount={discount}
                    onOrderPlaced={() => setCart([])}
                  />
                ) : (
                  <CheckoutLoginGate
                    authReady={authReady}
                    onOpenLogin={openLoginPrompt}
                  />
                )
              }
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
        {showLoginPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#2c1e19]/55 px-4 py-6">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-login-title"
              className="relative my-auto w-full max-w-md rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false)
                  setLoginError('')
                }}
                aria-label="Close login prompt"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#71645b] transition hover:bg-[#eee7d7]"
              >
                <X size={20} />
              </button>
              <span className={ui.eyebrow}>Secure checkout</span>
              <h2 id="cart-login-title" className={`mt-2 ${ui.h2}`}>
                {loginMode === 'login' ? 'Login to continue' : 'Create your account'}
              </h2>
              <p className={`mt-2 ${ui.body}`}>
                Sign in or create an account to continue with your order.
              </p>

              <div role="tablist" className="mt-5 flex gap-1 border-b border-[#e2d9c5]">
                {[
                  { id: 'login', label: 'Login' },
                  { id: 'signup', label: 'Sign up' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={loginMode === tab.id}
                    type="button"
                    onClick={() => {
                      setLoginMode(tab.id)
                      setLoginError('')
                    }}
                    className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      loginMode === tab.id
                        ? 'border-[#b88a3e] text-[#2c1e19]'
                        : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {loginError && <p role="alert" className={`mt-4 ${ui.alertError}`}>{loginError}</p>}

              <button
                type="button"
                onClick={handleLoginPromptGoogleSignIn}
                disabled={isAuthenticating}
                className={`${ui.btnSecondary} mt-4 w-full`}
              >
                <GoogleIcon />
                {isAuthenticating ? 'Please wait…' : 'Continue with Google'}
              </button>

              <div className="my-4 flex items-center gap-3 text-xs text-[#817970]">
                <span className="h-px flex-1 bg-[#e2d9c5]" />
                or continue with email
                <span className="h-px flex-1 bg-[#e2d9c5]" />
              </div>

              <form className="space-y-4" onSubmit={handleLoginPromptSubmit}>
                {loginMode === 'signup' && (
                  <label className="flex flex-col gap-1.5">
                    <span className={ui.label}>Full name</span>
                    <input
                      className={ui.input}
                      name="fullName"
                      autoComplete="name"
                      value={loginForm.fullName}
                      onChange={(event) =>
                        setLoginForm((current) => ({ ...current, fullName: event.target.value }))
                      }
                      required
                    />
                  </label>
                )}
                <label className="flex flex-col gap-1.5">
                  <span className={ui.label}>Email</span>
                  <input
                    className={ui.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, email: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={ui.label}>Password</span>
                  <input
                    className={ui.input}
                    name="password"
                    type="password"
                    autoComplete={loginMode === 'login' ? 'current-password' : 'new-password'}
                    minLength={6}
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, password: event.target.value }))
                    }
                    required
                  />
                </label>
                <button type="submit" disabled={isAuthenticating} className={`${ui.btnPrimary} w-full`}>
                  {isAuthenticating
                    ? 'Please wait…'
                    : loginMode === 'login'
                      ? 'Login and continue'
                      : 'Create account and continue'}
                </button>
              </form>

              <Link
                to="/cart"
                onClick={() => setShowLoginPrompt(false)}
                className={`${ui.btnGhost} mt-3 w-full`}
              >
                Back to cart
              </Link>
            </section>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}

function CheckoutLoginGate({ authReady, onOpenLogin }) {
  useEffect(() => {
    if (authReady) onOpenLogin()
  }, [authReady, onOpenLogin])

  return (
    <section className={ui.section}>
      <div className={`${ui.card} mx-auto max-w-xl p-6 text-center sm:p-10`}>
        <span className={ui.eyebrow}>Secure checkout</span>
        <h1 className={`mt-2 ${ui.h2}`}>Login to continue</h1>
        <p className={`mt-3 ${ui.body}`}>
          Please log in or create an account before placing your order.
        </p>
        {authReady ? (
          <button type="button" onClick={onOpenLogin} className={`${ui.btnPrimary} mt-6 w-full`}>
            Login / Sign up
          </button>
        ) : (
          <p role="status" className="mt-6 text-sm text-[#71645b]">Checking your account…</p>
        )}
        <Link to="/cart" className={`${ui.btnGhost} mt-3 w-full`}>
          Back to cart
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Wishlist                                                           */
/* ------------------------------------------------------------------ */

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
              <WishlistProductCard key={product.id} product={product} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        ) : (
          <div className={`${ui.card} flex flex-col items-center gap-3 px-6 py-14 text-center sm:py-20`}>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e9ec] text-[#b98791]">
              <Heart size={28} strokeWidth={1.6} />
            </span>
            <h2 className={ui.h2}>Your wishlist is waiting</h2>
            <p className={`max-w-sm ${ui.body}`}>Save the sarees you love and find them here later.</p>
            <Link to="/shop" className={`${ui.btnPrimary} mt-4`}>
              Explore sarees
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Shop                                                               */
/* ------------------------------------------------------------------ */

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
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.fabric.toLowerCase().includes(query)
        const matchesCategory =
          productCategory === 'All' ||
          productCategory === 'Sale' ||
          product.category === productCategory
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

/* ------------------------------------------------------------------ */
/* Product detail                                                     */
/* ------------------------------------------------------------------ */

function ProductPage({ addToCart, toggleWishlist, wishlist, products }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)

  if (!product) return <NotFound />

  return (
    <ProductDetail
      key={product.id}
      product={product}
      products={products}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
    />
  )
}

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

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < Math.round(rating) ? '#d6ae55' : '#e5e0d2'}
          strokeWidth={1.5}
          className={index < Math.round(rating) ? 'text-[#d6ae55]' : 'text-[#e5e0d2]'}
        />
      ))}
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
  const recentProducts = products.filter((item) => item.id !== product.id).slice(0, 4)

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

  const specs = [
    { label: 'Fabric', value: product.material },
    { label: 'Saree length', value: product.length },
    { label: 'Blouse', value: product.blouse },
    { label: 'Care', value: product.care },
    { label: 'Availability', value: inStock ? 'Ready to ship' : 'Pre-order' },
  ]

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#817970]">
          <Link to="/" className="hover:text-[#2c1e19]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#2c1e19]">Shop</Link>
          <span>/</span>
          <span className="truncate text-[#2c1e19]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[#eee7d7]">
              <ImageWithFallback src={selectedImage} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {product.images.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label="View image"
                    className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image ? 'border-[#b88a3e]' : 'border-transparent'
                    }`}
                  >
                    <ImageWithFallback src={image} alt={product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 lg:py-2">
            <span className={ui.eyebrow}>{product.category}</span>
            <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#71645b]">
              <Stars rating={product.rating} />
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-[#2c1e19]">{formatPrice(product.discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-base text-[#817970] line-through">{formatPrice(product.price)}</span>
                  <span className={ui.badge}>{product.discount}% off</span>
                </>
              )}
            </div>

            <p className="mt-5 text-base leading-7 text-[#71645b]">{product.description}</p>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-[#e2d9c5] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#fffdf7]">
              {[
                { label: 'Fabric', value: product.material },
                { label: 'Length', value: product.length },
                { label: 'Blouse', value: product.blouse },
              ].map((item) => (
                <div key={item.label} className="p-4">
                  <dt className="text-xs text-[#817970]">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#2c1e19]">{item.value}</dd>
                </div>
              ))}
            </dl>

            {product.colors.length > 0 && (
              <div className="mt-6">
                <span className="text-sm font-medium text-[#493b32]">Color</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedVariant(color)}
                      aria-pressed={selectedVariant === color}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedVariant === color
                          ? 'border-[#b88a3e] bg-[#b88a3e] text-[#2c1e19]'
                          : 'border-[#e2d9c5] text-[#71645b] hover:border-[#b88a3e]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex min-h-12 items-center gap-4 rounded-xl border border-[#e2d9c5] bg-white px-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#493b32] hover:bg-[#eee7d7]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#493b32] hover:bg-[#eee7d7]"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className={`${ui.btnPrimary} flex-1`}
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
                className={`${ui.btnSecondary} flex-1`}
              >
                Buy now
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={isWishlisted}
                className={ui.btnGhost}
              >
                <Heart size={16} fill={isWishlisted ? '#651F32' : 'none'} className={isWishlisted ? 'text-[#651F32]' : ''} />
                {isWishlisted ? 'Saved' : 'Save to wishlist'}
              </button>
              <span className={`text-sm font-medium ${inStock ? 'text-[#247b5c]' : 'text-[#a23b36]'}`}>
                {inStock ? `In stock · ${product.stock} left` : 'Out of stock'}
              </span>
            </div>

            {/* Pincode */}
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
                  placeholder="Enter PIN code"
                  className={ui.input}
                />
                <button type="button" onClick={handlePincodeCheck} className={`${ui.btnSecondary} shrink-0`}>
                  Check
                </button>
              </div>
              {deliveryStatus && (
                <p className={`mt-2 text-sm ${deliveryStatus.ok ? 'text-[#247b5c]' : 'text-[#a23b36]'}`}>
                  {deliveryStatus.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-[#e2d9c5]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-[#b88a3e] text-[#2c1e19]'
                    : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <p className="max-w-3xl text-base leading-7 text-[#71645b]">{product.description}</p>
            )}

            {activeTab === 'specifications' && (
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#e2d9c5] sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-[#fffdf7] p-5">
                    <dt className="text-xs uppercase tracking-wider text-[#817970]">{spec.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#2c1e19]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === 'reviews' && (
              <div className="grid gap-4 md:grid-cols-2">
                {REVIEWS.map((review) => (
                  <figure key={review.author} className={`${ui.card} p-6`}>
                    <Stars rating={5} />
                    <blockquote className="mt-3 text-[15px] leading-7 text-[#493b32]">“{review.quote}”</blockquote>
                    <figcaption className="mt-4 text-sm font-semibold text-[#2c1e19]">— {review.author}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>

        {recentProducts.length > 0 && (
          <div className="mt-12">
            <SectionHeading eyebrow="Curated for you" title="You may also like" />
            <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
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

/* ------------------------------------------------------------------ */
/* Cart                                                               */
/* ------------------------------------------------------------------ */

function CartPage({ cart, subtotal, shipping, discount, updateQuantity, removeFromCart }) {
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const discountValue = appliedCoupon === 'NEW10' ? 699 : discount
  const total = Math.max(subtotal + shipping - discountValue, 0)

  if (!cart.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Explore our latest saree drops and add your favourites to the bag."
        actionLabel="Continue shopping"
      />
    )
  }

  return (
    <section className={ui.section}>
      <div className={`${ui.container} grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:gap-8`}>
        <div className={`${ui.card} ${ui.cardPad}`}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className={ui.eyebrow}>Your bag</span>
              <h1 className={`mt-2 ${ui.h2}`}>Shopping cart</h1>
            </div>
            <Link to="/shop" className={`${ui.btnGhost} shrink-0`}>
              Continue shopping
            </Link>
          </div>

          <ul className="divide-y divide-[#e2d9c5]">
            {cart.map((item) => (
              <li key={`${item.id}-${item.variant}`} className="flex gap-4 py-5">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold leading-5 text-[#2c1e19] sm:text-base">{item.name}</h2>
                      <p className="mt-1 text-xs text-[#817970] sm:text-sm">{item.variant}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.variant)}
                      aria-label={`Remove ${item.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#817970] transition hover:bg-[#f3e7e5] hover:text-[#a23b36]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex min-h-10 items-center gap-3 rounded-xl border border-[#e2d9c5] bg-white px-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, item.variant, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#eee7d7]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, item.variant, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#eee7d7]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <strong className="text-sm text-[#2c1e19] sm:text-base">
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={`${ui.card} ${ui.cardPad} h-fit lg:sticky lg:top-28`}>
          <h2 className={ui.h3}>Order summary</h2>

          <dl className="mt-4 space-y-3 border-b border-[#e2d9c5] pb-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Subtotal</dt>
              <dd className="text-[#2c1e19]">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Discount{appliedCoupon === 'NEW10' ? ' (NEW10)' : ' (12%)'}</dt>
              <dd className="text-[#247b5c]">−{formatPrice(discountValue)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Shipping</dt>
              <dd className="text-[#2c1e19]">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
          </dl>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              setAppliedCoupon(couponInput.trim().toUpperCase())
            }}
          >
            <input
              className={ui.input}
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              placeholder="Coupon code"
              aria-label="Coupon code"
            />
            <button type="submit" className={`${ui.btnSecondary} shrink-0`}>
              Apply
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold text-[#2c1e19]">Total</span>
            <strong className="text-xl text-[#2c1e19]">{formatPrice(total)}</strong>
          </div>

          <Link to="/checkout" className={`${ui.btnPrimary} mt-5 w-full`}>
            Proceed to checkout
            <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Checkout                                                           */
/* ------------------------------------------------------------------ */

const INITIAL_CHECKOUT_FORM = {
  fullName: '',
  email: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  deliveryMethod: 'Standard Delivery',
  paymentMethod: 'Cash on Delivery',
}

function CheckoutPage({ cart, subtotal, shipping, discount, onOrderPlaced }) {
  const navigate = useNavigate()
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser)
  const [isPlacing, setIsPlacing] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [placedOrder, setPlacedOrder] = useState(null)
  const [formData, setFormData] = useState(INITIAL_CHECKOUT_FORM)

  const discountAmount = Math.round(discount)
  const grandTotal = Math.max(subtotal - discountAmount + shipping, 0)
  const isCod = formData.paymentMethod === 'Cash on Delivery'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser)
      if (currentUser) {
        setFormData((current) => ({
          ...current,
          fullName: current.fullName || currentUser.displayName || '',
          email: current.email || currentUser.email || '',
        }))
      }
    })
    return unsubscribe
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    const mobileDigits = formData.mobile.replace(/\D/g, '')

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email.'
    if (!/^[6-9]\d{9}$/.test(mobileDigits)) nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    if (!formData.address.trim()) nextErrors.address = 'Street address is required.'
    if (!formData.city.trim()) nextErrors.city = 'City is required.'
    if (!formData.state.trim()) nextErrors.state = 'State is required.'
    if (!/^\d{6}$/.test(formData.pincode.trim())) nextErrors.pincode = 'Enter a valid 6-digit PIN code.'

    return nextErrors
  }

  const buildOrder = () => ({
    id: `ANY-${Date.now().toString(36).toUpperCase()}`,
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      variant: item.variant,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    customer: {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.replace(/\D/g, ''),
    },
    address: {
      street: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zip: formData.pincode.trim(),
      country: formData.country.trim() || 'India',
    },
    deliveryMethod: formData.deliveryMethod,
    paymentMethod: formData.paymentMethod,
    paymentStatus: isCod ? 'Pay on delivery' : 'Pending payment',
    totals: { subtotal, discount: discountAmount, shipping, grandTotal },
    status: 'Placed',
    createdAt: new Date().toISOString(),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!cart.length) {
      navigate('/shop')
      return
    }

    const nextErrors = validateForm()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsPlacing(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) await saveCheckoutAddress(currentUser, formData)

      const order = buildOrder()
      try {
        const existing = JSON.parse(window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]')
        writeStorage(ORDERS_STORAGE_KEY, [order, ...existing])
      } catch {
        // Ignore local persistence errors; Firestore still receives the order for signed-in users.
      }
      if (currentUser) await saveOrderToFirestore(currentUser, order)

      setPlacedOrder(order)
      onOrderPlaced()
    } catch (error) {
      setSubmitError(
        error?.code === 'permission-denied'
          ? 'We could not place your order because of a permissions issue. Please contact support.'
          : 'Something went wrong while placing your order. Please try again.',
      )
    } finally {
      setIsPlacing(false)
    }
  }

  if (placedOrder) {
    return (
      <section className={ui.section}>
        <div className={`${ui.card} mx-auto max-w-xl p-6 text-center sm:p-10`}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf7f1] text-[#247b5c]">
            <Check size={28} />
          </span>
          <h1 className={`mt-5 ${ui.h2}`}>Order placed successfully</h1>
          <p className="mt-2 text-sm text-[#71645b]">
            Order ID <strong className="text-[#2c1e19]">{placedOrder.id}</strong>
          </p>

          <div className="mt-6 rounded-2xl bg-[#f8f5e9] p-4 text-left text-sm">
            <div className="flex justify-between py-1.5 text-[#71645b]">
              <span>Payment</span>
              <strong className="text-[#2c1e19]">{placedOrder.paymentMethod}</strong>
            </div>
            <div className="flex justify-between py-1.5 text-[#71645b]">
              <span>Delivery</span>
              <strong className="text-[#2c1e19]">{placedOrder.deliveryMethod}</strong>
            </div>
            <div className="mt-2 flex justify-between border-t border-[#e2d9c5] pt-3 text-base">
              <span className="font-semibold text-[#2c1e19]">
                {placedOrder.paymentMethod === 'Cash on Delivery' ? 'Pay on delivery' : 'Amount'}
              </span>
              <strong className="text-[#2c1e19]">{formatPrice(placedOrder.totals.grandTotal)}</strong>
            </div>
          </div>

          <p className="mt-5 text-sm text-[#71645b]">
            {placedOrder.paymentMethod === 'Cash on Delivery'
              ? `Please keep ${formatPrice(placedOrder.totals.grandTotal)} in cash ready. A confirmation will be sent to ${placedOrder.customer.email}.`
              : `A confirmation will be sent to ${placedOrder.customer.email}.`}
          </p>

          <Link to="/shop" className={`${ui.btnPrimary} mt-7 w-full`}>
            Continue shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  if (!cart.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Add a saree to your bag before checking out."
        actionLabel="Explore sarees"
      />
    )
  }

  return (
    <section className={ui.section}>
      <div className={`${ui.container} grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] lg:gap-8`}>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className={`${ui.card} ${ui.cardPad}`}>
            <StepHeader step="1" title="Customer information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName} className="sm:col-span-2">
                <input className={ui.input} name="fullName" autoComplete="name" value={formData.fullName} onChange={handleChange} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input className={ui.input} name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} />
              </Field>
              <Field label="Mobile number" error={errors.mobile}>
                <input
                  className={ui.input}
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </div>

          <div className={`${ui.card} ${ui.cardPad}`}>
            <StepHeader
              step="2"
              title="Shipping address"
              subtitle={
                firebaseUser
                  ? 'This address will be saved to your account.'
                  : 'Sign in to save this address to your account. Guest checkout is still available.'
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="House / flat number, street" error={errors.address} className="sm:col-span-2">
                <input className={ui.input} name="address" autoComplete="street-address" value={formData.address} onChange={handleChange} />
              </Field>
              <Field label="City" error={errors.city}>
                <input className={ui.input} name="city" autoComplete="address-level2" value={formData.city} onChange={handleChange} />
              </Field>
              <Field label="State" error={errors.state}>
                <input className={ui.input} name="state" autoComplete="address-level1" value={formData.state} onChange={handleChange} />
              </Field>
              <Field label="PIN code" error={errors.pincode}>
                <input
                  className={ui.input}
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Country">
                <input className={ui.input} name="country" value={formData.country} onChange={handleChange} />
              </Field>
            </div>
          </div>

          <div className={`${ui.card} ${ui.cardPad}`}>
            <StepHeader step="3" title="Delivery method" />
            <div className="grid gap-3 sm:grid-cols-2">
              {DELIVERY_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="deliveryMethod"
                  value={option.value}
                  description={option.description}
                  checked={formData.deliveryMethod === option.value}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          <div className={`${ui.card} ${ui.cardPad}`}>
            <StepHeader step="4" title="Payment method" />
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="paymentMethod"
                  value={option.value}
                  description={option.description}
                  checked={formData.paymentMethod === option.value}
                  onChange={handleChange}
                />
              ))}
            </div>
            {isCod && (
              <p className="mt-4 rounded-xl bg-[#fbf6ea] p-3 text-sm text-[#493b32]">
                Pay {formatPrice(grandTotal)} in cash when your order is delivered. Please keep the exact amount ready.
              </p>
            )}
          </div>

          {submitError && (
            <p role="alert" className={ui.alertError}>
              {submitError}
            </p>
          )}

          <button type="submit" disabled={isPlacing} className={`${ui.btnPrimary} w-full py-3.5`}>
            {isPlacing
              ? 'Placing order…'
              : `${isCod ? 'Place COD order' : 'Place order'} · ${formatPrice(grandTotal)}`}
          </button>
        </form>

        <aside className={`${ui.card} ${ui.cardPad} h-fit lg:sticky lg:top-28`}>
          <h2 className={ui.h3}>Order summary</h2>

          <ul className="mt-4 space-y-4 border-b border-[#e2d9c5] pb-4">
            {cart.map((item) => (
              <li key={`${item.id}-${item.variant}`} className="flex gap-3">
                <ImageWithFallback src={item.image} alt={item.name} className="h-16 w-14 shrink-0 rounded-lg object-cover" />
                <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-[#2c1e19]">{item.name}</p>
                    <p className="mt-0.5 text-xs text-[#817970]">
                      {item.variant} · Qty {item.quantity}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm text-[#2c1e19]">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              </li>
            ))}
          </ul>

          <dl className="space-y-2.5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Subtotal</dt>
              <dd className="text-[#2c1e19]">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Discount (12%)</dt>
              <dd className="text-[#247b5c]">−{formatPrice(discountAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#71645b]">Shipping</dt>
              <dd className="text-[#2c1e19]">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
          </dl>

          <div className="flex items-center justify-between border-t border-[#e2d9c5] pt-4">
            <span className="font-semibold text-[#2c1e19]">Grand total</span>
            <strong className="text-xl text-[#2c1e19]">{formatPrice(grandTotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Account                                                            */
/* ------------------------------------------------------------------ */

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.97 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  )
}

function AccountPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser)
        setAuthLoading(false)
        setErrorMessage('')

        if (currentUser) {
          try {
            await saveUserProfile(currentUser)
          } catch (error) {
            setErrorMessage(
              error?.code === 'permission-denied'
                ? 'You are signed in, but Firestore rules blocked saving your profile.'
                : 'You are signed in, but your profile could not be saved. Please try again.',
            )
          }
        }
      },
      (error) => {
        setErrorMessage(getAuthErrorMessage(error))
        setAuthLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrorMessage('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (activeTab === 'login') {
        await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password)
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password,
        )
        if (formData.fullName.trim()) {
          await updateProfile(credential.user, { displayName: formData.fullName.trim() })
        }
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await signOut(auth)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const perks = [
    'Wishlist saved for future picks',
    'Order history and delivery tracking',
    'Saved addresses and secure checkout',
    'Easy returns and support requests',
  ]

  return (
    <section className={ui.section}>
      <div className={`${ui.container} grid gap-6 lg:grid-cols-2`}>
        <div className={`${ui.card} ${ui.cardPad} sm:p-8`}>
          {authLoading ? (
            <p role="status" className={ui.body}>Checking your account…</p>
          ) : user ? (
            <div className="space-y-4">
              <span className={ui.eyebrow}>Signed in</span>
              <h1 className={ui.h2}>
                Welcome, {user.displayName || user.email?.split('@')[0] || 'Customer'}
              </h1>
              <p className={ui.body}>{user.email}</p>
              {errorMessage && <p role="alert" className={ui.alertError}>{errorMessage}</p>}
              <button type="button" onClick={handleSignOut} disabled={isSubmitting} className={ui.btnSecondary}>
                {isSubmitting ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          ) : (
            <>
              <div role="tablist" className="mb-6 flex gap-1 border-b border-[#e2d9c5]">
                {[
                  { id: 'login', label: 'Login' },
                  { id: 'signup', label: 'Sign up' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'border-[#b88a3e] text-[#2c1e19]'
                        : 'border-transparent text-[#817970] hover:text-[#2c1e19]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {errorMessage && <p role="alert" className={`mb-4 ${ui.alertError}`}>{errorMessage}</p>}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className={`${ui.btnSecondary} w-full`}
              >
                <GoogleIcon />
                {isSubmitting ? 'Please wait…' : 'Continue with Google'}
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-[#817970]">
                <span className="h-px flex-1 bg-[#e2d9c5]" />
                or continue with email
                <span className="h-px flex-1 bg-[#e2d9c5]" />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {activeTab === 'signup' && (
                  <Field label="Full name">
                    <input
                      className={ui.input}
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </Field>
                )}
                <Field label="Email">
                  <input
                    className={ui.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </Field>
                <Field label="Password">
                  <input
                    className={ui.input}
                    name="password"
                    type="password"
                    autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                  />
                </Field>
                <button type="submit" disabled={isSubmitting} className={`${ui.btnPrimary} w-full`}>
                  {isSubmitting
                    ? 'Please wait…'
                    : activeTab === 'login'
                      ? 'Login'
                      : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-[#efe7d5] p-6 sm:p-8">
          <span className={ui.eyebrow}>Customer access</span>
          <h2 className={`mt-2 ${ui.h2}`}>Everything you need after purchase</h2>
          <ul className="mt-6 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-[#493b32]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c1e19] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Admin                                                              */
/* ------------------------------------------------------------------ */

const DEFAULT_IMAGE_LIST = FALLBACK_IMAGE
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim()

const EMPTY_PRODUCT_FORM = {
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
  images: DEFAULT_IMAGE_LIST,
}

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

const uploadProductImage = async (file) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Check the Cloudinary values in .env and restart the app.')
  }

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body },
  )
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || 'Cloudinary could not upload this image.')
  }
  if (!result.secure_url) {
    throw new Error('Cloudinary did not return a secure image URL.')
  }

  return result.secure_url
}

function normalizeProduct(raw) {
  const colors = splitList(raw.colors)
  const images = splitList(raw.images)
  const colorList = colors.length ? colors : [raw.color || 'Classic'].filter(Boolean)

  return {
    ...raw,
    id: raw.id || raw.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: Number(raw.price) || 0,
    discountedPrice: Number(raw.discountedPrice) || Number(raw.price) || 0,
    discount: Number(raw.discount) || 0,
    stock: Number(raw.stock) || 0,
    rating: Number(raw.rating) || 0,
    reviews: Number(raw.reviews) || 0,
    colors: colorList,
    images: images.length ? images : [FALLBACK_IMAGE],
    color: raw.color || colorList[0] || 'Classic',
  }
}

function AdminPage({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  const resetForm = () => {
    setForm(EMPTY_PRODUCT_FORM)
    setEditingId(null)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleImageUpload = async (event) => {
    const input = event.currentTarget
    const files = Array.from(input.files || [])
    if (!files.length) return

    setImageUploadError('')
    setIsUploadingImages(true)
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file.`)
        }

        const imageUrl = await uploadProductImage(file)
        setForm((current) => ({
          ...current,
          images: [...splitList(current.images), imageUrl].join(', '),
        }))
      }
    } catch (error) {
      setImageUploadError(
        error instanceof Error ? error.message : 'Image upload failed. Please try again.',
      )
    } finally {
      setIsUploadingImages(false)
      input.value = ''
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalized = normalizeProduct(form)

    if (editingId) onUpdateProduct(editingId, normalized)
    else onAddProduct(normalized)

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

  const totalStock = products.reduce((sum, item) => sum + item.stock, 0)
  const avgRating = (products.reduce((sum, item) => sum + item.rating, 0) / (products.length || 1)).toFixed(1)

  const metrics = [
    { label: 'Total products', value: products.length },
    { label: 'Units in stock', value: totalStock },
    { label: 'Avg rating', value: avgRating },
    { label: 'Featured', value: products[0]?.name?.split(' ')[0] || 'New' },
  ]

  const fields = [
    { name: 'name', label: 'Product name', placeholder: 'Royal silk saree', span: 'full' },
    { name: 'category', label: 'Category' },
    { name: 'fabric', label: 'Fabric' },
    { name: 'occasion', label: 'Occasion' },
    { name: 'price', label: 'MRP', type: 'number' },
    { name: 'discountedPrice', label: 'Selling price', type: 'number' },
    { name: 'discount', label: 'Discount %', type: 'number' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'rating', label: 'Rating', type: 'number', step: '0.1' },
    { name: 'reviews', label: 'Reviews', type: 'number' },
    { name: 'colors', label: 'Colors (comma separated)', span: 'full' },
    { name: 'color', label: 'Primary color' },
    { name: 'material', label: 'Material' },
    { name: 'length', label: 'Length' },
    { name: 'blouse', label: 'Blouse' },
    { name: 'images', label: 'Image URLs (comma separated)', span: 'full', textarea: true, rows: 3 },
    { name: 'description', label: 'Description', span: 'full', textarea: true, rows: 4 },
    { name: 'care', label: 'Care instructions', span: 'full' },
  ]

  return (
    <section className={ui.section}>
      <div className={`${ui.container} space-y-6`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className={ui.eyebrow}>Admin dashboard</span>
            <h1 className={`mt-2 ${ui.h2}`}>Inventory</h1>
          </div>
          <button type="button" onClick={resetForm} disabled={isUploadingImages} className={ui.btnSecondary}>
            Reset form
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className={`${ui.card} p-4`}>
              <span className="text-xs text-[#817970]">{metric.label}</span>
              <strong className="mt-1 block text-2xl font-semibold text-[#2c1e19]">{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
          <div className={`${ui.card} ${ui.cardPad}`}>
            <h2 className={ui.h3}>{editingId ? 'Edit product' : 'Add new product'}</h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              {fields.map((field) => {
                const spanClass = field.span === 'full' ? 'sm:col-span-2' : ''
                const common = {
                  id: field.name,
                  name: field.name,
                  value: form[field.name],
                  onChange: handleInputChange,
                  required: true,
                  className: ui.input,
                }
                return (
                  <Field key={field.name} label={field.label} className={spanClass}>
                    {field.name === 'images' ? (
                      <>
                        <textarea {...common} rows={field.rows} />
                        <label className={`${ui.btnSecondary} mt-3 w-fit cursor-pointer`}>
                          {isUploadingImages ? 'Uploading images…' : 'Upload images to Cloudinary'}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isUploadingImages}
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-2 text-xs text-[#817970]">
                          Uploaded image URLs will be added above. Save the product to keep them.
                        </p>
                        {imageUploadError && (
                          <p role="alert" className={`mt-2 ${ui.alertError}`}>{imageUploadError}</p>
                        )}
                      </>
                    ) : field.textarea ? (
                      <textarea {...common} rows={field.rows} />
                    ) : (
                      <input {...common} type={field.type || 'text'} step={field.step} placeholder={field.placeholder} />
                    )}
                  </Field>
                )
              })}

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button type="submit" disabled={isUploadingImages} className={ui.btnPrimary}>
                  {isUploadingImages
                    ? 'Uploading images…'
                    : editingId
                      ? 'Update product'
                      : 'Add product'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className={ui.btnSecondary}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className={`${ui.card} ${ui.cardPad}`}>
            <h2 className={ui.h3}>Current inventory</h2>
            <ul className="mt-4 space-y-3">
              {products.map((product) => (
                <li key={product.id} className="rounded-xl border border-[#e2d9c5] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm text-[#2c1e19]">{product.name}</strong>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[#817970]">
                        <span>{product.category}</span>
                        <span>{product.stock} in stock</span>
                      </div>
                    </div>
                    <span className={ui.badge}>{formatPrice(product.discountedPrice)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(product)} className={ui.btnGhost}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#493b32] transition hover:bg-[#f3e7e5] hover:text-[#a23b36]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 404                                                                */
/* ------------------------------------------------------------------ */

function NotFound() {
  return (
    <EmptyState
      icon={Search}
      title="Nothing found here"
      description="The page you are looking for is unavailable."
      actionLabel="Explore sarees"
    />
  )
}

export default App