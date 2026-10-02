import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { itemService, claimService, getErrorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Search,
  Grid,
  List,
  MapPin,
  Calendar,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Tag,
  PlusCircle,
} from "lucide-react";
import "./BrowseItems.css";

const BrowseItems = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  // URL query params
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "ALL";
  const initialCategory = searchParams.get("category") || "ALL";
  const initialItemId = searchParams.get("id");
  const initialClaimId = searchParams.get("claim");

  // State
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  // Filters & View
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Selected item modal & claim modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itemService.getAllItems(page, limit);
      if (res.data && Array.isArray(res.data.items)) {
        setItems(res.data.items);
        setHasMore(res.data.items.length === limit);

        // Check if query param id needs opening
        if (initialItemId) {
          const matched = res.data.items.find((i) => i.id === Number(initialItemId));
          if (matched) setSelectedItem(matched);
        }
        if (initialClaimId) {
          const matched = res.data.items.find((i) => i.id === Number(initialClaimId));
          if (matched) setClaimModalItem(matched);
        }
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn("Error fetching items:", err);
      toast.error(getErrorMessage(err, "Failed to load items"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, initialItemId, initialClaimId, toast]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await itemService.getCategories();
        const catList = res.data?.category || res.data?.categories || [];
        if (Array.isArray(catList)) {
          setCategories(catList);
        }
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle URL updates on search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Filter items in memory based on search and filters
  const filteredItems = items.filter((item) => {
    // Type filter
    if (selectedType !== "ALL" && item.item_type !== selectedType) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "ALL") {
      const catObj = categories.find((c) => String(c.id) === String(selectedCategory));
      if (catObj && item.category_id !== catObj.id) {
        return false;
      }
      // If user typed category name in URL
      if (!catObj && typeof selectedCategory === "string") {
        const matched = categories.find(
          (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (matched && item.category_id !== matched.id) return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    return true;
  });

  // Handle Claim Submission
  const handleConfirmClaim = async () => {
    if (!claimModalItem) return;

    if (!isAuthenticated) {
      toast.warning("Please sign in to claim this item");
      navigate("/login");
      return;
    }

    try {
      setClaimSubmitting(true);
      const res = await claimService.createClaim(claimModalItem.id);
      toast.success(res.data.message || "Claim submitted successfully!");
      setClaimModalItem(null);
      setSelectedItem(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit claim"));
    } finally {
      setClaimSubmitting(false);
    }
  };

  return (
    <div className="browse-items-page">
      <div className="container">
        {/* Page Header */}
        <div className="browse-header">
          <div>
            <span className="section-eyebrow">Campus Directory</span>
            <h1 className="browse-title">Browse Lost & Found Items</h1>
            <p className="browse-subtitle">
              Filter through items reported across campus buildings, labs, and recreation centers.
            </p>
          </div>

          <div className="browse-header-actions">
            <button
              onClick={() => navigate("/lost-item")}
              className="btn btn-secondary btn-sm"
            >
              <PlusCircle size={16} /> Report Lost
            </button>
            <button
              onClick={() => navigate("/found-item")}
              className="btn btn-primary btn-sm"
            >
              <Package size={16} /> Report Found
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-panel glass-panel">
          <form className="browse-search-form" onSubmit={handleSearchSubmit}>
            <div className="browse-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by keywords, location, or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="browse-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="filter-select-wrapper">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Types</option>
                <option value="LOST">Lost Items</option>
                <option value="FOUND">Found Items</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-select-wrapper">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div className="results-summary-row">
          <p className="results-count">
            Showing <strong>{filteredItems.length}</strong> items (Page {page})
          </p>
          {(searchQuery || selectedType !== "ALL" || selectedCategory !== "ALL") && (
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("ALL");
                setSelectedCategory("ALL");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Items Container */}
        {loading ? (
          <div className="loading-state-box">
            <div className="spinner" />
            <p>Loading directory items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className={viewMode === "grid" ? "items-grid-view" : "items-list-view"}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`item-display-card glass-panel ${viewMode}`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div className="card-thumb-wrapper">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="card-thumb-img" />
                  ) : (
                    <div className="card-thumb-placeholder">
                      <Package size={32} color="var(--text-dim)" />
                    </div>
                  )}
                  <span
                    className={`badge card-type-pill ${
                      item.item_type === "LOST" ? "badge-lost" : "badge-found"
                    }`}
                  >
                    {item.item_type}
                  </span>
                </div>

                {/* Content */}
                <div className="card-main-info">
                  <div className="card-top-row">
                    <h3 className="card-item-title">{item.title}</h3>
                    <span className="badge badge-active">{item.status || "ACTIVE"}</span>
                  </div>

                  <p className="card-item-desc">
                    {item.description || "No description provided."}
                  </p>

                  <div className="card-metadata-row">
                    <span className="card-meta">
                      <MapPin size={14} className="meta-icon" />
                      {item.location || "Unknown"}
                    </span>
                    <span className="card-meta">
                      <Calendar size={14} className="meta-icon" />
                      {item.date || "Recent"}
                    </span>
                    {item.category_id && (
                      <span className="card-meta">
                        <Tag size={14} className="meta-icon" />
                        Category #{item.category_id}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="card-button-row"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-secondary btn-sm flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details
                    </button>
                    {item.item_type === "FOUND" && (
                      <button
                        className="btn btn-primary btn-sm flex-1"
                        onClick={() => setClaimModalItem(item)}
                      >
                        Claim Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={36} />
            </div>
            <h3>No matching items found</h3>
            <p>Try adjusting your search keywords, clearing filters, or report a new item.</p>
            <div className="empty-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                  setSelectedCategory("ALL");
                }}
              >
                Clear Filters
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/lost-item")}
              >
                Report Lost Item
              </button>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="page-indicator">Page {page}</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          ITEM DETAILS MODAL
          ========================================================================= */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="modal-content item-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedItem(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-header-badges">
              <span
                className={`badge ${
                  selectedItem.item_type === "LOST" ? "badge-lost" : "badge-found"
                }`}
              >
                {selectedItem.item_type}
              </span>
              <span className="badge badge-active">
                {selectedItem.status || "ACTIVE"}
              </span>
            </div>

            <h2 className="modal-item-title">{selectedItem.title}</h2>

            {/* Modal Image */}
            <div className="modal-image-container">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="modal-full-img"
                />
              ) : (
                <div className="modal-no-img">
                  <Package size={48} color="var(--text-dim)" />
                  <span>No image available for this item</span>
                </div>
              )}
            </div>

            {/* Details Table */}
            <div className="modal-meta-grid">
              <div className="modal-meta-box">
                <span className="modal-meta-label">Location</span>
                <span className="modal-meta-val">
                  <MapPin size={15} color="var(--accent-cyan)" />{" "}
                  {selectedItem.location || "Campus area"}
                </span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Date Reported</span>
                <span className="modal-meta-val">
                  <Calendar size={15} color="var(--accent-cyan)" />{" "}
                  {selectedItem.date || "N/A"}
                </span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Category ID</span>
                <span className="modal-meta-val">#{selectedItem.category_id}</span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Report ID</span>
                <span className="modal-meta-val">#{selectedItem.id}</span>
              </div>
            </div>

            <div className="modal-desc-box">
              <span className="modal-meta-label">Description</span>
              <p className="modal-desc-text">
                {selectedItem.description || "No further details provided."}
              </p>
            </div>

            {/* Modal CTA */}
            <div className="modal-action-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              {selectedItem.item_type === "FOUND" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setClaimModalItem(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Claim This Item
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CLAIM CONFIRMATION MODAL
          ========================================================================= */}
      {claimModalItem && (
        <div className="modal-overlay" onClick={() => setClaimModalItem(null)}>
          <div
            className="modal-content claim-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setClaimModalItem(null)}
            >
              <X size={20} />
            </button>

            <div className="claim-modal-icon">
              <Shield size={36} color="var(--primary)" />
            </div>

            <h2>Claim Verification Request</h2>
            <p className="claim-modal-desc">
              You are requesting to claim <strong>"{claimModalItem.title}"</strong>.
              Your campus user account and ERP ID will be sent to the finder for verification.
            </p>

            <div className="claim-item-summary">
              <div className="summary-row">
                <span>Location Found:</span>
                <strong>{claimModalItem.location}</strong>
              </div>
              <div className="summary-row">
                <span>Date Logged:</span>
                <strong>{claimModalItem.date}</strong>
              </div>
              <div className="summary-row">
                <span>Your Name:</span>
                <strong>{user?.name || "Logged In User"}</strong>
              </div>
            </div>

            <div className="modal-action-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setClaimModalItem(null)}
                disabled={claimSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmClaim}
                disabled={claimSubmitting}
              >
                {claimSubmitting ? "Submitting Claim..." : "Confirm & Send Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
