import { useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../../assets/dori-taaga-logo.png'
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  Eye,
  EyeOff,
  Gem,
  Home,
  ImagePlus,
  Layers,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  Ruler,
  Scissors,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Video,
  Wallet,
  X,
  FolderPlus,
  Palette,
  Link2,
} from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../ImageWithFallback'
import WhatsAppDashboard from './WhatsAppDashboard'
import { auth } from '../../firebase'
import { formatPrice } from '../../utils/formatPrice'
import { isAllowedImageUrl } from '../../utils/imageUrl'
import { isValidInstagramUrl } from '../../utils/instagram'

const EMPTY_PRODUCT = {
  name: '',
  category: '',
  fabric: '',
  price: '',
  discountedPrice: '',
  discount: '0',
  stock: '0',
  rating: '0',
  reviews: '0',
  showOnStorefront: true,
  badge: 'New',
  color: '',
  colors: '',
  occasion: '',
  material: '',
  length: '',
  blouse: '',
  weave: '',
  zari: '',
  sareeColour: '',
  blouseColour: '',
  craft: '',
  fallPico: '',
  fallPicoAvailable: false,
  fallPicoPrice: '',
  blouseStitchingAvailable: false,
  plainBlousePrice: '',
  paddedBlousePrice: '',
  blouseStitchingNote: 'For blouse stitching, please share your measurements and confirm your size with our team via WhatsApp.',
  care: '',
  description: '',
  instagramUrl: '',
  images: [],
}

const EMPTY_CATEGORY = { name: '', accent: '', image: '' }

const inputClass =
  'w-full rounded-xl border border-[#e4dccd] bg-[#fffdf9] px-3.5 py-3 text-sm text-[#241f18] outline-none transition duration-200 placeholder:text-[#b3aa9b] hover:border-[#d2c6b0] focus:border-[#b8893f] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,137,63,0.12)]'
const labelClass = 'mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a7060]'
const cardClass =
  'rounded-[22px] border border-[#ece5d8] bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_12px_40px_-18px_rgba(43,37,30,0.18)]'
const primaryBtn =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#3a3026] to-[#221c15] px-5 text-sm font-semibold text-[#f6efe2] shadow-[0_8px_20px_-8px_rgba(34,28,21,0.6)] transition duration-200 hover:-translate-y-px hover:shadow-[0_12px_26px_-8px_rgba(34,28,21,0.65)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60'
const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#e4dccd] bg-white px-3.5 text-xs font-semibold text-[#5b5245] transition duration-200 hover:border-[#cdbfa6] hover:bg-[#fbf8f2]'

const messageForError = (error) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function Field({ label, icon: Icon, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>
        {Icon && <Icon size={13} className="text-[#b8893f]" />}
        {label}
      </span>
      {children}
    </label>
  )
}

