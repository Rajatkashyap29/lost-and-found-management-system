import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, Eye, EyeOff, Search, ArrowRight } from "lucide-react";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in both email and password");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success(res.data.message || "Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Unexpected login error");
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your lost & found reports</p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label>Campus Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                Signing In...
              </>
            ) : (
              <>
                Sign In to Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer-prompt">
          Don't have an account yet?{" "}
          <Link to="/register" className="auth-inline-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
