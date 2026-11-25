import { useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'
import { EmptyState } from '../components/common/UIPrimitives'
import { ui } from '../constants/store'
import { formatPrice } from '../utils/formatPrice'

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
      <div
        className={`${ui.container} grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:gap-8`}
      >
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
                      <h2 className="text-sm font-semibold leading-5 text-[#2c1e19] sm:text-base">
                        {item.name}
                      </h2>
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
              <dt className="text-[#71645b]">
                Discount{appliedCoupon === 'NEW10' ? ' (NEW10)' : ' (12%)'}
              </dt>
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

export default CartPage
