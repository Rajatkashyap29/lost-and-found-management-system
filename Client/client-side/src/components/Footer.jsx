import { Link } from "react-router-dom";
import { Search, Shield, Mail, Phone } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        {/* Brand column */}
        <div className="footer-brand-col">
          <div className="brand-logo">
            <div className="brand-icon-wrapper">
              <Search size={18} className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-name">Find<span className="brand-accent">It</span></span>
              <span className="brand-tagline">Campus Lost & Found</span>
            </div>
          </div>
          <p className="footer-desc">
            A verified platform for students, faculty, and campus staff to report, track, and reclaim lost personal belongings safely and quickly.
          </p>
          <div className="footer-status-tag">
            <span className="status-dot online" /> Powered by FastAPI & React
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-col">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/items">Browse All Items</Link>
          <Link to="/items?type=LOST">Lost Items</Link>
          <Link to="/items?type=FOUND">Found Items</Link>
          <Link to="/dashboard">User Dashboard</Link>
        </div>

        {/* Services & Actions */}
        <div className="footer-links-col">
          <h4>Actions</h4>
          <Link to="/lost-item">Report a Lost Item</Link>
          <Link to="/found-item">Report a Found Item</Link>
          <Link to="/my-claims">Claim Verification</Link>
          <Link to="/register">Create an Account</Link>
          <Link to="/login">Sign In</Link>
        </div>

        {/* Campus Helpdesk / Contact */}
        <div className="footer-contact-col">
          <h4>Helpdesk</h4>
          <p className="contact-item">
            <Phone size={16} /> Helpline: 91 6207388514
          </p>
          <p className="contact-item">
            <Mail size={16} /> mr.rajat.29@gmail.com
          </p>

          <div className="security-notice">
            <Shield size={14} />
            <span>All items are logged with timestamp and user verification</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} FindIt Campus Lost & Found System. All rights reserved.
        </p>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Campus Guidelines</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
