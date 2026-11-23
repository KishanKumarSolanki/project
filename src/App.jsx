import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import Footer from './components/Footer'
import Header from './components/Header'
import ProductDetail from './components/ProductDetail'
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
import StorySection from './components/home/StorySection'
import TestimonialsSection from './components/home/TestimonialsSection'
import { formatPrice } from './utils/formatPrice'

const AdminPage = lazy(() => import('./components/admin/AdminPage'))

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const CART_STORAGE_KEY = 'sareeCart'
const WISHLIST_STORAGE_KEY = 'sareeWishlist'
const ORDERS_STORAGE_KEY = 'ananyaOrders'
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

const getAuthErrorMessage = (error) =>
  AUTH_ERROR_MESSAGES[error?.code] || 'Unable to authenticate. Please try again.'

const wasCreatedInAdmin = (data) => Boolean(data.createdAt && data.updatedAt)

const normalizeFirestoreProduct = (snapshot) => {
  const data = snapshot.data()
  const normalizeList = (value) =>
    Array.isArray(value)
      ? value.filter((item) => typeof item === 'string' && item.trim())
      : typeof value === 'string'
        ? value.split(',').map((item) => item.trim()).filter(Boolean)
        : []
  const colors = normalizeList(data.colors)
  const images = normalizeList(data.images)
  const singleImage = data.image || ''

  return {
    ...data,
    id: snapshot.id,
    name: data.name || 'Untitled product',
    category: data.category || 'Uncategorized',
    fabric: data.fabric || data.material || '',
    price: Number(data.price) || 0,
    discountedPrice: Number(data.discountedPrice ?? data.price) || 0,
    discount: Number(data.discount) || 0,
    stock: Number(data.stock) || 0,
    rating: Number(data.rating) || 0,
    reviews: Number(data.reviews) || 0,
    colors: colors.length ? colors : [data.color || 'Classic'],
    showOnStorefront:
      typeof data.showOnStorefront === 'boolean'
        ? data.showOnStorefront
        : typeof data.isActive === 'boolean'
          ? data.isActive
          : wasCreatedInAdmin(data),
    images: images.length
      ? images
      : singleImage
        ? [singleImage]
        : [],
  }
}

const normalizeFirestoreCategory = (snapshot) => {
  const data = snapshot.data()
  return {
    ...data,
    id: snapshot.id,
    name: data.name || data.title || snapshot.id,
    image: data.image || data.imageUrl || '',
    accent: data.accent || data.description || '',
    showOnStorefront:
      typeof data.showOnStorefront === 'boolean'
        ? data.showOnStorefront
        : typeof data.isActive === 'boolean'
          ? data.isActive
          : wasCreatedInAdmin(data),
  }
}

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

