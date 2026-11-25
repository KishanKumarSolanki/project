export const CART_STORAGE_KEY = 'sareeCart'
export const WISHLIST_STORAGE_KEY = 'sareeWishlist'
export const ORDERS_STORAGE_KEY = 'ananyaOrders'
export const SHIPPING_THRESHOLD = 1499
export const SHIPPING_FEE = 199
export const DISCOUNT_RATE = 0.12

export const DELIVERY_OPTIONS = [
  { value: 'Standard Delivery', description: '4-6 business days' },
  { value: 'Express Delivery', description: 'Faster delivery' },
  { value: 'Pickup at Store', description: 'Collect from our store' },
]

export const PAYMENT_OPTIONS = [
  { value: 'Cash on Delivery', description: 'Pay in cash when your order arrives' },
  { value: 'UPI' },
  { value: 'Credit/Debit Cards' },
  { value: 'Net Banking' },
  { value: 'Wallets' },
]

export const AUTH_ERROR_MESSAGES = {
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

export const ui = {
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
