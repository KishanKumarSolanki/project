import { useParams } from 'react-router-dom'
import ProductDetail from '../components/ProductDetail'
import NotFoundPage from './NotFoundPage'

function ProductPage({ addToCart, toggleWishlist, wishlist, products }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)

  if (!product) return <NotFoundPage />

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

export default ProductPage
