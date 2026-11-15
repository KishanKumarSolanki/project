import { products } from './products'

export const shopTabs = [
  { name: 'All', category: 'All', productCategory: 'All' },
  { name: 'Kora Silk', category: 'Kora Silk', productCategory: 'Organza Sarees' },
  { name: 'Banarasi', category: 'Banarasi', productCategory: 'Banarasi Sarees' },
  { name: 'Banarsi Silk', category: 'Banarsi Silk', productCategory: 'Banarasi Sarees' },
  { name: 'Chanderi', category: 'Chanderi', productCategory: 'Kanjivaram Sarees' },
  { name: 'Chanderi Suits', category: 'Chanderi Suits', productCategory: 'Designer Sarees' },
  { name: 'Chiffon', category: 'Chiffon', productCategory: 'Chiffon Sarees' },
  { name: 'Suits', category: 'Suits', productCategory: 'Designer Sarees' },
  { name: 'Sale', category: 'Sale', productCategory: 'Sale' },
]

export const shopCollections = [
  { name: 'Kora Silk', category: 'Organza Sarees', image: products[1].images[0], size: 'wide' },
  { name: 'Maheshwari', category: 'Kanjivaram Sarees', image: products[2].images[0] },
  { name: 'Matka Silk', category: 'Silk Sarees', image: products[4].images[0] },
  { name: 'Mukaish', category: 'Designer Sarees', image: products[7].images[0] },
  { name: 'Office Wear', category: 'Chiffon Sarees', image: products[6].images[0], size: 'tall' },
  { name: 'Embroidered Suits', category: 'Designer Sarees', image: products[7].images[1] },
  { name: 'Kanjivaram', category: 'Kanjivaram Sarees', image: products[2].images[1] },
  { name: 'Katan Silk', category: 'Silk Sarees', image: products[4].images[1] },
  { name: 'Chanderi Suits', category: 'Designer Sarees', image: products[3].images[0] },
  { name: 'Chiffon', category: 'Chiffon Sarees', image: products[6].images[1] },
  { name: 'Cotton Suits', category: 'Chiffon Sarees', image: products[1].images[1] },
  { name: 'Cotton', category: 'Silk Sarees', image: products[3].images[2], size: 'tall' },
  { name: 'Georgette Suits', category: 'Designer Sarees', image: products[3].images[1] },
  { name: 'Kora Organza Silk', category: 'Organza Sarees', image: products[1].images[2] },
]
