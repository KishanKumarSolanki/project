import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function StorySection() {
  return (
    <section id="story" className="px-4 py-12 sm:px-7 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column: Heritage story, stats & CTA */}
        <div className="text-center lg:col-span-6 lg:text-left">
          <span className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f] lg:justify-start">
            <span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />
            Our heritage
          </span>

          <h2 className="text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#2c1e19] sm:text-6xl">
            Handcrafted
            <br />
            <span className="font-serif font-medium text-[#85642e]">with Love</span>
          </h2>

          <span className="mx-auto mt-6 block h-0.5 w-14 bg-[#b88a3e] lg:mx-0" />

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#71645b] sm:text-lg sm:leading-8 lg:mx-0">
            Discover the elegance of Indian handwoven sarees, crafted with timeless artistry and
            intricate designs. Each saree is a story of tradition — woven by skilled artisans who
            carry forward generations of heritage.
          </p>

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4 sm:mt-10 sm:gap-8 lg:mx-0">
            {[
              ['500+', 'Artisans'],
              ['20+', 'Craft clusters'],
              ['1000+', 'Unique weaves'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong className="block text-2xl font-semibold tracking-tight text-[#2c1e19] sm:text-4xl">
                  {value}
                </strong>
                <span className="mt-1.5 block text-[10px] font-medium uppercase leading-4 tracking-[0.16em] text-[#71645b] sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/shop"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg border border-[#2c1e19] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#2c1e19] transition hover:bg-[#2c1e19] hover:text-white sm:mt-10"
          >
            The Collection <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right column: Saree showcase collage */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:col-span-6">
          {/* Left sub-column */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <Link
              to="/shop"
              className="group relative h-[260px] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#2c1e19] sm:h-[340px]"
            >
              <img
                src="/images/DSC_0437.webp"
                alt="Handwoven work sarees collection"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-4 text-center sm:p-6">
                <div className="flex w-full items-center justify-center gap-2.5 text-white">
                  <span className="h-px w-5 bg-white/70 sm:w-8" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
                    Work Sarees
                  </span>
                  <span className="h-px w-5 bg-white/70 sm:w-8" />
                </div>
                <span className="mt-3 inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2c1e19] shadow-sm transition group-hover:bg-[#d9b676]">
                  Shop Now
                </span>
              </div>
            </Link>

            <div className="group relative h-[145px] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#2c1e19] sm:h-[180px]">
              <img
                src="/images/DSC_0448.webp"
                alt="Floral handloom saree drape"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right sub-column */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div className="group relative h-[135px] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#2c1e19] sm:h-[168px]">
              <img
                src="/images/DSC_0453.webp"
                alt="Ivory rose handwoven silk linen saree"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="group relative h-[135px] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#2c1e19] sm:h-[168px]">
              <img
                src="/images/DSC_0639.webp"
                alt="Aqua mint artisan handloom saree"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="group relative h-[120px] overflow-hidden rounded-2xl border border-[#e2d9c5] bg-[#2c1e19] sm:h-[168px]">
              <img
                src="/images/Screenshot_20261005_171115_Gallery.webp"
                alt="Traditional handloom weave detail"
                className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StorySection