function Badge({ tone = 'neutral', icon: Icon, children }) {
  const tones = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    neutral: 'bg-[#f5f1e9] text-[#7a7060] ring-[#e4dccd]',
    warning: 'bg-amber-50 text-amber-800 ring-amber-600/15',
    danger: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${tones[tone]}`}>
      {Icon && <Icon size={11} />}
      {children}
    </span>
  )
}

function StatCard({ label, value, Icon, hint }) {
  return (
    <div className={`${cardClass} group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5`}>
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#f3e7cf] to-transparent opacity-70 transition group-hover:scale-110" />
      <div className="relative flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#241f18] text-[#d9b374] shadow-inner">
          <Icon size={18} strokeWidth={1.8} />
        </span>
        {hint && <span className="text-[11px] font-medium text-[#9a8f7e]">{hint}</span>}
      </div>
      <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8c8172]">{label}</p>
      <p className="relative mt-1 font-serif text-3xl tracking-tight text-[#241f18]">{value}</p>
    </div>
  )
}

function Modal({ open, onClose, children, label, wide = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div
        className="absolute inset-0 bg-[#1f1a14]/45 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={`relative max-h-[92vh] w-full ${wide ? 'max-w-3xl' : 'max-w-lg'
          } overflow-y-auto rounded-[26px] border border-[#ece5d8] bg-white p-6 shadow-[0_40px_120px_-30px_rgba(43,37,30,0.5)] sm:p-8 animate-[popIn_0.25s_ease-out]`}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: translateY(12px) scale(0.98) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  )
}

function SignInScreen({ authReady, adminRole, adminRoleError, user, onSignOut }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (signInError) {
      setError(messageForError(signInError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#efe9dd] px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#e2cfa6]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#b8893f]/15 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_40px_120px_-30px_rgba(43,37,30,0.35)] ring-1 ring-black/5 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[#1f1a14] p-11 text-white md:flex">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,179,116,0.22),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(217,179,116,0.12),transparent_40%)]" />
          <div className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-8 h-56 w-56 rounded-full border border-white/10" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/30">
              <img src={logo} alt="Doritaaga logo" className="h-full w-full object-contain p-1" />
            </span>
            <div>
              <p className="font-serif text-lg tracking-wide">Doritaaga</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Atelier administration</p>
            </div>
          </div>

          <div className="relative max-w-sm">
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b374]/40 text-[#d9b374]">
              <ShieldCheck size={22} strokeWidth={1.6} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9b374]">Private workspace</p>
            <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.1]">A considered space to run your boutique.</h1>
            <p className="mt-5 text-sm leading-7 text-white/60">
              Curate your collection, shape your categories and keep every listing exquisite — from one secure place.
            </p>
          </div>

          <p className="relative flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Sparkles size={13} /> Authorized administrators only
          </p>
        </div>

        <div className="flex min-h-[600px] flex-col justify-center p-7 sm:p-12">
          <div className="mb-9 flex items-center gap-3 md:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f1a14] text-[#d9b374]">
              <Gem size={20} />
            </span>
            <div>
              <p className="font-serif text-lg text-[#241f18]">Doritaaga</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#8c8172]">Admin workspace</p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f6efe0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#96713b]">
            <Sparkles size={11} /> Admin sign in
          </span>
          <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#241f18]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-[#8c8172]">Sign in with the email account assigned the admin role.</p>

          {!authReady && (
            <p role="status" className="mt-6 flex items-center gap-2 rounded-xl bg-[#f6f1e7] p-3.5 text-sm text-[#6e6558]">
              <LoaderCircle size={16} className="animate-spin text-[#b8893f]" /> Checking your sign-in…
            </p>
          )}
          {adminRoleError && (
            <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" /> {adminRoleError}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}
          {adminRole === 'denied' && (
            <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0" /> This account is signed in but does not have the admin role.
            </p>
          )}
          {user && (adminRole === 'denied' || adminRoleError) && (
            <button type="button" onClick={onSignOut} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#6e6558] transition hover:text-[#241f18]">
              <LogOut size={15} /> Sign out of this account
            </button>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Email address" icon={Link2}>
              <input className={inputClass} type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" required />
            </Field>
            <Field label="Password" icon={ShieldCheck}>
              <div className="relative">
                <input
                  className={`${inputClass} pr-11`}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#9a8f7e] transition hover:bg-[#f6f1e7] hover:text-[#241f18]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <button type="submit" disabled={isSubmitting} className={`${primaryBtn} w-full`}>
              {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowUpRight size={17} />}
              {isSubmitting ? 'Signing in…' : 'Sign in to admin'}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] leading-5 text-[#a39a8a]">
            Access is verified against the <code className="rounded bg-[#f6f1e7] px-1.5 py-0.5 text-[#7a6337]">users/{'{uid}'}</code> role in Firebase.
          </p>
        </div>
      </div>
    </div>
  )
}

function AdminPage({
  user,
  authReady,
  adminRole,
  adminRoleError,
  products,
  categories,
  catalogError,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSetCategoryVisibility,
  onSignOut,
}) {
  const [activeSection, setActiveSection] = useState('products')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [inlineCategoryName, setInlineCategoryName] = useState('')
  const [showInlineCategoryCreator, setShowInlineCategoryCreator] = useState(false)
  const [inlineCategoryEditId, setInlineCategoryEditId] = useState(null)
  const [inlineCategoryEditName, setInlineCategoryEditName] = useState('')
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showDetails, setShowDetails] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query
      ? products.filter((product) =>
        [product.name, product.category, product.fabric].some((value) =>
          String(value || '').toLowerCase().includes(query),
        ),
      )
      : products
  }, [products, search])

  const totalStock = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0)
  const lowStock = products.filter((product) => Number(product.stock) < 5).length
  const visibleProducts = products.filter((product) => product.showOnStorefront).length

  const anyModalOpen = isFormOpen || isCategoryFormOpen || Boolean(deleteTarget)

  useEffect(() => {
    if (!anyModalOpen) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false)
        setIsCategoryFormOpen(false)
        if (!isDeleting) setDeleteTarget(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [anyModalOpen, isDeleting])

  if (!user || adminRole === 'signed-out' || adminRole === 'denied' || adminRoleError) {
    return (
      <SignInScreen
        authReady={authReady}
        adminRole={adminRole}
        adminRoleError={adminRoleError}
        user={user}
        onSignOut={onSignOut}
      />
    )
  }

  if (adminRole !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#efe9dd] px-4">
        <div className={`${cardClass} w-full max-w-md p-10 text-center`}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#241f18] text-[#d9b374]">
            <LoaderCircle className="animate-spin" size={24} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-[#241f18]">Verifying administrator access</h1>
          <p className="mt-2 text-sm text-[#8c8172]">Checking your Firebase account role…</p>
        </div>
      </div>
    )
  }

  const resetProductForm = () => {
    setForm(EMPTY_PRODUCT)
    setImageUrlInput('')
    setInlineCategoryEditId(null)
    setInlineCategoryEditName('')
    setShowInlineCategoryCreator(false)
    setInlineCategoryName('')
    setEditingId(null)
    setError('')
    setNotice('')
  }

  const handleOpenAddProduct = () => {
    resetProductForm()
    setActiveSection('products')
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    resetProductForm()
    setIsFormOpen(false)
  }

  const resetCategoryForm = () => {
    setCategoryForm(EMPTY_CATEGORY)
    setEditingCategoryId(null)
    setError('')
    setNotice('')
  }

  const handleOpenAddCategory = () => {
    resetCategoryForm()
    setIsCategoryFormOpen(true)
  }

  const handleCloseCategoryForm = () => {
    resetCategoryForm()
    setIsCategoryFormOpen(false)
  }

  const handleAddImageUrls = () => {
    setError('')
    setNotice('')
    const urls = imageUrlInput.split(/\r?\n/).map((url) => url.trim()).filter(Boolean)

    if (!urls.length) {
      const msg = 'Paste at least one image URL.'
      setError(msg)
      toast.error(msg)
      return
    }

    const invalidUrl = urls.find((url) => !isAllowedImageUrl(url))

    if (invalidUrl) {
      const msg = 'Each image URL must be a valid public HTTPS URL.'
      setError(msg)
      toast.error(msg)
      return
    }

    setForm((current) => ({
      ...current,
      images: [...new Set([...current.images, ...urls])],
    }))
    setImageUrlInput('')
    const msg = `${urls.length} image ${urls.length === 1 ? 'URL added' : 'URLs added'}.`
    setNotice(msg)
    toast.success(msg)
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!form.images.length) {
      const msg = 'Add at least one HTTPS image URL before saving.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (!isValidInstagramUrl(form.instagramUrl)) {
      const msg = 'Enter a valid Instagram Reel or Post URL (e.g. https://www.instagram.com/reel/...).'
      setError(msg)
      toast.error(msg)
      return
    }

    setIsSaving(true)
    const price = Number(form.price)
    const discountedPrice = Number(form.discountedPrice)
    const colors = form.colors.split(',').map((color) => color.trim()).filter(Boolean)
    const product = {
      ...form,
      price,
      discountedPrice,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      plainBlousePrice: form.plainBlousePrice === '' ? null : Number(form.plainBlousePrice),
      paddedBlousePrice: form.paddedBlousePrice === '' ? null : Number(form.paddedBlousePrice),
      fallPicoPrice: form.fallPicoPrice === '' ? null : Number(form.fallPicoPrice),
      fallPico: form.fallPico?.trim() || '',
      fallPicoAvailable: form.fallPicoAvailable === true,
      instagramUrl: form.instagramUrl?.trim() || '',
      colors: colors.length ? colors : [form.color || 'Classic'],
      color: form.color || colors[0] || 'Classic',
      images: form.images,
    }

    const notifySuccess = (message) => {
      setNotice(message)
      toast.success(message)
    }

    const notifyError = (message) => {
      setError(message)
      toast.error(message)
    }

    try {
      if (editingId) {
        await onUpdateProduct(editingId, product)
        notifySuccess('Product updated.')
      } else {
        await onAddProduct(product)
        notifySuccess('Product added to your store.')
      }
      setForm(EMPTY_PRODUCT)
      setImageUrlInput('')
      setEditingId(null)
      setIsFormOpen(false)
    } catch (saveError) {
      notifyError(messageForError(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleInlineCategoryCreate = async () => {
    const name = inlineCategoryName.trim()
    if (!name) {
      setError('Enter a category name.')
      toast.error('Enter a category name.')
      return
    }

    setError('')
    setNotice('')
    setIsSaving(true)
    try {
      await onAddCategory({ name, accent: '', image: '' })
      setForm((current) => ({ ...current, category: name }))
      setInlineCategoryName('')
      setShowInlineCategoryCreator(false)
      const msg = `Category "${name}" created and selected.`
      setNotice(msg)
      toast.success(msg)
    } catch (saveError) {
      const msg = messageForError(saveError)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartInlineCategoryEdit = () => {
    const category = categories.find((item) => item.name === form.category)
    if (!category) return
    setInlineCategoryEditId(category.id)
    setInlineCategoryEditName(category.name)
    setShowInlineCategoryCreator(false)
    setError('')
    setNotice('')
  }

  const handleInlineCategoryUpdate = async () => {
    const category = categories.find((item) => item.id === inlineCategoryEditId)
    const name = inlineCategoryEditName.trim()
    if (!category) return
    if (!name) {
      setError('Enter a category name.')
      toast.error('Enter a category name.')
      return
    }

    setError('')
    setNotice('')
    setIsSaving(true)
    try {
      await onUpdateCategory(category.id, { ...category, name })
      const matchingCategory = categories.find(
        (item) => item.name.trim().toLowerCase() === name.toLowerCase(),
      )
      const selectedName = matchingCategory?.name || name
      setForm((current) => ({ ...current, category: selectedName }))
      setInlineCategoryEditId(null)
      setInlineCategoryEditName('')
      const msg = `Category updated to "${selectedName}".`
      setNotice(msg)
      toast.success(msg)
    } catch (saveError) {
      const msg = messageForError(saveError)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProduct = (product) => {
    setForm({
      ...EMPTY_PRODUCT,
      ...product,
      price: String(product.price ?? ''),
      discountedPrice: String(product.discountedPrice ?? product.price ?? ''),
      discount: String(product.discount ?? 0),
      stock: String(product.stock ?? 0),
      rating: String(product.rating ?? 0),
      reviews: String(product.reviews ?? 0),
      plainBlousePrice: product.plainBlousePrice == null ? '' : String(product.plainBlousePrice),
      paddedBlousePrice: product.paddedBlousePrice == null ? '' : String(product.paddedBlousePrice),
      fallPicoPrice: product.fallPicoPrice == null ? '' : String(product.fallPicoPrice),
      fallPico: product.fallPico ?? '',
      fallPicoAvailable: Boolean(product.fallPicoAvailable),
      instagramUrl: product.instagramUrl ?? '',
      showOnStorefront: product.showOnStorefront === true,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.color || '',
      images: Array.isArray(product.images) ? product.images : [],
    })
    setEditingId(product.id)
    setImageUrlInput('')
    setInlineCategoryEditId(null)
    setInlineCategoryEditName('')
    setShowInlineCategoryCreator(false)
    setActiveSection('products')
    setIsFormOpen(true)
    setError('')
    setNotice('')
  }

  const handleDeleteProduct = (product) => {
    setDeleteTarget({ type: 'product', item: product })
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (categoryForm.image && !isAllowedImageUrl(categoryForm.image)) {
      const msg = 'Enter a valid public HTTPS category image URL.'
      setError(msg)
      toast.error(msg)
      return
    }
    setIsSaving(true)
    try {
      if (editingCategoryId) {
        await onUpdateCategory(editingCategoryId, categoryForm)
        setNotice('Category updated.')
        toast.success('Category updated.')
      } else {
        await onAddCategory(categoryForm)
        setNotice('Category added and saved to Firebase.')
        toast.success('Category added and saved to Firebase.')
      }
      setCategoryForm(EMPTY_CATEGORY)
      setEditingCategoryId(null)
      setIsCategoryFormOpen(false)
    } catch (saveError) {
      const msg = messageForError(saveError)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCategory = (category) => {
    setCategoryForm({
      ...EMPTY_CATEGORY,
      ...category,
      image: category.image || '',
    })
    setEditingCategoryId(category.id)
    setIsCategoryFormOpen(true)
    setError('')
    setNotice('')
  }

  const handleDeleteCategory = (category) => {
    setDeleteTarget({ type: 'category', item: category })
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setError('')
    setNotice('')
    setIsDeleting(true)
    try {
      if (deleteTarget.type === 'product') {
        await onDeleteProduct(deleteTarget.item.id)
        if (editingId === deleteTarget.item.id) handleCloseForm()
        setNotice('Product deleted.')
        toast.success('Product deleted.')
      } else {
        await onDeleteCategory(deleteTarget.item.id)
        if (editingCategoryId === deleteTarget.item.id) handleCloseCategoryForm()
        setNotice('Category deleted.')
        toast.success('Category deleted.')
      }
      setDeleteTarget(null)
    } catch (deleteError) {
      const msg = messageForError(deleteError)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleCategoryVisibility = async (category) => {
    setError('')
    setNotice('')
    try {
      await onSetCategoryVisibility(category.id, !category.showOnStorefront)
      const msg = category.showOnStorefront
        ? 'Category hidden from storefront.'
        : 'Category published to storefront.'
      setNotice(msg)
      toast.success(msg)
    } catch (visibilityError) {
      const msg = messageForError(visibilityError)
      setError(msg)
      toast.error(msg)
    }
  }

  const navItems = [
    { id: 'products', label: 'Products', Icon: Package },
    { id: 'categories', label: 'Categories', Icon: Layers },
    { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  ]

  const navButtonClass = (active) =>
    `group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition duration-200 ${active
      ? 'bg-[#241f18] text-[#f6efe2] shadow-[0_8px_20px_-10px_rgba(36,31,24,0.7)]'
      : 'text-[#7a7060] hover:bg-[#f6f1e7] hover:text-[#241f18]'
    }`

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#241f18]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[264px] flex-col border-r border-[#e8e0cf] bg-[#fffdf9] px-5 py-7 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-[#e8e0cf]">
            <img src={logo} alt="Doritaaga logo" className="h-full w-full object-contain p-1" />
          </span>
          <div>
            <p className="font-serif text-lg tracking-wide">Doritaaga</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#a39a8a]">Atelier admin</p>
          </div>
        </div>

        <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b3aa9b]">Workspace</p>
        <nav className="mt-3 space-y-1.5">
          <button type="button" onClick={handleOpenAddProduct} className={navButtonClass(activeSection === 'products')}>
            <LayoutDashboard size={18} strokeWidth={1.8} /> Overview
          </button>
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setActiveSection(id)} className={navButtonClass(activeSection === id)}>
              <Icon size={18} strokeWidth={1.8} /> {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto overflow-hidden rounded-2xl bg-gradient-to-br from-[#f6efe0] to-[#fbf8f2] p-4 ring-1 ring-[#ebe2cf]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5b4a2f]">
            <ShieldCheck size={16} className="text-[#a87d3d]" /> Admin access
          </div>
          <p className="mt-2 truncate text-xs text-[#8c8172]">{user.email}</p>
          <button type="button" onClick={onSignOut} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#7a7060] transition hover:text-[#241f18]">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div
        className={`flex flex-col lg:pl-[264px] ${
          activeSection === 'whatsapp' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
        }`}
      >
        <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between border-b border-[#e8e0cf] bg-[#fffdf9]/85 px-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a87d3d]">
              <Sparkles size={11} /> Store management
            </p>
            <h1 className="mt-0.5 font-serif text-xl tracking-tight">
              {activeSection === 'categories'
                ? 'Categories'
                : activeSection === 'whatsapp'
                  ? 'WhatsApp'
                  : 'Products'}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/" className={`${ghostBtn} h-10`}>
              <Home size={14} /> <span>Storefront</span>
            </Link>
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 sm:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Connected
            </span>
            <button type="button" onClick={onSignOut} className={`${ghostBtn} h-10 lg:hidden`}>
              <LogOut size={14} /> Sign out
            </button>
            <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3a3026] to-[#221c15] text-xs font-bold text-[#e4c48a] shadow-md sm:inline-flex">
              {user.email?.slice(0, 1).toUpperCase() || 'A'}
            </span>
          </div>
        </header>

        <main
          className={
            activeSection === 'whatsapp'
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-8 sm:py-10'
          }
        >
          <div
            className={`flex gap-2 overflow-x-auto lg:hidden ${
              activeSection === 'whatsapp'
                ? 'border-b border-[#e8e0cf] bg-[#fffdf9] px-4 py-3'
                : 'mb-7'
            }`}
          >
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeSection === id ? 'bg-[#241f18] text-[#f6efe2] shadow-md' : 'border border-[#e4dccd] bg-white text-[#7a7060]'
                  }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {(error || catalogError) && (
            <div role="alert" className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3.5 text-sm text-rose-700">
              <span className="flex items-start gap-2.5">
                <CircleAlert size={17} className="mt-0.5 shrink-0" /> {error || catalogError}
              </span>
              {error && (
                <button type="button" onClick={() => setError('')} aria-label="Dismiss error" className="rounded-md p-0.5 transition hover:bg-rose-100">
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {activeSection === 'whatsapp' ? (
            <WhatsAppDashboard user={user} />
          ) : activeSection === 'products' ? (
            <>
              <section className="mb-8 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-[#8c8172]">
                    <Gem size={14} className="text-[#b8893f]" /> Your products, presented beautifully.
                  </p>
                  <h2 className="mt-1.5 font-serif text-3xl tracking-tight sm:text-4xl">Inventory overview</h2>
                </div>
                <button type="button" onClick={handleOpenAddProduct} className={`${primaryBtn} shrink-0 px-4 sm:px-5`}>
                  <PackagePlus size={17} /> <span>Add product</span>
                </button>
              </section>

              <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard label="Total products" value={products.length} Icon={Boxes} hint={`${visibleProducts} live`} />
                <StatCard label="Units in stock" value={totalStock} Icon={Package} />
                <StatCard label="Categories" value={categories.length} Icon={Shapes} />
                <StatCard label="Low stock" value={lowStock} Icon={Activity} hint={lowStock ? 'Needs attention' : 'All healthy'} />
              </section>

              <section className={`${cardClass} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0e9dc] p-6 sm:p-7">
                  <div>
                    <h3 className="font-serif text-xl">Product catalog</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#a39a8a]">
                      <Boxes size={12} /> {products.length} items in Firebase
                    </p>
                  </div>
                  <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-[#e4dccd] bg-[#fffdf9] px-3.5 text-[#9a8f7e] transition focus-within:border-[#b8893f] focus-within:shadow-[0_0_0_4px_rgba(184,137,63,0.12)] sm:w-56">
                    <Search size={16} />
                    <input className="min-w-0 flex-1 bg-transparent text-sm text-[#241f18] outline-none placeholder:text-[#b3aa9b]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
                  </label>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  {filteredProducts.map((product) => {
                    const isLow = Number(product.stock) < 5
                    return (
                      <article key={product.id} className="group flex gap-4 rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(43,37,30,0.3)]">
                        <div className="h-[84px] w-[66px] shrink-0 overflow-hidden rounded-xl bg-[#f3eee3] ring-1 ring-[#ece5d8]">
                          <ImageWithFallback src={product.images?.[0]} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold">{product.name}</h4>
                              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8c8172]">
                                <Layers size={11} /> {product.category}
                                <span className="text-[#d2c6b0]">•</span>
                                <Boxes size={11} /> {product.stock} in stock
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge tone={product.showOnStorefront ? 'success' : 'neutral'} icon={product.showOnStorefront ? Eye : EyeOff}>
                                  {product.showOnStorefront ? 'Live' : 'Hidden'}
                                </Badge>
                                {isLow && <Badge tone="warning" icon={CircleAlert}>Low stock</Badge>}
                              </div>
                            </div>
                            <span className="shrink-0 font-serif text-base text-[#241f18]">{formatPrice(product.discountedPrice)}</span>
                          </div>
                          <div className="mt-3.5 flex items-center gap-2">
                            <button type="button" onClick={() => handleEditProduct(product)} className={`${ghostBtn} h-8 px-3`}>
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              aria-label={`Delete ${product.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a0857e] transition hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}

                  {!filteredProducts.length && (
                    <div className="px-6 py-16 text-center sm:col-span-2">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6efe0] text-[#b8893f]">
                        <Package size={24} strokeWidth={1.6} />
                      </span>
                      <p className="mt-4 font-serif text-lg">{search ? 'No matching products' : 'Your catalog is ready'}</p>
                      <p className="mt-1 text-xs text-[#8c8172]">{search ? 'Try a different search term.' : 'Click "Add product" to create your first listing.'}</p>
                    </div>
                  )}
                </div>
              </section>

              <Modal open={isFormOpen} onClose={handleCloseForm} label={editingId ? 'Update product' : 'Add a product'} wide>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a87d3d]">
                      {editingId ? <Pencil size={11} /> : <Sparkles size={11} />}
                      {editingId ? 'Edit listing' : 'New listing'}
                    </p>
                    <h3 className="mt-1.5 font-serif text-2xl">{editingId ? 'Update product' : 'Add a product'}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    aria-label="Close form"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e4dccd] bg-white text-[#5b5245] transition hover:bg-[#fbf8f2]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleProductSubmit}>
                  <Field label="Product name" icon={Tag} className="sm:col-span-2">
                    <input
                      className={inputClass}
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="e.g. Handwoven silk saree"
                      required
                      autoFocus
                    />
                  </Field>

                  <Field label="Category" icon={Layers}>
                    <div className="flex gap-2">
                      <div className="relative min-w-0 flex-1">
                        <select className={`${inputClass} appearance-none pr-10`} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
                          <option value="">Choose category</option>
                          {form.category && !categories.some((category) => category.name.trim().toLowerCase() === form.category.trim().toLowerCase() && category.showOnStorefront) && (
                            <option value={form.category}>{form.category}</option>
                          )}
                          {Array.from(
                            new Map(
                              categories
                                .filter((category) => category.showOnStorefront)
                                .map((cat) => [cat.name.trim().toLowerCase(), cat])
                            ).values()
                          ).map((category) => (
                            <option key={category.id || category.name} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a8f7e]" />
                      </div>
                      <button type="button" onClick={() => setShowInlineCategoryCreator((open) => !open)} className={`${ghostBtn} h-12 shrink-0 px-3`}>
                        <FolderPlus size={15} /> New
                      </button>
                      {form.category && categories.some((category) => category.name === form.category) && (
                        <button
                          type="button"
                          onClick={handleStartInlineCategoryEdit}
                          aria-label={`Edit ${form.category} category`}
                          title="Edit selected category"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e4dccd] bg-white text-[#5b5245] transition hover:bg-[#fbf8f2]"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                    </div>

                    {inlineCategoryEditId && (
                      <div className="mt-3 flex gap-2">
                        <input
                          className={`${inputClass} min-w-0 flex-1`}
                          value={inlineCategoryEditName}
                          onChange={(event) => setInlineCategoryEditName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              handleInlineCategoryUpdate()
                            }
                            if (event.key === 'Escape') {
                              event.stopPropagation()
                              setInlineCategoryEditId(null)
                              setInlineCategoryEditName('')
                            }
                          }}
                          placeholder="Category name"
                          aria-label="Edit category name"
                          autoFocus
                        />
                        <button type="button" onClick={handleInlineCategoryUpdate} disabled={isSaving} className={`${primaryBtn} min-h-0 px-4 py-2.5 text-xs`}>
                          {isSaving ? 'Saving…' : 'Update'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineCategoryEditId(null)
                            setInlineCategoryEditName('')
                          }}
                          className={ghostBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {showInlineCategoryCreator && (
                      <div className="mt-3 flex gap-2">
                        <input
                          className={`${inputClass} min-w-0 flex-1`}
                          value={inlineCategoryName}
                          onChange={(event) => setInlineCategoryName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              handleInlineCategoryCreate()
                            }
                          }}
                          placeholder="New category name"
                          aria-label="New category name"
                          autoFocus
                        />
                        <button type="button" onClick={handleInlineCategoryCreate} disabled={isSaving} className={`${primaryBtn} min-h-0 px-4 py-2.5 text-xs`}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    )}
                  </Field>

                  <Field label="Fabric" icon={Gem}>
                    <input className={inputClass} value={form.fabric} onChange={(event) => setForm({ ...form, fabric: event.target.value })} placeholder="Pure silk" required />
                  </Field>

                  <Field label="MRP (₹)" icon={Wallet}>
                    <input className={inputClass} type="number" min="0" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
                  </Field>
                  <Field label="Selling price (₹)" icon={Sparkles}>
                    <input className={inputClass} type="number" min="0" step="1" value={form.discountedPrice} onChange={(event) => setForm({ ...form, discountedPrice: event.target.value })} required />
                  </Field>
                  <Field label="Discount (%)" icon={Tag}>
                    <input className={inputClass} type="number" min="0" max="100" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
                  </Field>
                  <Field label="Stock quantity" icon={Boxes}>
                    <input className={inputClass} type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
                  </Field>
                  <Field label="Occasion" icon={Sparkles}>
                    <input className={inputClass} value={form.occasion} onChange={(event) => setForm({ ...form, occasion: event.target.value })} placeholder="Festive" />
                  </Field>
                  <Field label="Badge" icon={Tag}>
                    <input className={inputClass} value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} placeholder="New" />
                  </Field>

                  <Field label="Colors (comma separated)" icon={Palette} className="sm:col-span-2">
                    <input className={inputClass} value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} placeholder="Ivory, Rose, Gold" />
                  </Field>

                  <Field label="Description" icon={Pencil} className="sm:col-span-2">
                    <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the product and its craft." required />
                  </Field>

                  <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-[#ece5d8] bg-[#fbf8f2] p-4 transition hover:border-[#dccfb6] sm:col-span-2">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset transition ${form.showOnStorefront ? 'bg-[#241f18] ring-[#241f18]' : 'bg-white ring-[#d2c6b0]'}`}>
                      {form.showOnStorefront && <Check size={13} className="text-[#e4c48a]" />}
                    </span>
                    <input type="checkbox" className="sr-only" checked={form.showOnStorefront} onChange={(event) => setForm({ ...form, showOnStorefront: event.target.checked })} />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {form.showOnStorefront ? <Eye size={15} className="text-emerald-600" /> : <EyeOff size={15} className="text-[#8c8172]" />}
                        Show on storefront
                      </span>
                      <span className="mt-1 block text-xs text-[#8c8172]">Unpublished products stay in admin and are hidden from the website.</span>
                    </span>
                  </label>

                  <div className="sm:col-span-2 overflow-hidden rounded-2xl border border-[#ece5d8]">
                    <button
                      type="button"
                      onClick={() => setShowDetails((open) => !open)}
                      className="flex w-full items-center justify-between gap-3 bg-gradient-to-r from-[#fbf7ee] to-[#fffdf9] px-5 py-4 text-left transition hover:from-[#f6efe0]"
                      aria-expanded={showDetails}
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold text-[#4a3f30]">
                        <Scissors size={16} className="text-[#b8893f]" /> Saree and blouse details
                      </span>
                      <ChevronDown size={17} className={`text-[#8c8172] transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
                    </button>

                    {showDetails && (
                      <div className="grid gap-5 border-t border-[#ece5d8] p-5 sm:grid-cols-2">
                        {[
                          ['material', 'Material', 'Silk', Gem],
                          ['weave', 'Weave', 'Pure Resham Thread Kaduwa Weaving', Layers],
                          ['zari', 'Zari', 'Golden Zari', Sparkles],
                          ['sareeColour', 'Saree colour', 'Red', Palette],
                          ['length', 'Saree length', '5.5 metres', Ruler],
                          ['blouseColour', 'Blouse colour', 'Red', Palette],
                          ['craft', 'Craft', 'Handloom', Scissors],
                          ['blouse', 'Blouse details', 'Included', Tag],
                          ['fallPico', 'Fall, pico option', 'e.g. Complimentary / Free / On request', Scissors],
                          ['care', 'Care instructions', 'Dry clean preferred', ShieldCheck],
                          ['rating', 'Rating', '0', Activity],
                          ['reviews', 'Reviews', '0', Activity],
                        ].map(([name, label, placeholder, Icon]) => (
                          <Field key={name} label={label} icon={Icon}>
                            <input
                              className={inputClass}
                              type={['rating', 'reviews'].includes(name) ? 'number' : 'text'}
                              min={name === 'rating' ? '0' : undefined}
                              max={name === 'rating' ? '5' : undefined}
                              step={name === 'rating' ? '0.1' : undefined}
                              value={form[name]}
                              onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                              placeholder={placeholder}
                            />
                          </Field>
                        ))}

                        <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-[#ece5d8] bg-[#fbf8f2] p-4 sm:col-span-2">
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset transition ${form.blouseStitchingAvailable ? 'bg-[#241f18] ring-[#241f18]' : 'bg-white ring-[#d2c6b0]'}`}>
                            {form.blouseStitchingAvailable && <Check size={13} className="text-[#e4c48a]" />}
                          </span>
                          <input type="checkbox" className="sr-only" checked={form.blouseStitchingAvailable} onChange={(event) => setForm({ ...form, blouseStitchingAvailable: event.target.checked })} />
                          <span className="text-sm font-semibold">Blouse stitching is available on request</span>
                        </label>

                        {[
                          ['plainBlousePrice', 'Plain, non-padded blouse stitching price (₹)'],
                          ['paddedBlousePrice', 'Padded blouse stitching price (₹)'],
                        ].map(([name, label]) => (
                          <Field key={name} label={label} icon={Wallet}>
                            <input className={inputClass} type="number" min="0" step="1" value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder="Optional" />
                          </Field>
                        ))}

                        <Field label="Blouse stitching note" icon={Pencil} className="sm:col-span-2">
                          <textarea className={`${inputClass} min-h-20 resize-y`} value={form.blouseStitchingNote} onChange={(event) => setForm({ ...form, blouseStitchingNote: event.target.value })} placeholder="Share measurements and confirm size with our team via WhatsApp." />
                        </Field>

                        <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-[#ece5d8] bg-[#fbf8f2] p-4 sm:col-span-2">
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset transition ${form.fallPicoAvailable ? 'bg-[#241f18] ring-[#241f18]' : 'bg-white ring-[#d2c6b0]'}`}>
                            {form.fallPicoAvailable && <Check size={13} className="text-[#e4c48a]" />}
                          </span>
                          <input type="checkbox" className="sr-only" checked={form.fallPicoAvailable} onChange={(event) => setForm({ ...form, fallPicoAvailable: event.target.checked })} />
                          <span>
                            <span className="block text-sm font-semibold">Fall and pico service available on request</span>
                            <span className="mt-1 block text-xs text-[#8c8172]">Highlights fall and pico customization on the product page.</span>
                          </span>
                        </label>

                        {form.fallPicoAvailable && (
                          <Field label="Fall and pico price (₹) (0 if free)" icon={Wallet} className="sm:col-span-2">
                            <input className={inputClass} type="number" min="0" step="1" value={form.fallPicoPrice} onChange={(event) => setForm({ ...form, fallPicoPrice: event.target.value })} placeholder="0 (Leave empty or 0 if free)" />
                          </Field>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Product image URLs (one HTTPS URL per line)" icon={ImagePlus}>
                      <textarea
                        className={`${inputClass} min-h-24 resize-y`}
                        value={imageUrlInput}
                        onChange={(event) => setImageUrlInput(event.target.value)}
                        placeholder={'https://example.com/image.jpg\nPaste one public HTTPS URL per line'}
                      />
                    </Field>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-[#a39a8a]">Cloudinary and other public HTTPS image URLs are supported.</p>
                      <button type="button" onClick={handleAddImageUrls} disabled={isSaving} className={`${ghostBtn} min-h-10 disabled:opacity-60`}>
                        <Plus size={15} /> Add image URL(s)
                      </button>
                    </div>

                    {form.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {form.images.map((image, index) => (
                          <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-[#f3eee3] ring-1 ring-[#ece5d8]">
                            <ImageWithFallback src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            {index === 0 && (
                              <span className="absolute left-1.5 top-1.5 rounded-md bg-[#241f18]/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#e4c48a] backdrop-blur">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}
                              aria-label={`Remove image ${index + 1}`}
                              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition hover:bg-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Field label="Instagram video / reel URL (optional)" icon={Video} className="sm:col-span-2">
                    <input
                      className={inputClass}
                      type="url"
                      value={form.instagramUrl}
                      onChange={(event) => setForm({ ...form, instagramUrl: event.target.value })}
                      placeholder="https://www.instagram.com/reel/..."
                    />
                    <span className="mt-2 block text-xs text-[#a39a8a]">
                      Optional. Paste an Instagram Reel or Post URL — customers can click to play this video on the product page.
                    </span>
                  </Field>

                  <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                    <button type="submit" disabled={isSaving} className={primaryBtn}>
                      {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <CircleCheck size={17} /> : <PackagePlus size={17} />}
                      {editingId ? 'Save changes' : 'Add product'}
                    </button>
                    <button type="button" onClick={handleCloseForm} className={`${ghostBtn} min-h-12 px-5`}>
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            </>
          ) : (
            <>
              <section className="mb-8 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-[#8c8172]">
                    <Sparkles size={14} className="text-[#b8893f]" /> Keep your storefront organized.
                  </p>
                  <h2 className="mt-1.5 font-serif text-3xl tracking-tight sm:text-4xl">Manage categories</h2>
                </div>
                <button type="button" onClick={handleOpenAddCategory} className={`${primaryBtn} shrink-0 px-4 sm:px-5`}>
                  <FolderPlus size={17} /> <span>Add a collection</span>
                </button>
              </section>

              <section className={`${cardClass} p-6 sm:p-8`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl">Store categories</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#a39a8a]">
                      <Eye size={12} /> Choose which categories appear on the website
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6efe0] px-3 py-1.5 text-xs font-semibold text-[#6e5a35] ring-1 ring-inset ring-[#ebe2cf]">
                    <Shapes size={12} /> {categories.length} total
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {categories.map((category) => (
                    <article key={category.id || category.name} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(43,37,30,0.3)]">
                      <div className="h-[72px] w-[62px] shrink-0 overflow-hidden rounded-xl bg-[#f3eee3] ring-1 ring-[#ece5d8]">
                        <ImageWithFallback src={category.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-serif text-base">{category.name}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-[#8c8172]">{category.accent || 'Store collection'}</p>
                        <div className="mt-2">
                          <Badge tone={category.showOnStorefront ? 'success' : 'neutral'} icon={category.showOnStorefront ? Eye : EyeOff}>
                            {category.showOnStorefront ? 'Visible on website' : 'Hidden from website'}
                          </Badge>
                        </div>
                      </div>
                      {category.id && (
                        <div className="flex shrink-0 flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            aria-label={`Edit ${category.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4dccd] bg-white text-[#5b5245] transition hover:bg-[#fbf8f2]"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryVisibility(category)}
                            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#e4dccd] bg-white px-2 text-[10px] font-semibold text-[#5b5245] transition hover:bg-[#fbf8f2]"
                          >
                            {category.showOnStorefront ? <EyeOff size={12} /> : <Eye size={12} />}
                            {category.showOnStorefront ? 'Hide' : 'Publish'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category)}
                            aria-label={`Delete ${category.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#a0857e] transition hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                <p className="mt-6 flex items-start gap-2 rounded-xl bg-[#fbf8f2] p-4 text-xs leading-5 text-[#8c8172]">
                  <CircleAlert size={14} className="mt-0.5 shrink-0 text-[#b8893f]" />
                  Only published categories and products appear on the storefront. Older catalog entries remain hidden until you publish them.
                </p>
              </section>

              <Modal open={isCategoryFormOpen} onClose={handleCloseCategoryForm} label={editingCategoryId ? 'Edit category' : 'Add a collection'}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a87d3d]">
                      {editingCategoryId ? <Pencil size={11} /> : <FolderPlus size={11} />}
                      {editingCategoryId ? 'Edit category' : 'Create category'}
                    </p>
                    <h3 className="mt-1.5 font-serif text-2xl">{editingCategoryId ? 'Update this collection' : 'Add a collection'}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseCategoryForm}
                    aria-label="Close category form"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e4dccd] bg-white text-[#5b5245] transition hover:bg-[#fbf8f2]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCategorySubmit} className="mt-8 space-y-5">
                  <Field label="Category name" icon={Tag}>
                    <input className={inputClass} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} placeholder="e.g. Banarasi Sarees" required autoFocus />
                  </Field>
                  <Field label="Short description" icon={Pencil}>
                    <input className={inputClass} value={categoryForm.accent} onChange={(event) => setCategoryForm({ ...categoryForm, accent: event.target.value })} placeholder="A short line shown on the storefront" />
                  </Field>
                  <Field label="Category cover image URL" icon={ImagePlus}>
                    <input className={inputClass} type="url" value={categoryForm.image} onChange={(event) => setCategoryForm({ ...categoryForm, image: event.target.value })} placeholder="https://example.com/category-cover.jpg" />
                    <span className="mt-2 block text-xs text-[#a39a8a]">Optional. Use any public HTTPS image URL.</span>
                    {categoryForm.image && isAllowedImageUrl(categoryForm.image) && (
                      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-[#ece5d8]">
                        <ImageWithFallback src={categoryForm.image} alt="Category cover preview" className="h-40 w-full object-cover" />
                      </div>
                    )}
                  </Field>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={isSaving} className={`${primaryBtn} flex-1`}>
                      {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : editingCategoryId ? <CircleCheck size={17} /> : <FolderPlus size={17} />}
                      {editingCategoryId ? 'Save changes' : 'Save category'}
                    </button>
                    <button type="button" onClick={handleCloseCategoryForm} className={`${ghostBtn} min-h-12 px-5`}>
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            </>
          )}
        </main>
      </div>
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null)
        }}
        label={deleteTarget?.type === 'product' ? 'Delete product' : 'Delete category'}
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <Trash2 size={24} />
          </span>
          <h3 className="mt-4 font-serif text-2xl tracking-tight text-[#241f18]">
            {deleteTarget?.type === 'product' ? 'Delete product?' : 'Delete category?'}
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#766c5d]">
            {deleteTarget?.type === 'product' ? (
              <>
                Are you sure you want to delete <strong className="font-semibold text-[#241f18]">"{deleteTarget?.item?.name}"</strong> from your catalog? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete the <strong className="font-semibold text-[#241f18]">"{deleteTarget?.item?.name}"</strong> category? Products in it will not be deleted.
              </>
            )}
          </p>
          <div className="mt-7 flex w-full gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className={`${ghostBtn} min-h-12 flex-1`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
            >
              {isDeleting ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default AdminPage