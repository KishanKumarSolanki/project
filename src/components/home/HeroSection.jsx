import { motion } from 'framer-motion'
import { BadgeCheck, RotateCcw, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="container hero-content">
        <span className="section-label hero-eyebrow">
          <span className="hero-eyebrow__diamond" />
          Handloom · Made by artisans
        </span>
        <h1 className="hero-title">
          Handwoven sarees,
          <span> straight from the weavers.</span>
        </h1>
        <p className="hero-subtitle">
          Banarasi, organza, kora silk and more — real zari, real handloom, delivered to your door.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="primary-btn">Shop all sarees</Link>
          <Link to="/shop" className="secondary-btn">See new arrivals</Link>
        </div>
        <div className="hero-promises" aria-label="Shopping benefits">
          <span><BadgeCheck size={19} /> Authentic handloom</span>
          <span><Truck size={20} /> Free delivery ₹1,999+</span>
          <span><RotateCcw size={19} /> 7-day easy returns</span>
        </div>
        <div className="hero-offers">
          <Link to="/shop" className="hero-offer">
            <span className="hero-offer__icon">₹</span>
            <span><small>Little luxuries</small><strong>Under ₹2,000</strong></span>
            <span className="hero-offer__arrow">↗</span>
          </Link>
          <Link to="/shop" className="hero-offer">
            <span className="hero-offer__icon">%</span>
            <span><small>Festive edit</small><strong>20% off & more</strong></span>
            <span className="hero-offer__arrow">↗</span>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
