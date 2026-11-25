import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppFrame, ScrollToTop } from './components/common/UIPrimitives'
import { CheckoutLoginGate, LoginPromptModal } from './components/auth/LoginPromptModal'
import { useStorefront } from './hooks/useStorefront'
import AccountPage from './pages/AccountPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'
import WishlistPage from './pages/WishlistPage'

const AdminPage = lazy(() => import('./components/admin/AdminPage'))

function App() {
  const {
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
  } = useStorefront()

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
                  onOrderPlaced={clearCart}
                />
              ) : (
                <CheckoutLoginGate authReady={authReady} onOpenLogin={openLoginPrompt} />
              )
            }
          />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-[#f4f2ed] text-sm text-[#81796e]">
                    Opening admin workspace…
                  </div>
                }
              >
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <LoginPromptModal isOpen={showLoginPrompt} onClose={closeLoginPrompt} />
      </AppFrame>
    </BrowserRouter>
  )
}

export default App
