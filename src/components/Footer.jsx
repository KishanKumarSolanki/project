import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'

function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark alignStart />
            <p>
              Handwoven treasures made with care, rooted in craft and created for the way you
              celebrate.
            </p>
            <div className="social-row">
              <Link to="/shop" className="icon-button">Instagram</Link>
              <Link to="/shop" className="icon-button">Pinterest</Link>
            </div>
          </div>

          <div>
            <div className="footer-section-title">Shop</div>
            <ul className="footer-links">
              <li><Link to="/shop">All Sarees</Link></li>
              <li><Link to="/shop">New Arrivals</Link></li>
              <li><Link to="/shop">Best Sellers</Link></li>
              <li><Link to="/shop">Collections</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-section-title">Support</div>
            <ul className="footer-links">
              <li><Link to="/account">Contact Us</Link></li>
              <li><Link to="/shop">FAQs</Link></li>
              <li><Link to="/shop">Shipping Policy</Link></li>
              <li><Link to="/shop">Return & Refund</Link></li>
              <li><Link to="/shop">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-section-title">Newsletter</div>
            <p>Receive seasonal drops and bridal edits in your inbox.</p>
            <div className="newsletter-box">
              <input type="email" placeholder="Your email address" />
              <button type="button" className="primary-btn">Subscribe</button>
            </div>
            <div className="payment-row">
              <span>Accepted</span>
              <strong>UPI • Cards • Net Banking</strong>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Dori Taaga. All rights reserved.</span>
          <span>Crafted in India</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
