import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { itemService, getErrorMessage } from "../api";
import {
  Package,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Tag,
  ArrowRight,
  Info,
} from "lucide-react";
import "./ReportItem.css";

// Sample preset images to make testing easy
const PRESET_IMAGES = [
  { name: "Black Laptop", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80" },
  { name: "Leather Wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80" },
  { name: "Keyring & Fob", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80" },
  { name: "Campus Backpack", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" },
  { name: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
];

const ReportLost = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Require auth
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to report a lost item");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingCats(true);
        const res = await itemService.getCategories();
        const catList = res.data?.category || res.data?.categories || [];
        if (Array.isArray(catList)) {
          setCategories(catList);
        }
      } catch (err) {
        console.warn("Failed to load categories:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !categoryId || !location.trim() || !date) {
      toast.warning("Please fill in all mandatory fields");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        category_id: Number(categoryId),
        location: location.trim(),
        date,
        image: image.trim() || null,
      };

      const res = await itemService.reportLostItem(payload);
      toast.success(res.data.message || "Lost item reported successfully!");
      navigate("/see-lost-item");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit lost item report"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-item-page">
      <div className="container">
        <div className="report-page-header">
          <span className="badge badge-lost">Lost Item Notice</span>
          <h1 className="report-main-title">Report a Lost Item</h1>
          <p className="report-sub-title">
            Provide details of the item you misplaced. Your report will be broadcast to the campus lost & found network.
          </p>
        </div>

        <div className="report-grid-container">
          {/* Form */}
          <div className="report-form-card glass-panel">
            <form onSubmit={handleSubmit} className="item-form">
              {/* Title */}
              <div className="form-group">
                <label>Item Name / Title <span className="req-star">*</span></label>
                <div className="input-with-icon">
                  <Package size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Silver MacBook Air M2 in Black Sleeve"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
              </div>

              {/* Category & Date Grid */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Category <span className="req-star">*</span></label>
                  <div className="input-with-icon">
                    <Tag size={18} className="input-icon" />
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="form-control"
                      disabled={loadingCats}
                    >
                      <option value="">
                        {loadingCats ? "Loading categories..." : "Select Category"}
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Date Lost <span className="req-star">*</span></label>
                  <div className="input-with-icon">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label>Last Seen Location <span className="req-star">*</span></label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Library 2nd Floor Study Room B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label>Photo URL (Optional)</label>
                <div className="input-with-icon">
                  <ImageIcon size={18} className="input-icon" />
                  <input
                    type="url"
                    placeholder="https://example.com/item-photo.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="form-control"
                  />
                </div>
                {/* Presets */}
                <div className="presets-row">
                  <span className="presets-label">Quick sample photos:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="preset-btn"
                      onClick={() => setImage(preset.url)}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Detailed Description</label>
                <div className="input-with-icon">
                  <textarea
                    rows={4}
                    placeholder="Describe distinguishing marks, stickers, color, model number, brand, contents inside, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control textarea-control"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18 }} />
                    Publishing Report...
                  </>
                ) : (
                  <>
                    Publish Lost Item Report <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="report-preview-sidebar">
            <div className="preview-sticky-box glass-panel">
              <span className="preview-label">Live Preview</span>
              <div className="preview-card">
                <div className="preview-thumb">
                  {image ? (
                    <img src={image} alt="Preview" className="preview-img" />
                  ) : (
                    <div className="preview-no-img">
                      <ImageIcon size={36} color="var(--text-dim)" />
                      <span>Photo preview will show here</span>
                    </div>
                  )}
                  <span className="badge badge-lost preview-badge">LOST</span>
                </div>
                <div className="preview-body">
                  <h4>{title || "Untitled Lost Item"}</h4>
                  <p>{description || "Description preview will appear here..."}</p>
                  <div className="preview-meta">
                    <span><MapPin size={13} /> {location || "Location not set"}</span>
                    <span><Calendar size={13} /> {date}</span>
                  </div>
                </div>
              </div>

              <div className="help-box">
                <Info size={16} color="var(--primary)" />
                <p>
                  Providing accurate locations and specific details increases recovery chances by over 75%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;