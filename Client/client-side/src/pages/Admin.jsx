import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { adminService, getErrorMessage } from "../api";
import {
  Shield,
  Users,
  Package,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Admin.css";

const Admin = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users"); // "users" | "items" | "claims"
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === "users") {
        res = await adminService.getUsers(page, limit);
        setData(res.data?.users || []);
        setHasMore((res.data?.users || []).length === limit);
      } else if (activeTab === "items") {
        res = await adminService.getItems(page, limit);
        setData(res.data?.items || []);
        setHasMore((res.data?.items || []).length === limit);
      } else if (activeTab === "claims") {
        res = await adminService.getClaims(page, limit);
        setData(res.data?.claims || []);
        setHasMore((res.data?.claims || []).length === limit);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to load admin ${activeTab}`));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, fetchData]);

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header glass-panel">
          <div className="admin-header-title">
            <div className="admin-badge-icon">
              <Shield size={28} />
            </div>
            <div>
              <span className="badge badge-active">Admin Operations</span>
              <h1>Platform Control Center</h1>
              <p>Manage all campus users, reported items, and ownership claims.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("users");
                setPage(1);
              }}
            >
              <Users size={16} /> Campus Users
            </button>
            <button
              className={`admin-tab-btn ${activeTab === "items" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("items");
                setPage(1);
              }}
            >
              <Package size={16} /> All Items
            </button>
            <button
              className={`admin-tab-btn ${activeTab === "claims" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("claims");
                setPage(1);
              }}
            >
              <FileCheck2 size={16} /> All Claims
            </button>
          </div>
        </div>

        {/* Tab Content Table */}
        <div className="admin-table-card glass-panel">
          {loading ? (
            <div className="loading-state-box">
              <div className="spinner" />
              <p>Loading admin records...</p>
            </div>
          ) : data.length > 0 ? (
            <>
              {activeTab === "users" && (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>ERP ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td>
                            <strong>{u.erp_id}</strong>
                          </td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.phone_number || "—"}</td>
                          <td>
                            <span className={`badge ${u.role === "ADMIN" ? "badge-pending" : "badge-active"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className="status-dot online" style={{ marginRight: 6 }} />
                            {u.is_active ? "Active" : "Inactive"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "items" && (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((i) => (
                        <tr key={i.id}>
                          <td>#{i.id}</td>
                          <td>
                            <span className={`badge ${i.item_type === "LOST" ? "badge-lost" : "badge-found"}`}>
                              {i.item_type}
                            </span>
                          </td>
                          <td>
                            <strong>{i.title}</strong>
                          </td>
                          <td>{i.location}</td>
                          <td>{i.date}</td>
                          <td>Cat #{i.category_id}</td>
                          <td>
                            <span className="badge badge-active">{i.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "claims" && (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Claim ID</th>
                        <th>Item ID</th>
                        <th>Claimant User ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((c) => (
                        <tr key={c.id}>
                          <td>#{c.id}</td>
                          <td>Item #{c.item_id}</td>
                          <td>User #{c.user_id}</td>
                          <td>
                            <span
                              className={`badge ${
                                c.status === "ACCEPTED"
                                  ? "badge-accepted"
                                  : c.status === "REJECTED"
                                  ? "badge-rejected"
                                  : "badge-pending"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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
              <h3>No records found</h3>
              <p>There are no entries under this administrative section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
