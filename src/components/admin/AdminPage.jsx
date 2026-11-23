import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Boxes,
  Check,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Shapes,
  ShieldCheck,
  Store,
  Trash2,
  X,
} from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../ImageWithFallback'
import { auth } from '../../firebase'
import { formatPrice } from '../../utils/formatPrice'
import { isAllowedImageUrl } from '../../utils/imageUrl'

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
  blouseStitchingAvailable: false,
  plainBlousePrice: '',
  paddedBlousePrice: '',
  blouseStitchingNote: 'For blouse stitching, please share your measurements and confirm your size with our team via WhatsApp.',
  care: '',
  description: '',
  images: [],
}

const EMPTY_CATEGORY = { name: '', accent: '', image: '' }
const inputClass =
  'w-full rounded-xl border border-[#e7e1d7] bg-white px-3.5 py-3 text-sm text-[#28241f] outline-none transition placeholder:text-[#aaa39a] focus:border-[#a87d3d] focus:ring-2 focus:ring-[#a87d3d]/15'
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#766e63]'

const messageForError = (error) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

function SignInScreen({ authReady, adminRole, adminRoleError, user, onSignOut }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="flex min-h-screen items-center justify-center bg-[#f3f0e9] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(47,39,29,0.12)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[570px] flex-col justify-between overflow-hidden bg-[#2b251e] p-10 text-white md:flex">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-6 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b88a3e] text-[#2b251e]">
              <Store size={22} />
            </span>
            <div>
              <p className="font-semibold tracking-wide">Doritaaga</p>
              <p className="text-xs text-white/55">Store administration</p>
            </div>
          </div>
          <div className="relative max-w-sm">
            <ShieldCheck className="mb-6 text-[#c49a55]" size={32} />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c49a55]">Private workspace</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight">A thoughtful space to run your store.</h1>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Manage your collection and categories from one secure place.
            </p>
          </div>
          <p className="relative text-xs text-white/40">Authorized administrators only</p>
        </div>

        <div className="flex min-h-[570px] flex-col justify-center p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2b251e] text-[#c49a55]">
              <Store size={22} />
            </span>
            <div>
              <p className="font-semibold text-[#2b251e]">Doritaaga</p>
              <p className="text-xs text-[#8c8479]">Admin workspace</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#96713b]">Admin sign in</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#28241f]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-[#81796e]">
            Sign in with the email account assigned the admin role.
          </p>

          {!authReady && (
            <p role="status" className="mt-5 rounded-xl bg-[#f3f0e9] p-3 text-sm text-[#766e63]">
              Checking your sign-in…
            </p>
          )}
          {adminRoleError && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {adminRoleError}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {adminRole === 'denied' && (
            <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              This account is signed in but does not have the admin role.
            </p>
          )}
          {user && (adminRole === 'denied' || adminRoleError) && (
            <button type="button" onClick={onSignOut} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6e655a] hover:text-[#2b251e]">
              <LogOut size={16} /> Sign out of this account
            </button>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Field label="Email address">
              <input
                className={inputClass}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </Field>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2b251e] px-4 text-sm font-semibold text-white transition hover:bg-[#44392c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <LoaderCircle size={17} className="animate-spin" />}
              {isSubmitting ? 'Signing in…' : 'Sign in to admin'}
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-[#9a9287]">
            Access is verified against the <code className="text-[#756344]">users/{'{uid}'}</code> role in Firebase.
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
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
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
      <div className="flex min-h-screen items-center justify-center bg-[#f3f0e9] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <LoaderCircle className="mx-auto animate-spin text-[#a87d3d]" size={30} />
          <h1 className="mt-4 text-xl font-semibold text-[#28241f]">Verifying administrator access</h1>
          <p className="mt-2 text-sm text-[#81796e]">Checking your Firebase account role…</p>
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

  const handleAddImageUrls = () => {
    setError('')
    setNotice('')
    const urls = imageUrlInput.split(/\r?\n/).map((url) => url.trim()).filter(Boolean)

    if (!urls.length) {
      setError('Paste at least one image URL.')
      return
    }

    const invalidUrl = urls.find((url) => !isAllowedImageUrl(url))

    if (invalidUrl) {
      setError('Each image URL must be a valid public HTTPS URL.')
      return
    }

    setForm((current) => ({
      ...current,
      images: [...new Set([...current.images, ...urls])],
    }))
    setImageUrlInput('')
    setNotice(`${urls.length} image ${urls.length === 1 ? 'URL added' : 'URLs added'}.`)
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!form.images.length) {
      setError('Add at least one HTTPS image URL before saving.')
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
      colors: colors.length ? colors : [form.color || 'Classic'],
      color: form.color || colors[0] || 'Classic',
      images: form.images,
    }

    try {
      if (editingId) {
        await onUpdateProduct(editingId, product)
        setNotice('Product updated.')
      } else {
        await onAddProduct(product)
        setNotice('Product added to your store.')
      }
      setForm(EMPTY_PRODUCT)
      setImageUrlInput('')
      setEditingId(null)
    } catch (saveError) {
      setError(messageForError(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleInlineCategoryCreate = async () => {
    const name = inlineCategoryName.trim()
    if (!name) {
      setError('Enter a category name.')
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
      setNotice(`Category "${name}" created and selected.`)
    } catch (saveError) {
      setError(messageForError(saveError))
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
      setNotice(`Category updated to "${selectedName}".`)
    } catch (saveError) {
      setError(messageForError(saveError))
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
      showOnStorefront: product.showOnStorefront === true,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.color || '',
      images: Array.isArray(product.images) ? product.images : [],
    })
    setEditingId(product.id)
    setImageUrlInput('')
    setActiveSection('products')
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalog?`)) return
    setError('')
    setNotice('')
    try {
      await onDeleteProduct(product.id)
      if (editingId === product.id) resetProductForm()
      setNotice('Product deleted.')
    } catch (deleteError) {
      setError(messageForError(deleteError))
    }
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (categoryForm.image && !isAllowedImageUrl(categoryForm.image)) {
      setError('Enter a valid public HTTPS category image URL.')
      return
    }
    setIsSaving(true)
    try {
      if (editingCategoryId) {
        await onUpdateCategory(editingCategoryId, categoryForm)
        setNotice('Category updated.')
      } else {
        await onAddCategory(categoryForm)
        setNotice('Category added and saved to Firebase.')
      }
      setCategoryForm(EMPTY_CATEGORY)
      setEditingCategoryId(null)
    } catch (saveError) {
      setError(messageForError(saveError))
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
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetCategoryForm = () => {
    setCategoryForm(EMPTY_CATEGORY)
    setEditingCategoryId(null)
    setError('')
    setNotice('')
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete the "${category.name}" category? Products in it will not be deleted.`)) return
    setError('')
    setNotice('')
    try {
      await onDeleteCategory(category.id)
      if (editingCategoryId === category.id) resetCategoryForm()
      setNotice('Category deleted.')
    } catch (deleteError) {
      setError(messageForError(deleteError))
    }
  }

  const handleToggleCategoryVisibility = async (category) => {
    setError('')
    setNotice('')
    try {
      await onSetCategoryVisibility(category.id, !category.showOnStorefront)
      setNotice(
        category.showOnStorefront
          ? 'Category hidden from storefront.'
          : 'Category published to storefront.',
      )
    } catch (visibilityError) {
      setError(messageForError(visibilityError))
    }
  }

  const navItems = [
    { id: 'products', label: 'Products', Icon: Package },
    { id: 'categories', label: 'Categories', Icon: Shapes },
  ]

  return (
    <div className="min-h-screen bg-[#f4f2ed] text-[#29251f]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-[#e8e4dc] bg-white px-5 py-6 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b251e] text-[#c49a55]"><Store size={20} /></span>
          <div>
            <p className="text-sm font-bold tracking-wide">Doritaaga</p>
            <p className="text-[11px] text-[#9a9287]">Admin workspace</p>
          </div>
        </div>
        <div className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-[#aaa39a]">Workspace</div>
        <nav className="mt-3 space-y-1">
          <button type="button" onClick={() => setActiveSection('products')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${activeSection === 'products' ? 'bg-[#f3f0e9] text-[#392f22]' : 'text-[#81796e] hover:bg-[#f8f7f4]'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setActiveSection(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${activeSection === id ? 'bg-[#f3f0e9] text-[#392f22]' : 'text-[#81796e] hover:bg-[#f8f7f4]'}`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#f7f4ed] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#534737]"><ShieldCheck size={16} className="text-[#98713b]" /> Admin access</div>
          <p className="mt-2 truncate text-xs text-[#8e867b]">{user.email}</p>
          <button type="button" onClick={onSignOut} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#81796e] transition hover:text-[#332a21]">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-10 flex min-h-[72px] items-center justify-between border-b border-[#e8e4dc] bg-white/95 px-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#a07b43]">Store management</p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight">{activeSection === 'categories' ? 'Categories' : 'Products'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e7e1d7] px-3 text-xs font-semibold text-[#5e564b] transition hover:bg-[#f7f5f0]">
              <Home size={15} /> <span>Home</span>
            </Link>
            <span className="hidden items-center gap-2 rounded-full bg-[#f3f0e9] px-3 py-2 text-xs font-medium text-[#746b5f] sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected
            </span>
            <button type="button" onClick={onSignOut} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e7e1d7] px-3 text-xs font-semibold text-[#5e564b] transition hover:bg-[#f7f5f0] lg:hidden">
              <LogOut size={15} /> Sign out
            </button>
            <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#2b251e] text-xs font-bold text-white sm:inline-flex">
              {user.email?.slice(0, 1).toUpperCase() || 'A'}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-9">
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map(({ id, label, Icon }) => (
              <button key={id} type="button" onClick={() => setActiveSection(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${activeSection === id ? 'bg-[#2b251e] text-white' : 'border border-[#e7e1d7] bg-white text-[#71695f]'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {(error || catalogError) && (
            <div role="alert" className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error || catalogError}</span>
              {error && <button type="button" onClick={() => setError('')} aria-label="Dismiss error"><X size={17} /></button>}
            </div>
          )}
          {notice && (
            <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Check size={17} /> {notice}
            </div>
          )}

          {activeSection === 'products' ? (
            <>
              <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[#898176]">Your products, presented beautifully.</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Inventory overview</h2>
                </div>
                <button type="button" onClick={resetProductForm} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2b251e] px-4 text-sm font-semibold text-white transition hover:bg-[#44392c]">
                  <Plus size={17} /> Add product
                </button>
              </section>

              <section className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                  { label: 'Total products', value: products.length, Icon: Boxes },
                  { label: 'Units in stock', value: totalStock, Icon: Package },
                  { label: 'Categories', value: categories.length, Icon: Shapes },
                  { label: 'Low stock', value: lowStock, Icon: ArrowUpRight },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-2xl border border-[#eae6df] bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs font-medium text-[#898176]">
                      {label}<Icon size={17} className="text-[#a68755]" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
                  </div>
                ))}
              </section>

              <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)]">
                <section className="rounded-2xl border border-[#eae6df] bg-white p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a07b43]">{editingId ? 'Edit listing' : 'New listing'}</p>
                      <h3 className="mt-1 text-xl font-semibold">{editingId ? 'Update product' : 'Add a product'}</h3>
                    </div>
                    {editingId && <button type="button" onClick={resetProductForm} className="text-xs font-semibold text-[#887f73] underline underline-offset-4">Cancel editing</button>}
                  </div>

                  <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleProductSubmit}>
                    <Field label="Product name" className="sm:col-span-2">
                      <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Handwoven silk saree" required />
                    </Field>
                    <Field label="Category">
                      <div className="flex gap-2">
                        <select className={`${inputClass} min-w-0 flex-1`} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
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
                        <button
                          type="button"
                          onClick={() => setShowInlineCategoryCreator((open) => !open)}
                          className="shrink-0 rounded-xl border border-[#e7e1d7] px-3 text-xs font-semibold text-[#5f564a] transition hover:bg-[#f6f4ef]"
                        >
                          <Plus size={14} className="mr-1 inline" /> Create
                        </button>
                        {form.category && categories.some((category) => category.name === form.category) && (
                          <button
                            type="button"
                            onClick={handleStartInlineCategoryEdit}
                            aria-label={`Edit ${form.category} category`}
                            title="Edit selected category"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e7e1d7] text-[#5f564a] transition hover:bg-[#f6f4ef]"
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
                                setInlineCategoryEditId(null)
                                setInlineCategoryEditName('')
                              }
                            }}
                            placeholder="Category name"
                            aria-label="Edit category name"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleInlineCategoryUpdate}
                            disabled={isSaving}
                            className="shrink-0 rounded-xl bg-[#2b251e] px-3 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {isSaving ? 'Saving…' : 'Update'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInlineCategoryEditId(null)
                              setInlineCategoryEditName('')
                            }}
                            className="rounded-xl border border-[#e7e1d7] px-3 text-xs font-semibold text-[#635b50]"
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
                          <button
                            type="button"
                            onClick={handleInlineCategoryCreate}
                            disabled={isSaving}
                            className="shrink-0 rounded-xl bg-[#2b251e] px-3 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {isSaving ? 'Saving…' : 'Save'}
                          </button>
                        </div>
                      )}
                    </Field>
                    <Field label="Fabric">
                      <input className={inputClass} value={form.fabric} onChange={(event) => setForm({ ...form, fabric: event.target.value })} placeholder="Pure silk" required />
                    </Field>
                    <Field label="MRP (₹)">
                      <input className={inputClass} type="number" min="0" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
                    </Field>
                    <Field label="Selling price (₹)">
                      <input className={inputClass} type="number" min="0" step="1" value={form.discountedPrice} onChange={(event) => setForm({ ...form, discountedPrice: event.target.value })} required />
                    </Field>
                    <Field label="Discount (%)">
                      <input className={inputClass} type="number" min="0" max="100" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
                    </Field>
                    <Field label="Stock quantity">
                      <input className={inputClass} type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
                    </Field>
                    <Field label="Occasion">
                      <input className={inputClass} value={form.occasion} onChange={(event) => setForm({ ...form, occasion: event.target.value })} placeholder="Festive" />
                    </Field>
                    <Field label="Badge">
                      <input className={inputClass} value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} placeholder="New" />
                    </Field>
                    <Field label="Colors (comma separated)" className="sm:col-span-2">
                      <input className={inputClass} value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} placeholder="Ivory, Rose, Gold" />
                    </Field>
                    <Field label="Description" className="sm:col-span-2">
                      <textarea className={`${inputClass} min-h-24 resize-y`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the product and its craft." required />
                    </Field>
                    <label className="flex items-start gap-3 rounded-xl bg-[#f7f5f0] p-3.5 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={form.showOnStorefront}
                        onChange={(event) => setForm({ ...form, showOnStorefront: event.target.checked })}
                        className="mt-0.5 h-4 w-4 accent-[#2b251e]"
                      />
                      <span>
                        <span className="block text-sm font-semibold">Show on storefront</span>
                        <span className="mt-1 block text-xs text-[#8c8479]">Unpublished products stay in admin and are hidden from the website.</span>
                      </span>
                    </label>
                    <details open className="sm:col-span-2">
                      <summary className="cursor-pointer text-xs font-semibold text-[#756d62]">Saree and blouse details</summary>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {[
                          ['material', 'Material', 'Silk'],
                          ['weave', 'Weave', 'Pure Resham Thread Kaduwa Weaving'],
                          ['zari', 'Zari', 'Golden Zari'],
                          ['sareeColour', 'Saree colour', 'Red'],
                          ['length', 'Saree length', '5.5 metres'],
                          ['blouseColour', 'Blouse colour', 'Red'],
                          ['craft', 'Craft', 'Handloom'],
                          ['blouse', 'Blouse details', 'Included'],
                          ['care', 'Care instructions', 'Dry clean preferred'],
                          ['rating', 'Rating', '0'],
                          ['reviews', 'Reviews', '0'],
                        ].map(([name, label, placeholder]) => (
                          <Field key={name} label={label}>
                            <input className={inputClass} type={['rating', 'reviews'].includes(name) ? 'number' : 'text'} min={name === 'rating' ? '0' : undefined} max={name === 'rating' ? '5' : undefined} step={name === 'rating' ? '0.1' : undefined} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={placeholder} />
                          </Field>
                        ))}
                        <label className="flex items-start gap-3 rounded-xl bg-[#f7f5f0] p-3.5 sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={form.blouseStitchingAvailable}
                            onChange={(event) => setForm({ ...form, blouseStitchingAvailable: event.target.checked })}
                            className="mt-0.5 h-4 w-4 accent-[#2b251e]"
                          />
                          <span className="text-sm font-semibold">Blouse stitching is available on request</span>
                        </label>
                        {[
                          ['plainBlousePrice', 'Plain, non-padded blouse stitching price (₹)'],
                          ['paddedBlousePrice', 'Padded blouse stitching price (₹)'],
                        ].map(([name, label]) => (
                          <Field key={name} label={label}>
                            <input className={inputClass} type="number" min="0" step="1" value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder="Optional" />
                          </Field>
                        ))}
                        <Field label="Blouse stitching note" className="sm:col-span-2">
                          <textarea className={`${inputClass} min-h-20 resize-y`} value={form.blouseStitchingNote} onChange={(event) => setForm({ ...form, blouseStitchingNote: event.target.value })} placeholder="Share measurements and confirm size with our team via WhatsApp." />
                        </Field>
                      </div>
                    </details>

                    <div className="sm:col-span-2">
                      <Field label="Product image URLs (one HTTPS URL per line)">
                        <textarea
                          className={`${inputClass} min-h-24 resize-y`}
                          value={imageUrlInput}
                          onChange={(event) => setImageUrlInput(event.target.value)}
                          placeholder={'https://example.com/image.jpg\nPaste one public HTTPS URL per line'}
                        />
                      </Field>
                      <p className="mt-1 text-xs text-[#938b7f]">Cloudinary and other public HTTPS image URLs are supported.</p>
                      <button
                        type="button"
                        onClick={handleAddImageUrls}
                        disabled={isSaving}
                        className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e7e1d7] px-3 text-xs font-semibold text-[#5f564a] transition hover:bg-[#f6f4ef] disabled:opacity-60"
                      >
                        <Plus size={15} /> Add image URL(s)
                      </button>
                      {form.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {form.images.map((image, index) => (
                            <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl bg-[#f1eee8]">
                              <ImageWithFallback src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                              <button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))} aria-label={`Remove image ${index + 1}`} className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
                      <button type="submit" disabled={isSaving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2b251e] px-5 text-sm font-semibold text-white transition hover:bg-[#44392c] disabled:opacity-60">
                        {isSaving && <LoaderCircle size={16} className="animate-spin" />}
                        {editingId ? 'Save changes' : 'Add product'}
                      </button>
                      {editingId && <button type="button" onClick={resetProductForm} className="rounded-xl border border-[#e7e1d7] px-4 text-sm font-semibold text-[#635b50]">Cancel</button>}
                    </div>
                  </form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#eae6df] bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeae4] p-5 sm:p-6">
                    <div><h3 className="font-semibold">Product catalog</h3><p className="mt-1 text-xs text-[#938b7f]">{products.length} items in Firebase</p></div>
                    <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#e7e1d7] px-3 text-[#8a8277] sm:w-48">
                      <Search size={16} /><input className="min-w-0 flex-1 text-xs text-[#29251f] outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
                    </label>
                  </div>
                  <div className="max-h-[850px] divide-y divide-[#f0ede7] overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <article key={product.id} className="flex gap-3 p-4 transition hover:bg-[#fcfbf8] sm:p-5">
                        <div className="h-[68px] w-[56px] shrink-0 overflow-hidden rounded-lg bg-[#f1eee8]">
                          <ImageWithFallback src={product.images?.[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold">{product.name}</h4>
                              <p className="mt-1 truncate text-xs text-[#8c8479]">{product.category} · {product.stock} in stock</p>
                              <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${product.showOnStorefront ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f3f0e9] text-[#81796e]'}`}>
                                {product.showOnStorefront ? 'Visible on website' : 'Hidden from website'}
                              </span>
                            </div>
                            <span className="shrink-0 text-xs font-semibold">{formatPrice(product.discountedPrice)}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button type="button" onClick={() => handleEditProduct(product)} className="rounded-lg border border-[#e7e1d7] px-3 py-1.5 text-xs font-semibold text-[#5f564a] hover:bg-[#f6f4ef]">Edit</button>
                            <button type="button" onClick={() => handleDeleteProduct(product)} aria-label={`Delete ${product.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9a746e] transition hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </article>
                    ))}
                    {!filteredProducts.length && (
                      <div className="px-5 py-12 text-center">
                        <Package className="mx-auto text-[#c3b9a9]" size={28} />
                        <p className="mt-3 text-sm font-semibold">{search ? 'No matching products' : 'Your catalog is ready'}</p>
                        <p className="mt-1 text-xs text-[#938b7f]">{search ? 'Try a different search.' : 'Add your first product using the form.'}</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </>
          ) : (
            <>
              <section className="mb-7">
                <p className="text-sm text-[#898176]">Keep your storefront organized.</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Manage categories</h2>
              </section>
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                <section className="rounded-2xl border border-[#eae6df] bg-white p-5 sm:p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a07b43]">{editingCategoryId ? 'Edit category' : 'Create category'}</p>
                  <h3 className="mt-1 text-xl font-semibold">{editingCategoryId ? 'Update this collection' : 'Add a collection'}</h3>
                  <form onSubmit={handleCategorySubmit} className="mt-6 space-y-4">
                    <Field label="Category name">
                      <input className={inputClass} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} placeholder="e.g. Banarasi Sarees" required />
                    </Field>
                    <Field label="Short description">
                      <input className={inputClass} value={categoryForm.accent} onChange={(event) => setCategoryForm({ ...categoryForm, accent: event.target.value })} placeholder="A short line shown on the storefront" />
                    </Field>
                    <Field label="Category cover image URL">
                      <input
                        className={inputClass}
                        type="url"
                        value={categoryForm.image}
                        onChange={(event) => setCategoryForm({ ...categoryForm, image: event.target.value })}
                        placeholder="https://example.com/category-cover.jpg"
                      />
                      <span className="mt-1 block text-xs text-[#938b7f]">Optional. Use any public HTTPS image URL.</span>
                      {categoryForm.image && isAllowedImageUrl(categoryForm.image) && (
                        <ImageWithFallback src={categoryForm.image} alt="Category cover preview" className="mt-3 h-36 w-full rounded-xl object-cover" />
                      )}
                    </Field>
                    <div className="flex gap-2">
                      <button type="submit" disabled={isSaving} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2b251e] px-5 text-sm font-semibold text-white transition hover:bg-[#44392c] disabled:opacity-60">
                        {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : editingCategoryId ? <Check size={17} /> : <Plus size={17} />}
                        {editingCategoryId ? 'Save changes' : 'Save category to Firebase'}
                      </button>
                      {editingCategoryId && (
                        <button type="button" onClick={resetCategoryForm} className="rounded-xl border border-[#e7e1d7] px-4 text-sm font-semibold text-[#635b50]">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <section className="rounded-2xl border border-[#eae6df] bg-white p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div><h3 className="font-semibold">Store categories</h3><p className="mt-1 text-xs text-[#938b7f]">Choose which categories appear on the website</p></div>
                    <span className="rounded-full bg-[#f3f0e9] px-3 py-1 text-xs font-semibold text-[#746b5f]">{categories.length} total</span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {categories.map((category) => (
                      <article key={category.id || category.name} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#eeeae4] p-3">
                        <div className="h-[66px] w-[56px] shrink-0 overflow-hidden rounded-lg bg-[#f1eee8]">
                          <ImageWithFallback src={category.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-semibold">{category.name}</h4>
                          <p className="mt-1 line-clamp-2 text-xs text-[#8c8479]">{category.accent || 'Store collection'}</p>
                          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${category.showOnStorefront ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f3f0e9] text-[#81796e]'}`}>
                            {category.showOnStorefront ? 'Visible on website' : 'Hidden from website'}
                          </span>
                        </div>
                        {category.id && (
                          <div className="flex shrink-0 flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditCategory(category)}
                              aria-label={`Edit ${category.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e1d7] text-[#5f564a] hover:bg-[#f6f4ef]"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCategoryVisibility(category)}
                              className="rounded-lg border border-[#e7e1d7] px-2 py-1.5 text-[10px] font-semibold text-[#5f564a] hover:bg-[#f6f4ef]"
                            >
                              {category.showOnStorefront ? 'Hide' : 'Publish'}
                            </button>
                          <button type="button" onClick={() => handleDeleteCategory(category)} aria-label={`Delete ${category.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#9a746e] transition hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                  <p className="mt-5 text-xs leading-5 text-[#938b7f]">Only published categories and products appear on the storefront. Older catalog entries remain hidden until you publish them.</p>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPage
