import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { itemService, claimService, systemService, getErrorMessage } from "../api";
import {
  Package,
  Layers,
  FileCheck2,
  PlusCircle,
  Search,
  LogOut,
  Edit3,
  Phone,
  Mail,
  Hash,
  Shield,
  ArrowRight,
  X,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Summary counts
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [claimsCount, setClaimsCount] = useState(0);
  const [backendPing, setBackendPing] = useState("Checking...");

  // Recent items
  const [myLostPreview, setMyLostPreview] = useState([]);
  const [myFoundPreview, setMyFoundPreview] = useState([]);

  // Edit profile modal state
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const handleOpenEditModal = () => {
    setProfileName(user?.name || "");
    setProfilePhone(user?.phone_number || "");
    setEditProfileModal(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      // Ping backend GET /
      try {
        const pingRes = await systemService.getWelcome();
        setBackendPing(pingRes.data?.message || "Operational");
      } catch {
        setBackendPing("Offline");
      }

      // Fetch My Lost
      try {
        const lostRes = await itemService.getMyLostItems(1, 4);
        const list = lostRes.data?.item || [];
        setMyLostPreview(list);
        setLostCount(list.length);
      } catch {
        setMyLostPreview([]);
      }

      // Fetch My Found
      try {
        const foundRes = await itemService.getMyFoundItems(1, 4);
        const list = foundRes.data?.item || [];
        setMyFoundPreview(list);
        setFoundCount(list.length);
      } catch {
        setMyFoundPreview([]);
      }

      // Fetch Claims
      try {
        const claimsRes = await claimService.getMyClaims(1, 10);
        const list = claimsRes.data?.claims || [];
        setClaimsCount(list.length);
      } catch {
        setClaimsCount(0);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await updateProfile({
        name: profileName.trim() || null,
        phone_number: profilePhone.trim() || null,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        setEditProfileModal(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* ================= USER WELCOME HEADER ================= */}
        <div className="dash-hero-card glass-panel">
          <div className="dash-hero-left">
            <div className="dash-avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="dash-user-meta">
              <div className="dash-name-line">
                <h1>Hello, {user?.name || "Campus Member"}</h1>
                <span className="badge badge-active">{user?.role || "STUDENT"}</span>
              </div>
              <p className="dash-greeting-text">
                Welcome to your command center. Check reported items, coordinate returns, and manage claims.
              </p>
              <div className="dash-identifiers">
                {user?.erp_id && (
                  <span className="dash-badge-id">
                    <Hash size={13} /> ERP: {user.erp_id}
                  </span>
                )}
                <span className="dash-badge-id">
                  <Mail size={13} /> {user?.email}
                </span>
                {user?.phone_number && (
                  <span className="dash-badge-id">
                    <Phone size={13} /> {user.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dash-hero-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleOpenEditModal}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ================= STATS OVERVIEW CARDS ================= */}
        <div className="dash-stats-grid">
          {/* Lost Reports */}
          <Link to="/see-lost-item" className="dash-stat-box glass-panel">
            <div className="stat-icon-wrapper rose">
              <Layers size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{lostCount}</span>
              <span className="stat-label">Recent Lost Items</span>
            </div>
            <span className="stat-arrow"><ArrowRight size={16} /></span>
          </Link>

          {/* Found Reports */}
          <Link to="/see-found-item" className="dash-stat-box glass-panel">
            <div className="stat-icon-wrapper emerald">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{foundCount}</span>
              <span className="stat-label">Recent Found Items</span>
            </div>
            <span className="stat-arrow"><ArrowRight size={16} /></span>
          </Link>

          {/* Claims Submitted */}
          <Link to="/my-claims" className="dash-stat-box glass-panel">
            <div className="stat-icon-wrapper amber">
              <FileCheck2 size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{claimsCount}</span>
              <span className="stat-label">Recent Claims</span>
            </div>
            <span className="stat-arrow"><ArrowRight size={16} /></span>
          </Link>

          {/* Backend Status */}
          <div className="dash-stat-box glass-panel no-pointer">
            <div className="stat-icon-wrapper indigo">
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-number status-text">Live</span>
              <span className="stat-label">{backendPing}</span>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTIONS TILES ================= */}
        <div className="dash-section-wrapper">
          <h2 className="dash-section-title">Quick Actions</h2>
          <div className="dash-quick-grid">
            <Link to="/lost-item" className="quick-action-card glass-panel">
              <div className="quick-icon-circle rose">
                <PlusCircle size={24} />
              </div>
              <div>
                <h3>Report Lost Item</h3>
                <p>Lost your wallet, ID, keys, or electronic gear? Post a report right now.</p>
              </div>
            </Link>

            <Link to="/found-item" className="quick-action-card glass-panel">
              <div className="quick-icon-circle emerald">
                <Package size={24} />
              </div>
              <div>
                <h3>Report Found Item</h3>
                <p>Found something that belongs to someone else? Log it so the owner can claim it.</p>
              </div>
            </Link>

            <Link to="/items" className="quick-action-card glass-panel">
              <div className="quick-icon-circle cyan">
                <Search size={24} />
              </div>
              <div>
                <h3>Browse Campus Items</h3>
                <p>Explore all active lost and found postings with filters and location tags.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY PREVIEW ================= */}
        <div className="dash-split-sections">
          {/* Recent Lost Reports */}
          <div className="dash-split-col glass-panel">
            <div className="split-header">
              <div>
                <h3>My Recent Lost Items</h3>
                <p className="split-sub">Items you have reported missing</p>
              </div>
              <Link to="/see-lost-item" className="split-view-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {myLostPreview.length > 0 ? (
              <div className="mini-item-list">
                {myLostPreview.map((item) => (
                  <div key={item.id} className="mini-item-row">
                    <div className="mini-thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <Package size={20} color="var(--text-dim)" />
                      )}
                    </div>
                    <div className="mini-info">
                      <h4>{item.title}</h4>
                      <span>{item.location} • {item.date}</span>
                    </div>
                    <span className="badge badge-lost">{item.status || "ACTIVE"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mini-empty">
                <p>No lost items reported yet.</p>
                <Link to="/lost-item" className="btn btn-secondary btn-sm">
                  Report Item
                </Link>
              </div>
            )}
          </div>

          {/* Recent Found Reports */}
          <div className="dash-split-col glass-panel">
            <div className="split-header">
              <div>
                <h3>My Recent Found Items</h3>
                <p className="split-sub">Items you found and posted</p>
              </div>
              <Link to="/see-found-item" className="split-view-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {myFoundPreview.length > 0 ? (
              <div className="mini-item-list">
                {myFoundPreview.map((item) => (
                  <div key={item.id} className="mini-item-row">
                    <div className="mini-thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <Package size={20} color="var(--text-dim)" />
                      )}
                    </div>
                    <div className="mini-info">
                      <h4>{item.title}</h4>
                      <span>{item.location} • {item.date}</span>
                    </div>
                    <span className="badge badge-found">{item.status || "ACTIVE"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mini-empty">
                <p>No found items reported yet.</p>
                <Link to="/found-item" className="btn btn-secondary btn-sm">
                  Report Found
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {editProfileModal && (
        <div className="modal-overlay" onClick={() => setEditProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditProfileModal(false)}>
              <X size={20} />
            </button>
            <h2>Edit Profile Information</h2>
            <p className="modal-subtitle">Update your account name or contact number</p>

            <form onSubmit={handleSaveProfile} className="edit-modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="form-control"
                  minLength={3}
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="e.g. +1 555-019-2834"
                  className="form-control"
                />
              </div>

              <div className="modal-action-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditProfileModal(false)}
                  disabled={profileSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;