function AppFrame({ children, cartCount, wishlistCount }) {
  const { pathname } = useLocation()
  const isAdminPage = pathname === '/admin'

  return (
    <div className={isAdminPage ? 'min-h-screen bg-[#f4f2ed]' : ui.page}>
      {!isAdminPage && <Header cartCount={cartCount} wishlist={wishlistCount} />}
      <main>{children}</main>
      {!isAdminPage && (
        <>
          <Footer />
          <SupportBubble />
          <MobileBottomNav cartCount={cartCount} wishlistCount={wishlistCount} />
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* App shell                                                          */
/* ------------------------------------------------------------------ */

function App() {
  const [cart, setCart] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_STORAGE_KEY, []))
  const [catalog, setCatalog] = useState([])
  const [categories, setCategories] = useState([])
  const [catalogError, setCatalogError] = useState('')
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser)
  const [authReady, setAuthReady] = useState(false)
  const [adminRole, setAdminRole] = useState(auth.currentUser ? 'checking' : 'signed-out')
  const [adminRoleError, setAdminRoleError] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginMode, setLoginMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ fullName: '', email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const openLoginPrompt = useCallback(() => setShowLoginPrompt(true), [])

  useEffect(() => writeStorage(CART_STORAGE_KEY, cart), [cart])
  useEffect(() => writeStorage(WISHLIST_STORAGE_KEY, wishlist), [wishlist])

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setFirebaseUser(currentUser)
    setAuthReady(true)
    setAdminRole(currentUser ? 'checking' : 'signed-out')
    setAdminRoleError('')
    if (currentUser) {
      setShowLoginPrompt(false)
    }
  }), [])

  useEffect(() => {
    let active = true
    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        setCatalog(snapshot.docs.map(normalizeFirestoreProduct))
        setCatalogError('')
      },
      (error) => {
        setCatalogError(`Products could not be loaded from Firebase: ${error.message}`)
      },
    )
    const unsubscribeCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const cloudCategories = snapshot.docs
          .map(normalizeFirestoreCategory)
          .sort((first, second) =>
            (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0),
          )
        if (active) setCategories(cloudCategories)
      },
      (error) => {
        if (active) setCatalogError(`Categories could not be loaded from Firebase: ${error.message}`)
      },
    )

    return () => {
      active = false
      unsubscribeProducts()
      unsubscribeCategories()
    }
  }, [])

  useEffect(() => {
    if (!firebaseUser) return undefined
    return onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (snapshot) => {
        setAdminRole(snapshot.data()?.role === 'admin' ? 'admin' : 'denied')
        setAdminRoleError('')
      },
      (error) => {
        setAdminRole('denied')
        setAdminRoleError(
          error.code === 'permission-denied'
            ? 'Firebase rules blocked your role check. Allow users to read their own profile document.'
            : `Could not verify the administrator role: ${error.message}`,
        )
      },
    )
  }, [firebaseUser])

  useEffect(() => {
    if (!showLoginPrompt) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowLoginPrompt(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLoginPrompt])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddProduct = async (product) => {
    const productRef = doc(collection(db, 'products'))
    await setDoc(productRef, {
      ...product,
      id: productRef.id,
      showOnStorefront: product.showOnStorefront === true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const handleUpdateProduct = async (productId, updatedProduct) =>
    setDoc(
      doc(db, 'products', productId),
      { ...updatedProduct, id: productId, updatedAt: serverTimestamp() },
      { merge: true },
    )

  const handleDeleteProduct = async (productId) =>
    deleteDoc(doc(db, 'products', productId))

  const handleAddCategory = async (category) => {
    const trimmedName = category.name.trim()
    const existing = categories.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    )
    if (existing) {
      await setDoc(
        doc(db, 'categories', existing.id),
        {
          showOnStorefront: true,
          updatedAt: serverTimestamp(),
          ...(category.image ? { image: category.image } : {}),
          ...(category.accent ? { accent: category.accent } : {}),
        },
        { merge: true },
      )
      return
    }
    const categoryRef = doc(collection(db, 'categories'))
    await setDoc(categoryRef, {
      ...category,
      name: trimmedName,
      id: categoryRef.id,
      showOnStorefront: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const handleUpdateCategory = async (categoryId, updatedCategory) => {
    const nextName = updatedCategory.name.trim()
    const duplicateCategory = categories.find(
      (item) =>
        item.id !== categoryId &&
        item.name.trim().toLowerCase() === nextName.toLowerCase(),
    )

    const previousCategory = categories.find((item) => item.id === categoryId)
    const previousName = previousCategory?.name?.trim()

    if (duplicateCategory) {
      await setDoc(
        doc(db, 'categories', duplicateCategory.id),
        {
          name: duplicateCategory.name,
          showOnStorefront: true,
          image: duplicateCategory.image || updatedCategory.image || '',
          accent: duplicateCategory.accent || updatedCategory.accent || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      await deleteDoc(doc(db, 'categories', categoryId))

      if (previousName && previousName !== duplicateCategory.name) {
        await Promise.all(
          catalog
            .filter((product) => product.category === previousName)
            .map((product) =>
              setDoc(
                doc(db, 'products', product.id),
                { category: duplicateCategory.name, updatedAt: serverTimestamp() },
                { merge: true },
              ),
            ),
        )
      }
      return
    }

    await setDoc(
      doc(db, 'categories', categoryId),
      { ...updatedCategory, id: categoryId, name: nextName, updatedAt: serverTimestamp() },
      { merge: true },
    )

    if (previousName && previousName !== nextName) {
      await Promise.all(
        catalog
          .filter((product) => product.category === previousName)
          .map((product) =>
            setDoc(
              doc(db, 'products', product.id),
              { category: nextName, updatedAt: serverTimestamp() },
              { merge: true },
            ),
          ),
      )
    }
  }

  const handleDeleteCategory = async (categoryId) =>
    deleteDoc(doc(db, 'categories', categoryId))

  const handleSetCategoryVisibility = async (categoryId, showOnStorefront) =>
    setDoc(doc(db, 'categories', categoryId), { showOnStorefront }, { merge: true })

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setAdminRoleError(`Could not sign out: ${getAuthErrorMessage(error)}`)
    }
  }

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
  const storefrontProducts = catalog.filter((product) => product.showOnStorefront)
  const storefrontCategories = categories.filter((category) => category.showOnStorefront)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppFrame cartCount={cartCount} wishlistCount={wishlist.length}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  products={storefrontProducts}
                  categories={storefrontCategories}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopPage
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  products={storefrontProducts}
                  categories={storefrontCategories}
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
                  products={storefrontProducts}
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
                  products={storefrontProducts.filter((product) => wishlist.includes(product.id))}
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
                <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f4f2ed] text-sm text-[#81796e]">Opening admin workspace…</div>}>
                  <AdminPage
                    user={firebaseUser}
                    authReady={authReady}
                    adminRole={adminRole}
                    adminRoleError={adminRoleError}
                    products={catalog}
                    categories={categories}
                    catalogError={catalogError}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onAddCategory={handleAddCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onSetCategoryVisibility={handleSetCategoryVisibility}
                    onSignOut={handleAdminSignOut}
                  />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
      </AppFrame>
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

function HomePage({ addToCart, toggleWishlist, wishlist, products, categories }) {
  const bestSellers = products.slice(0, 4)
  const featuredProducts = products.slice(4, 8)

  return (
    <>
      <HeroSection />
      {categories.length > 0 && <CategorySection categories={categories} />}
      {bestSellers.length > 0 && (
        <BestSellersSection
          bestSellers={bestSellers}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}
      {featuredProducts.length > 0 && (
        <NewArrivalsSection
          featuredProducts={featuredProducts}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}
      <BenefitsSection />
      <StorySection />
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

function ShopPage({ toggleWishlist, wishlist, products, categories }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || 'All'
  const maxPrice = Number(searchParams.get('maxPrice')) || 7000
  const availableShopTabs = useMemo(() => {
    return [
      { name: 'All', category: 'All', productCategory: 'All' },
      ...categories.map((category) => ({
        name: category.name.replace(/ Sarees$/, ''),
        category: category.name,
        productCategory: category.name,
      })),
    ]
  }, [categories])
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
    const tab = availableShopTabs.find((item) => item.category === selectedCategory)
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
  }, [products, search, selectedCategory, maxPrice, sortBy, availableShopTabs])

  return (
    <ShopPageContent
      filteredProducts={filteredProducts}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
      shopTabs={availableShopTabs}
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
  const navigate = useNavigate()
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
            const profileSnapshot = await getDoc(doc(db, 'users', currentUser.uid))
            if (profileSnapshot.data()?.role === 'admin') {
              navigate('/admin', { replace: true })
              return
            }
            await saveUserProfile(currentUser)
          } catch (error) {
            setErrorMessage(
              error?.code === 'permission-denied'
                ? 'You are signed in, but Firestore rules blocked checking your account role or saving your profile.'
                : 'You are signed in, but your account could not be verified. Please try again.',
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
  }, [navigate])

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