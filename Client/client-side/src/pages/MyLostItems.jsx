import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { itemService, getErrorMessage } from "../api";
import {
  Package,
  MapPin,
  Calendar,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import "./UserItems.css";

const MyLostItems = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);

  // Modals
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchLostItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itemService.getMyLostItems(page, limit);
      const list = res.data?.item || [];
      setItems(list);
      setHasMore(list.length === limit);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setItems([]);
      } else {
        toast.error(getErrorMessage(err, "Failed to fetch lost items"));
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, toast]);

  useEffect(() => {
    fetchLostItems();
  }, [fetchLostItems]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await itemService.getCategories();
        const catList = res.data?.category || res.data?.categories || [];
        if (Array.isArray(catList)) setCategories(catList);
      } catch (err) {
        console.warn("Could not fetch categories", err);
      }
    };
    fetchCats();
  }, []);

  const openEditModal = (item) => {
    setEditItem(item);
    setEditTitle(item.title || "");
    setEditDesc(item.description || "");
    setEditCategory(item.category_id || "");
    setEditLocation(item.location || "");
    setEditDate(item.date || "");
    setEditImage(item.image || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const updateData = {
        title: editTitle,
        description: editDesc,
        category_id: editCategory ? Number(editCategory) : null,
        location: editLocation,
        date: editDate,
        image: editImage || null,
      };

      await itemService.updateLostItem(editItem.id, updateData);
      toast.success("Lost item updated successfully!");
      setEditItem(null);
      fetchLostItems();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update item"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await itemService.deleteLostItem(deleteId);
      toast.success("Item deleted successfully");
      setDeleteId(null);
      fetchLostItems();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete item"));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="user-items-page">
      <div className="container">
        {/* Header */}
        <div className="user-items-header">
          <div>
            <span className="badge badge-lost">Personal Reports</span>
            <h1 className="user-items-title">My Lost Items</h1>
            <p className="user-items-subtitle">
              Manage your lost item postings, edit details, or remove solved cases.
            </p>
          </div>
          <Link to="/lost-item" className="btn btn-primary">
            <PlusCircle size={18} /> Report New Lost Item
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state-box">
            <div className="spinner" />
            <p>Loading your lost items...</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="user-items-grid">
              {items.map((item) => (
                <div key={item.id} className="user-item-card glass-panel">
                  <div className="user-item-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="thumb-placeholder">
                        <Package size={32} color="var(--text-dim)" />
                      </div>
                    )}
                    <span className="badge badge-lost thumb-badge">LOST</span>
                    <span className="badge badge-active status-badge">{item.status}</span>
                  </div>

                  <div className="user-item-body">
                    <h3 className="user-item-title">{item.title}</h3>
                    <p className="user-item-desc">
                      {item.description || "No description provided."}
                    </p>

                    <div className="user-item-meta">
                      <span><MapPin size={13} className="meta-icon" /> {item.location}</span>
                      <span><Calendar size={13} className="meta-icon" /> {item.date}</span>
                    </div>

                    <div className="user-item-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewItem(item)}
                        title="View Details"
                      >
                        <Eye size={15} /> View
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(item)}
                        title="Edit Item"
                      >
                        <Edit2 size={15} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(item.id)}
                        title="Delete Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="page-indicator">Page {page}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={36} />
            </div>
            <h3>No lost items reported yet</h3>
            <p>If you've misplaced an item on campus, report it now to notify the community.</p>
            <Link to="/lost-item" className="btn btn-primary">
              <PlusCircle size={18} /> Report Lost Item
            </Link>
          </div>
        )}
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}>
          <div className="modal-content item-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewItem(null)}>
              <X size={20} />
            </button>
            <span className="badge badge-lost">LOST ITEM</span>
            <h2 className="modal-item-title">{viewItem.title}</h2>

            {viewItem.image && (
              <div className="modal-image-container">
                <img src={viewItem.image} alt={viewItem.title} className="modal-full-img" />
              </div>
            )}

            <div className="modal-meta-grid">
              <div className="modal-meta-box">
                <span className="modal-meta-label">Location</span>
                <span className="modal-meta-val">{viewItem.location}</span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Date Lost</span>
                <span className="modal-meta-val">{viewItem.date}</span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Category ID</span>
                <span className="modal-meta-val">#{viewItem.category_id}</span>
              </div>
              <div className="modal-meta-box">
                <span className="modal-meta-label">Status</span>
                <span className="modal-meta-val">{viewItem.status}</span>
              </div>
            </div>

            <div className="modal-desc-box">
              <span className="modal-meta-label">Description</span>
              <p className="modal-desc-text">{viewItem.description || "No description provided."}</p>
            </div>

            <div className="modal-action-footer">
              <button className="btn btn-secondary" onClick={() => setViewItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditItem(null)}>
              <X size={20} />
            </button>
            <h2>Edit Lost Item</h2>
            <p className="modal-subtitle">Update details for "{editItem.title}"</p>

            <form onSubmit={handleUpdate} className="edit-modal-form">
              <div className="form-group">
                <label>Item Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date Lost</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="form-control textarea-control"
                />
              </div>

              <div className="modal-action-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditItem(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <AlertCircle size={36} color="var(--accent-rose)" />
            </div>
            <h2>Delete Lost Item Report?</h2>
            <p>
              Are you sure you want to remove this report? This action cannot be reversed.
            </p>
            <div className="modal-action-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteId(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLostItems;