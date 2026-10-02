import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { claimService, getErrorMessage } from "../api";
import {
  FileCheck2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
} from "lucide-react";
import "./UserItems.css";

const MyClaims = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const res = await claimService.getMyClaims(page, limit);
      const list = res.data?.claims || [];
      setClaims(list);
      setHasMore(list.length === limit);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setClaims([]);
      } else {
        toast.error(getErrorMessage(err, "Failed to load claims"));
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, toast]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleDeleteClaim = async (claimId) => {
    try {
      setDeletingId(claimId);
      await claimService.deleteClaim(claimId);
      toast.success("Claim removed successfully");
      fetchClaims();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel claim"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="user-items-page">
      <div className="container">
        {/* Header */}
        <div className="user-items-header">
          <div>
            <span className="badge badge-pending">Ownership Tracking</span>
            <h1 className="user-items-title">My Item Claims</h1>
            <p className="user-items-subtitle">
              Monitor the approval status of claims you've made for items found by others.
            </p>
          </div>
          <Link to="/items?type=FOUND" className="btn btn-secondary">
            <Layers size={18} /> Browse Found Items
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state-box">
            <div className="spinner" />
            <p>Loading your claims...</p>
          </div>
        ) : claims.length > 0 ? (
          <>
            <div className="claims-table-card glass-panel">
              <div className="claims-grid-header">
                <span>Claim ID</span>
                <span>Found Item ID</span>
                <span>Status</span>
                <span>Verification State</span>
                <span className="text-right">Action</span>
              </div>

              <div className="claims-rows-list">
                {claims.map((claim) => (
                  <div key={claim.id} className="claims-grid-row">
                    <span className="claim-id-text">#{claim.id}</span>
                    <span className="claim-item-ref">
                      Item #{claim.item_id}{" "}
                      <Link to={`/items?id=${claim.item_id}`} className="view-item-link" title="Inspect Item">
                        <ExternalLink size={13} />
                      </Link>
                    </span>

                    <span>
                      <span
                        className={`badge ${
                          claim.status === "ACCEPTED"
                            ? "badge-accepted"
                            : claim.status === "REJECTED"
                            ? "badge-rejected"
                            : "badge-pending"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </span>

                    <span className="claim-state-desc">
                      {claim.status === "ACCEPTED" && (
                        <span className="text-emerald">
                          <CheckCircle2 size={14} /> Approved by finder. Handover arranged!
                        </span>
                      )}
                      {claim.status === "REJECTED" && (
                        <span className="text-rose">
                          <XCircle size={14} /> Rejected or verification failed.
                        </span>
                      )}
                      {claim.status === "PENDING" && (
                        <span className="text-amber">
                          <Clock size={14} /> Awaiting finder review & verification.
                        </span>
                      )}
                    </span>

                    <div className="text-right">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClaim(claim.id)}
                        disabled={deletingId === claim.id}
                        title="Withdraw Claim"
                      >
                        <Trash2 size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
              <FileCheck2 size={36} />
            </div>
            <h3>No active claims</h3>
            <p>You haven't claimed any found items yet. Explore the campus found directory if you lost something.</p>
            <Link to="/items?type=FOUND" className="btn btn-primary">
              Browse Found Directory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims;
