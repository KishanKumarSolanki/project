import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ShopPageContent from '../components/shop/ShopPageContent'

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

export default ShopPage
