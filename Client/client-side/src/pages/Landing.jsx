import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { systemService, itemService } from "../api";
import {
  Search,
  PlusCircle,
  Package,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Laptop,
  CreditCard,
  Key,
  BookOpen,
  Briefcase,
  HelpCircle,
  Radio,
  FileCheck2,
} from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Backend root endpoint state
  const [welcomeData, setWelcomeData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Categories
  const [categories, setCategories] = useState([]);

  const fetchBackendWelcome = useCallback(async () => {
    try {
      setBackendLoading(true);
      const res = await systemService.getWelcome();
      setWelcomeData(res.data);
      setBackendError(null);
    } catch (err) {
      console.warn("Backend welcome endpoint error:", err);
      setBackendError("Backend connection error");
    } finally {
      setBackendLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await itemService.getCategories();
      const catList = res.data?.category || res.data?.categories || [];
      if (Array.isArray(catList)) {
        setCategories(catList);
      }
    } catch (err) {
      console.warn("Could not fetch categories:", err);
    }
  }, []);

  // Fetch GET / welcome response and categories
  useEffect(() => {
    fetchBackendWelcome();
    fetchCategories();
  }, [fetchBackendWelcome, fetchCategories]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/items");
    }
  };

  return (
    <div className="landing-page">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            {/* Live Backend Route Status Banner */}
            <div className="backend-welcome-banner">
              <div className="welcome-pulse-indicator">
                <span className={`pulse-dot ${welcomeData?.success ? "online" : "offline"}`} />
                <span className="pulse-text">
                  {backendLoading
                    ? "Checking Backend Status..."
                    : welcomeData?.message
                    ? welcomeData.message
                    : backendError || "Backend Ready"}
                </span>
              </div>
              
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Reconnecting People with Their{" "}
              <span className="gradient-text">Lost Belongings</span>
            </h1>

            <p className="hero-subtitle">
              A streamlined, campus-wide network to log lost possessions, report found valuables, and securely reclaim items with verified student & staff IDs.
            </p>

            {/* Hero Quick Search Bar */}
            <form className="hero-search-bar" onSubmit={handleHeroSearch}>
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for laptop, keys, student ID, water bottle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary search-submit-btn">
                Search Items
              </button>
            </form>

            {/* CTA Action Buttons */}
            <div className="hero-cta-buttons">
              <Link to="/lost-item" className="btn btn-gradient btn-lg">
                <PlusCircle size={18} />
                Report Lost Item
              </Link>
              <Link to="/found-item" className="btn btn-secondary btn-lg">
                <Package size={18} />
                Report Found Item
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Join Network
                </Link>
              )}
            </div>

            {/* Key Trust Signals */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Verified Campus IDs</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Instant Claim Alerts</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Safe Hand-off Hubs</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Art */}
          <div className="hero-visual-card">
            <div className="visual-glow-halo" />
            <div className="visual-frame">
              <img
                src="/hero-illustration.jpg"
                alt="Campus Lost & Found Platform Illustration"
                className="hero-img"
              />
              <div className="visual-overlay-badge top-right">
                <Sparkles size={16} color="#38bdf8" />
                <span>Verified Campus Network</span>
              </div>
              <div className="visual-overlay-badge bottom-left">
                <ShieldCheck size={16} color="#34d399" />
                <span>Secure Ownership Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FACTUAL PLATFORM FEATURES
          ========================================================================= */}
      <section className="metrics-section">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-value">Verified</span>
              <span className="metric-title">Campus Accounts</span>
              <p className="metric-desc">Student & staff authentication with ERP credentials</p>
            </div>
            <div className="metric-box">
              <span className="metric-value">Real-Time</span>
              <span className="metric-title">Item Directory</span>
              <p className="metric-desc">Instant reporting for lost & found items with live updates</p>
            </div>
            <div className="metric-box">
              <span className="metric-value">Secure</span>
              <span className="metric-title">Claim Resolution</span>
              <p className="metric-desc">Structured verification to ensure items return to true owners</p>
            </div>
            <div className="metric-box">
              <span className="metric-value">Central</span>
              <span className="metric-title">Campus Hub</span>
              <p className="metric-desc">Centralized directory categorized by campus location & date</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (3 SIMPLE STEPS)
          ========================================================================= */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Seamless Process</span>
            <h2 className="section-title">How FindIt Solves Lost Belongings</h2>
            <p className="section-subtitle">
              Three straightforward steps to report or reclaim items across the campus community.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card glass-panel">
              <div className="step-number">01</div>
              <div className="step-icon-wrapper">
                <PlusCircle size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Report with Details</h3>
              <p className="step-text">
                Lost an item or found someone's keys? Upload photos, specify the location, date, and description in under a minute.
              </p>
              <div className="step-tag">Step 1 • Logging</div>
            </div>

            <div className="step-card glass-panel">
              <div className="step-number">02</div>
              <div className="step-icon-wrapper">
                <Search size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Search & Filter</h3>
              <p className="step-text">
                Our centralized directory makes it simple to filter by category, campus zone, and timeline to find exact matches.
              </p>
              <div className="step-tag">Step 2 • Discovery</div>
            </div>

            <div className="step-card glass-panel">
              <div className="step-number">03</div>
              <div className="step-icon-wrapper">
                <FileCheck2 size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Claim & Hand-off</h3>
              <p className="step-text">
                Found an item that is yours? Submit a claim with proof of ownership. The finder or campus security can review and approve it.
              </p>
              <div className="step-tag">Step 3 • Resolution</div>
            </div>
          </div>
        </div>
      </section>



      {/* =========================================================================
          5. CATEGORY DIRECTORY GRID
          ========================================================================= */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Categorized Hub</span>
            <h2 className="section-title">Popular Lost & Found Categories</h2>
            <p className="section-subtitle">
              Browse reported items by their respective classification.
            </p>
          </div>

          <div className="category-grid">
            {categories.length > 0 ? (
              categories.map((c) => (
                <div
                  key={c.id}
                  className="category-card glass-panel"
                  onClick={() => navigate(`/items?category=${c.id}`)}
                >
                  <div className="category-icon-box cyan">
                    <Package size={26} />
                  </div>
                  <h4>{c.name}</h4>
                  <p>Browse reported {c.name.toLowerCase()} items</p>
                </div>
              ))
            ) : (
              <>
                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items?category=Electronics")}
                >
                  <div className="category-icon-box cyan">
                    <Laptop size={26} />
                  </div>
                  <h4>Electronics & Laptops</h4>
                  <p>Phones, chargers, tablets, earphones</p>
                </div>

                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items?category=Cards")}
                >
                  <div className="category-icon-box purple">
                    <CreditCard size={26} />
                  </div>
                  <h4>IDs & Wallets</h4>
                  <p>Student ID cards, driver licenses, purses</p>
                </div>

                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items?category=Keys")}
                >
                  <div className="category-icon-box amber">
                    <Key size={26} />
                  </div>
                  <h4>Keys & Fobs</h4>
                  <p>Dorm room keys, vehicle remotes, keyrings</p>
                </div>

                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items?category=Books")}
                >
                  <div className="category-icon-box emerald">
                    <BookOpen size={26} />
                  </div>
                  <h4>Books & Stationery</h4>
                  <p>Textbooks, notes, calculators, art gear</p>
                </div>

                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items?category=Bags")}
                >
                  <div className="category-icon-box rose">
                    <Briefcase size={26} />
                  </div>
                  <h4>Bags & Backpacks</h4>
                  <p>Gym bags, laptop sleeves, sports gear</p>
                </div>

                <div
                  className="category-card glass-panel"
                  onClick={() => navigate("/items")}
                >
                  <div className="category-icon-box indigo">
                    <HelpCircle size={26} />
                  </div>
                  <h4>Other Items</h4>
                  <p>Water bottles, umbrellas, apparel & more</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. BOTTOM CALL TO ACTION
          ========================================================================= */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-card glass-panel">
            <div className="cta-content">
              <span className="badge badge-active">Get Reunited Faster</span>
              <h2>Lost an Item on Campus Today?</h2>
              <p>
                Don't wait for your belongings to disappear. Log a report immediately so campus security and fellow students can help you find it.
              </p>
              <div className="cta-button-row">
                <Link to="/lost-item" className="btn btn-primary btn-lg">
                  <PlusCircle size={18} /> Report Lost Item
                </Link>
                <Link to="/found-item" className="btn btn-secondary btn-lg">
                  <Package size={18} /> I Found Something
                </Link>
                {!isAuthenticated && (
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
