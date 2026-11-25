import { useEffect, useState } from 'react'
import { ArrowRight, Check, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import ImageWithFallback from '../components/ImageWithFallback'
import { EmptyState, Field, OptionCard, StepHeader } from '../components/common/UIPrimitives'
import {
  DELIVERY_OPTIONS,
  ORDERS_STORAGE_KEY,
  PAYMENT_OPTIONS,
  ui,
} from '../constants/store'
import {
  saveCheckoutAddress,
  saveOrderToFirestore,
  writeStorage,
} from '../services/firestore'
import { formatPrice } from '../utils/formatPrice'

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

export default CheckoutPage
