import { GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AUTH_ERROR_MESSAGES } from '../constants/store'

export const googleProvider = new GoogleAuthProvider()

export const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode or quota). Fail silently.
  }
}

export const getAuthErrorMessage = (error) =>
  AUTH_ERROR_MESSAGES[error?.code] || 'Unable to authenticate. Please try again.'

const wasCreatedInAdmin = (data) => Boolean(data.createdAt && data.updatedAt)

export const normalizeFirestoreProduct = (snapshot) => {
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

export const normalizeFirestoreCategory = (snapshot) => {
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

export const saveUserProfile = async (firebaseUser) => {
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

export const saveCheckoutAddress = async (firebaseUser, formData) => {
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

export const saveOrderToFirestore = async (firebaseUser, order) => {
  await setDoc(doc(db, 'orders', order.id), {
    ...order,
    uid: firebaseUser.uid,
    createdAt: serverTimestamp(),
  })
}
