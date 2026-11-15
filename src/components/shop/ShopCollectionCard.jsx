import { Plus } from 'lucide-react'
import ImageWithFallback from '../ImageWithFallback'

function ShopCollectionCard({ collection, onSelect }) {
  const shape = collection.size === 'wide'
    ? 'col-span-2 aspect-[1.6] sm:aspect-[2.15]'
    : collection.size === 'tall'
      ? 'row-span-2 aspect-[0.67] sm:aspect-[0.72]'
      : 'aspect-[0.84] sm:aspect-[0.9]'

  const handleSelect = () => {
    onSelect(collection.category)
    document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`group relative block w-full overflow-hidden bg-[#e6e1d7] text-left ${shape}`}
      aria-label={`Browse ${collection.name}`}
    >
      <ImageWithFallback
        src={collection.image}
        alt={`${collection.name} collection`}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#211713]/75 via-transparent to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-6">
        <span className="text-lg font-semibold leading-tight sm:text-2xl">{collection.name}</span>
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-[#b88a3e] group-hover:text-[#2c1e19]">
          <Plus size={22} strokeWidth={1.7} />
        </span>
      </span>
    </button>
  )
}

export default ShopCollectionCard
