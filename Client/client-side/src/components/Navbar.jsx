import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { systemService } from "../api";
import {
  Search,
  PlusCircle,
  Package,
  Layers,
  FileCheck2,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    online: false,
    message: "Connecting...",
  });

  // Check GET / welcome route
  useEffect(() => {
    let isMounted = true;
    const checkServer = async () => {
      try {
        const res = await systemService.getWelcome();
        if (isMounted) {
          if (res.data && res.data.success) {
            setBackendStatus({
              checked: true,
              online: true,
              message: res.data.message || "Online",
            });
          } else {
            setBackendStatus({
              checked: true,
              online: true,
              message: "Server connected",
            });
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus({
            checked: true,
            online: false,
            message: "Backend offline",
          });
        }
      }
    };
    checkServer();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close menus on route change without cascading effect renders
  const [currentPath, setCurrentPath] = useState(location.pathname);
  if (currentPath !== location.pathname) {
    setCurrentPath(location.pathname);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Search size={20} className="brand-icon" />
            <Sparkles size={12} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Find<span className="brand-accent">It</span></span>
            <span className="brand-tagline">Lost & Found</span>
          </div>
        </Link>

      

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/items" className={`nav-link ${isActive("/items") ? "active" : ""}`}>
            <Layers size={16} />
            Browse Items
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/lost-item" className={`nav-link ${isActive("/lost-item") ? "active" : ""}`}>
                <PlusCircle size={16} />
                Report Lost
              </Link>
              <Link to="/found-item" className={`nav-link ${isActive("/found-item") ? "active" : ""}`}>
                <Package size={16} />
                Report Found
              </Link>
              <Link to="/my-claims" className={`nav-link ${isActive("/my-claims") ? "active" : ""}`}>
                <FileCheck2 size={16} />
                My Claims
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-pill ${isActive("/admin") ? "active" : ""}`}>
                  <Shield size={15} />
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/items?type=LOST" className="nav-link">
                Lost Directory
              </Link>
              <Link to="/items?type=FOUND" className="nav-link">
                Found Directory
              </Link>
            </>
          )}
        </nav>

        {/* User Auth Section */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="profile-menu-container">
              <button
                className="user-profile-button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
              >
                <div className="user-avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="user-info-text">
                  <span className="user-name-display">{user?.name || "My Account"}</span>
                  <span className="user-role-badge">{user?.role || "USER"}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-chevron ${profileDropdownOpen ? "open" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="profile-dropdown-card">
                  <div className="dropdown-user-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                    {user?.erp_id && <p className="dropdown-erp">ERP: #{user.erp_id}</p>}
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item">
                    <User size={16} />
                    User Dashboard
                  </Link>
                  <Link to="/see-lost-item" className="dropdown-item">
                    <Layers size={16} />
                    My Lost Items
                  </Link>
                  <Link to="/see-found-item" className="dropdown-item">
                    <Package size={16} />
                    My Found Items
                  </Link>
                  <Link to="/my-claims" className="dropdown-item">
                    <FileCheck2 size={16} />
                    My Claims
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-item">
                      <Shield size={16} />
                      Admin Control Center
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="container mobile-menu-content">
            <Link to="/" className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}>
              Home
            </Link>
            <Link to="/items" className={`mobile-nav-link ${isActive("/items") ? "active" : ""}`}>
              Browse All Items
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`mobile-nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                  Dashboard
                </Link>
                <Link to="/lost-item" className={`mobile-nav-link ${isActive("/lost-item") ? "active" : ""}`}>
                  Report Lost Item
                </Link>
                <Link to="/found-item" className={`mobile-nav-link ${isActive("/found-item") ? "active" : ""}`}>
                  Report Found Item
                </Link>
                <Link to="/see-lost-item" className={`mobile-nav-link ${isActive("/see-lost-item") ? "active" : ""}`}>
                  My Lost Items
                </Link>
                <Link to="/see-found-item" className={`mobile-nav-link ${isActive("/see-found-item") ? "active" : ""}`}>
                  My Found Items
                </Link>
                <Link to="/my-claims" className={`mobile-nav-link ${isActive("/my-claims") ? "active" : ""}`}>
                  My Claims
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={`mobile-nav-link admin-pill ${isActive("/admin") ? "active" : ""}`}>
                    Admin Portal
                  </Link>
                )}
                <div className="mobile-menu-divider" />
                <button onClick={handleLogout} className="btn btn-danger btn-sm w-full">
                  <LogOut size={16} /> Sign Out ({user?.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-secondary w-full">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-gradient w-full">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
