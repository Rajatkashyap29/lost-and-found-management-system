import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  Hash,
  Eye,
  EyeOff,
  Search,
  ArrowRight,
} from "lucide-react";
import "./Auth.css";

const Register = () => {
  const [erpId, setErpId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!erpId || !name || !email || !password) {
      toast.warning("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      return;
    }

    if (name.trim().length < 3) {
      toast.warning("Name must be at least 3 characters");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        erp_id: Number(erpId),
        name: name.trim(),
        email: email.trim(),
        password,
        phone_number: phoneNumber.trim() || null,
      };

      const res = await register(payload);
      if (res.success) {
        toast.success(res.data.message || "Registration successful! Please sign in.");
        navigate("/login");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Registration failed. Please verify your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container glass-panel">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Search size={22} className="auth-logo-icon" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join FindIt to report and recover campus items</p>
        </div>

        {/* Register Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* ERP ID */}
          <div className="form-group">
            <label>ERP / Student ID <span className="req-star">*</span></label>
            <div className="input-with-icon">
              <Hash size={18} className="input-icon" />
              <input
                type="number"
                placeholder="e.g. 102938"
                value={erpId}
                onChange={(e) => setErpId(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <small className="field-hint">Your unique university identification number</small>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name <span className="req-star">*</span></label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
                className="form-control"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Campus Email <span className="req-star">*</span></label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="alex.morgan@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password <span className="req-star">*</span></label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="form-control"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <small className="field-hint">Must be 8 to 50 characters</small>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                placeholder="e.g. +1 555-019-2834"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18 }} />
                Registering Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer-prompt">
          Already registered?{" "}
          <Link to="/login" className="auth-inline-link">
            Log in to account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;