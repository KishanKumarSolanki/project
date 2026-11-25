import { useCallback, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import {
  CART_STORAGE_KEY,
  DISCOUNT_RATE,
  SHIPPING_FEE,
  SHIPPING_THRESHOLD,
  WISHLIST_STORAGE_KEY,
} from '../constants/store'
import {
  getAuthErrorMessage,
  normalizeFirestoreCategory,
  normalizeFirestoreProduct,
  readStorage,
  writeStorage,
} from '../services/firestore'

export function useStorefront() {
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

  const openLoginPrompt = useCallback(() => setShowLoginPrompt(true), [])
  const closeLoginPrompt = useCallback(() => setShowLoginPrompt(false), [])

  useEffect(() => writeStorage(CART_STORAGE_KEY, cart), [cart])
  useEffect(() => writeStorage(WISHLIST_STORAGE_KEY, wishlist), [wishlist])

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setFirebaseUser(currentUser)
        setAuthReady(true)
        setAdminRole(currentUser ? 'checking' : 'signed-out')
        setAdminRoleError('')
        if (currentUser) {
          setShowLoginPrompt(false)
        }
      }),
    [],
  )

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
          .sort(
            (first, second) =>
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

  const clearCart = () => setCart([])

  const toggleWishlist = (productId) =>
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : cart.length ? SHIPPING_FEE : 0
  const discount = subtotal * DISCOUNT_RATE
  const storefrontProducts = catalog.filter((product) => product.showOnStorefront)
  const storefrontCategories = categories.filter((category) => category.showOnStorefront)

  return {
    cart,
    cartCount,
    wishlist,
    catalog,
    categories,
    catalogError,
    storefrontProducts,
    storefrontCategories,
    firebaseUser,
    authReady,
    adminRole,
    adminRoleError,
    showLoginPrompt,
    openLoginPrompt,
    closeLoginPrompt,
    subtotal,
    shipping,
    discount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleSetCategoryVisibility,
    handleAdminSignOut,
  }
}
