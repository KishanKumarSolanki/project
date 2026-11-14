import {
  Gift,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
  WalletCards,
} from 'lucide-react'
import { features } from '../../data/products'

const iconMap = { ShieldCheck, WalletCards, Truck, RotateCcw, Gift, Headphones }

function BenefitsSection() {
  return (
    <section className="section-wrap">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">The Dori Taaga promise</span>
            <h2 className="section-title">Thoughtful at every step</h2>
          </div>
        </div>
        <div className="benefit-grid">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || ShieldCheck
            return (
              <div className="benefit-item" key={feature.title}>
                <div className="benefit-icon"><Icon size={20} /></div>
                <span>{feature.title}</span>
                <small>Care and craftsmanship, in every order.</small>
                <span className="benefit-index">0{index + 1}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
