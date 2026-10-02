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

const PRESET_FOUND_IMAGES = [
  { name: "Blue Backpack", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" },
  { name: "Metal Water Bottle", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80" },
  { name: "Sunglasses", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80" },
  { name: "Earbuds Case", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80" },
  { name: "Car Keys", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80" },
];

const ReportFound = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to report a found item");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

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

      const res = await itemService.reportFoundItem(payload);
      toast.success(res.data.message || "Found item reported successfully!");
      navigate("/see-found-item");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit found item report"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-item-page">
      <div className="container">
        <div className="report-page-header">
          <span className="badge badge-found">Found Item Notice</span>
          <h1 className="report-main-title">Report a Found Item</h1>
          <p className="report-sub-title">
            Help an owner recover their belongings. Fill in where and when you discovered this item.
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
                    placeholder="e.g. Hydro Flask Blue Water Bottle with Stickers"
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
                  <label>Date Found <span className="req-star">*</span></label>
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
                <label>Found Location <span className="req-star">*</span></label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Science Building Lecture Hall 101"
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
                    placeholder="https://example.com/photo.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="form-control"
                  />
                </div>
                {/* Presets */}
                <div className="presets-row">
                  <span className="presets-label">Quick sample photos:</span>
                  {PRESET_FOUND_IMAGES.map((preset) => (
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
                <label>Description & Condition</label>
                <div className="input-with-icon">
                  <textarea
                    rows={4}
                    placeholder="Describe where it was placed, condition, distinguishing marks, etc."
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
                    Submitting Report...
                  </>
                ) : (
                  <>
                    Submit Found Item Report <ArrowRight size={18} />
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
                  <span className="badge badge-found preview-badge">FOUND</span>
                </div>
                <div className="preview-body">
                  <h4>{title || "Untitled Found Item"}</h4>
                  <p>{description || "Description preview will appear here..."}</p>
                  <div className="preview-meta">
                    <span><MapPin size={13} /> {location || "Location not set"}</span>
                    <span><Calendar size={13} /> {date}</span>
                  </div>
                </div>
              </div>

              <div className="help-box">
                <Info size={16} color="var(--accent-emerald)" />
                <p>
                  Found items can be deposited with Central Campus Security (Gate 1) if you prefer safe storage until claimed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;
