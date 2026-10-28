import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Users, UserRound, Phone, Star, CarFront, CheckCircle, Ban,
  ChevronDown, RotateCcw, Wallet, AlertCircle, Eye, ShieldCheck, FileText,
  MoreVertical, X, Mail, CalendarDays, Landmark, Loader2, ArrowRight,
  ShieldAlert, CheckCircle2, Clock,
} from "lucide-react";

import { adminApi } from "../services/api";
import "../styles/DriversPage.css";

function getAdminToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("adminToken") ||
    null
  );
}

const STATUS_TO_DISPLAY = {
  APPROVED: "Verified",
  PENDING:  "Pending",
  REJECTED: "Rejected",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

// =====================================================
// DROPDOWN MENU
// =====================================================
function RowMenu({ driver, onView, onKyc, onDocs, onRides, onToggleBlock }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [open]);

  return (
    <div className="driver-row-menu" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="driver-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="driver-menu-popup">
          <button type="button" onClick={() => { setOpen(false); onView(); }}>
            <Eye size={14} /> View details
          </button>
          <button type="button" onClick={() => { setOpen(false); onKyc(); }}>
            <ShieldCheck size={14} /> Go to KYC
          </button>
          <button type="button" onClick={() => { setOpen(false); onDocs(); }}>
            <FileText size={14} /> Documents
          </button>
          <button type="button" onClick={() => { setOpen(false); onRides(); }}>
            <CarFront size={14} /> View rides
          </button>
          <div className="driver-menu-divider" />
          {driver.is_blocked ? (
            <button
              type="button"
              className="driver-menu-success"
              onClick={() => { setOpen(false); onToggleBlock(false); }}
            >
              <CheckCircle2 size={14} /> Unblock driver
            </button>
          ) : (
            <button
              type="button"
              className="driver-menu-danger"
              onClick={() => { setOpen(false); onToggleBlock(true); }}
            >
              <Ban size={14} /> Block driver
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// DRAWER (right side)
// =====================================================
function DriverDrawer({ open, driverId, onClose, onToggleBlock, navigate }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !driverId) return;
    const token = getAdminToken();
    if (!token) return;

    setLoading(true);
    setDetail(null);
    adminApi.getKycDetail(token, driverId)
      .then((res) => setDetail(res?.success ? res.data : null))
      .catch((e) => console.error("Drawer detail error:", e.message))
      .finally(() => setLoading(false));
  }, [open, driverId]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const d = detail?.driver || null;
  const v = detail?.vehicle || null;
  const b = detail?.bank || null;

  return (
    <>
      <div className="driver-drawer-backdrop" onClick={onClose} />
      <aside className="driver-drawer">
        <div className="driver-drawer-head">
          <h2>Driver Details</h2>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        {loading ? (
          <div className="driver-drawer-loading">
            <Loader2 size={26} className="kyc-spin" />
          </div>
        ) : !d ? (
          <div className="driver-drawer-loading">Failed to load driver.</div>
        ) : (
          <div className="driver-drawer-body">
            <div className="driver-drawer-profile">
              <div className="driver-drawer-avatar">
                {d.profile_image ? (
                  <img src={d.profile_image} alt={d.full_name} onError={(e) => (e.target.style.display = "none")} />
                ) : (
                  <UserRound size={30} />
                )}
              </div>
              <div>
                <h3>{d.full_name}</h3>
                <p>
                  <Star size={12} /> {(d.rating ?? 0).toFixed(1)} ·{" "}
                  <CarFront size={12} /> {d.total_rides ?? 0} rides
                </p>
              </div>
            </div>

            <div className="driver-drawer-fields">
              <div><Phone size={14} /><span>{d.phone || "—"}</span></div>
              <div><Mail size={14} /><span>{d.email || "—"}</span></div>
              <div><CalendarDays size={14} /><span>Joined {formatDate(d.created_at)}</span></div>
            </div>

            <div className="driver-drawer-badges">
              <span className={`driver-status ${d.is_online ? "driver-status-online" : "driver-status-offline"}`}>
                <span className="driver-status-dot" />
                {d.is_online ? "Online" : "Offline"}
              </span>
              <span className="driver-badge">
                {STATUS_TO_DISPLAY[d.verification_status] || "Pending"}
              </span>
              {d.is_blocked && (
                <span className="driver-badge driver-badge-danger">
                  <Ban size={11} /> Blocked
                </span>
              )}
            </div>

            {v && (
              <div className="driver-drawer-section">
                <h4><CarFront size={14} /> Vehicle</h4>
                <div className="driver-drawer-info-grid">
                  <div><span>Type</span><strong>{v.vehicle_type || "—"}</strong></div>
                  <div><span>Number</span><strong>{v.vehicle_number || "—"}</strong></div>
                  <div><span>Model</span><strong>{v.vehicle_model || "—"}</strong></div>
                  <div><span>Color</span><strong>{v.vehicle_color || "—"}</strong></div>
                  <div><span>Verified</span><strong>{v.is_verified ? "Yes" : "No"}</strong></div>
                </div>
              </div>
            )}

            {b && (
              <div className="driver-drawer-section">
                <h4><Landmark size={14} /> Bank</h4>
                <div className="driver-drawer-info-grid">
                  <div><span>Holder</span><strong>{b.account_holder_name || "—"}</strong></div>
                  <div><span>Bank</span><strong>{b.bank_name || "—"}</strong></div>
                  <div><span>Account</span><strong>{b.account_number || "—"}</strong></div>
                  <div><span>IFSC</span><strong>{b.ifsc_code || "—"}</strong></div>
                  <div><span>Status</span><strong>{b.verification_status || "PENDING"}</strong></div>
                </div>
              </div>
            )}

            <div className="driver-drawer-actions">
              <button
                type="button"
                className="driver-drawer-action-btn"
                onClick={() => navigate("/admin/drivers/kyc")}
              >
                <ShieldCheck size={14} /> KYC
              </button>
              <button
                type="button"
                className="driver-drawer-action-btn"
                onClick={() => navigate(`/admin/drivers/${d.driver_id}/documents`, { state: { from: "kyc" } })}
              >
                <FileText size={14} /> Documents
              </button>
              <button
                type="button"
                className="driver-drawer-action-btn"
                onClick={() => navigate("/admin/rides")}
              >
                <CarFront size={14} /> Rides
              </button>
            </div>

            <button
              type="button"
              className={`driver-drawer-block-btn ${d.is_blocked ? "unblock" : "block"}`}
              onClick={() => onToggleBlock(d.driver_id, !d.is_blocked)}
            >
              {d.is_blocked ? (
                <><CheckCircle2 size={15} /> Unblock Driver</>
              ) : (
                <><Ban size={15} /> Block Driver</>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function DriversPage() {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [actionLoading, setActionLoading] = useState(null);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDriverId, setDrawerDriverId] = useState(null);

  const token = getAdminToken();
  const rowsPerPage = 8;

  // ---------------------------------------------------
  // LOAD
  // ---------------------------------------------------
  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getDrivers(token, { search });
      if (res?.success) setDrivers(res.data || []);
      else { setError(res?.message || "Failed to load drivers"); setDrivers([]); }
    } catch (err) {
      setDrivers([]);
      setError(err.message || "Unable to load drivers.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadDrivers(), 300);
    return () => clearTimeout(timer);
  }, [loadDrivers]);

  // ---------------------------------------------------
  // BLOCK/UNBLOCK
  // ---------------------------------------------------
  const handleToggleBlock = async (driverId, blockNext) => {
    const action = blockNext ? "block" : "unblock";
    if (!window.confirm(`Are you sure you want to ${action} this driver?`)) return;

    setActionLoading(driverId);
    try {
      const res = await adminApi.toggleDriverBlock(token, driverId, blockNext);
      if (res?.success) {
        setNoticeType("success");
        setNotice(`Driver ${action}ed successfully.`);
        setDrivers((prev) =>
          prev.map((d) =>
            d.driver_id === driverId
              ? { ...d, is_blocked: blockNext, is_online: blockNext ? false : d.is_online }
              : d
          )
        );
        if (drawerDriverId === driverId) {
          // refresh drawer
          setDrawerDriverId(null);
          setTimeout(() => setDrawerDriverId(driverId), 50);
        }
      } else {
        setNoticeType("error");
        setNotice(res?.message || "Failed to update");
      }
    } catch (e) {
      setNoticeType("error");
      setNotice(e.message || "Failed to update");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------
  // FILTERS
  // ---------------------------------------------------
  const filteredDrivers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.filter((d) => {
      const matchesSearch =
        String(d.name || "").toLowerCase().includes(q) ||
        String(d.phone || "").toLowerCase().includes(q) ||
        String(d.email || "").toLowerCase().includes(q) ||
        String(d.driver_id).includes(q);

      const matchesOnline =
        statusFilter === "All Status" ||
        (statusFilter === "Online" && d.is_online) ||
        (statusFilter === "Offline" && !d.is_online);

      const matchesVerification =
        verificationFilter === "All" ||
        (d.verification_status || "PENDING") === verificationFilter;

      return matchesSearch && matchesOnline && matchesVerification;
    });
  }, [drivers, search, statusFilter, verificationFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const displayedDrivers = filteredDrivers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const onlineCount = drivers.filter((d) => d.is_online).length;
  const verifiedCount = drivers.filter((d) => d.verification_status === "APPROVED").length;
  const pendingKycCount = drivers.filter((d) => (d.verification_status || "PENDING") === "PENDING").length;
  const averageRating = drivers.length
    ? (drivers.reduce((sum, d) => sum + Number(d.rating || 0), 0) / drivers.length).toFixed(1)
    : "0.0";
  const totalRides = drivers.reduce((sum, d) => sum + Number(d.total_rides || 0), 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setVerificationFilter("All");
    setCurrentPage(1);
    setNotice("");
    setError("");
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <div className="drivers-page">
      <header className="drivers-page-header">
        <div>
          <span className="drivers-eyebrow">FLEET MANAGEMENT</span>
          <h1>Driver Management</h1>
          <p>Manage driver accounts, verification and activity.</p>
        </div>
        <div className="drivers-header-icon">
          <Users size={23} />
        </div>
      </header>

      {/* STATS */}
      <div className="drivers-summary">
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-yellow"><Users size={20} /></div>
          <div><span>Total Drivers</span><strong>{drivers.length}</strong></div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-green"><CheckCircle size={20} /></div>
          <div><span>Online Drivers</span><strong>{onlineCount}</strong></div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-blue"><ShieldCheck size={20} /></div>
          <div><span>Verified</span><strong>{verifiedCount}</strong></div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-orange"><Clock size={20} /></div>
          <div><span>Pending KYC</span><strong>{pendingKycCount}</strong></div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-gray"><Star size={20} /></div>
          <div><span>Avg Rating</span><strong>{averageRating} <small>★</small></strong></div>
        </div>
      </div>

      {/* TOTAL RIDES BANNER */}
      <section className="driver-earnings-summary">
        <div className="driver-earnings-heading">
          <div className="flex">
            <div className="driver-earnings-icon"><Wallet size={22} /></div>
            <div>
              <h2>Total Completed Rides</h2>
              <p>Across all drivers on the platform</p>
            </div>
          </div>
          <div className="driver-earnings-values">
            <div><span>Total Rides</span><strong>{totalRides}</strong></div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="drivers-card">
        <div className="drivers-card-heading">
          <div>
            <h2>All Drivers</h2>
            <p>Review driver performance and account status.</p>
          </div>
          <span className="drivers-count">{filteredDrivers.length} drivers</span>
        </div>

        {/* TOOLBAR */}
        <div className="drivers-toolbar">
          <label className="drivers-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by name, phone, email or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); setNotice(""); }}
            />
          </label>

          <label className="drivers-status-select">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option>All Status</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <label className="drivers-status-select">
            <select
              value={verificationFilter}
              onChange={(e) => { setVerificationFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Verification</option>
              <option value="APPROVED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <button type="button" className="drivers-reset-button" onClick={resetFilters}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        {error && (
          <div className="drivers-notice" style={{ background: "#FEE2E2", color: "#991B1B" }}>
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        {notice && (
          <div
            className="drivers-notice"
            role="status"
            style={{
              background: noticeType === "error" ? "#FEE2E2" : "#ECFDF5",
              color: noticeType === "error" ? "#991B1B" : "#065F46",
            }}
          >
            {noticeType === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")}>×</button>
          </div>
        )}

        <div className="drivers-table-wrapper">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Driver</th>
                <th>Contact</th>
                <th>Vehicle</th>
                <th>Rating</th>
                <th>Rides</th>
                <th>Verification</th>
                <th>Status</th>
                <th className="driver-action-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && drivers.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="drivers-empty-state">
                      <Loader2 size={27} className="kyc-spin" />
                      <span>Loading drivers...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="drivers-empty-state">
                      <Users size={28} />
                      <strong>No drivers found</strong>
                      <span>Try changing your search or filters.</span>
                      <button type="button" onClick={resetFilters}>Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedDrivers.map((driver, index) => {
                  const isBlocked = Boolean(driver.is_blocked);
                  const verStatus = STATUS_TO_DISPLAY[driver.verification_status] || "Pending";
                  return (
                    <tr
                      key={driver.driver_id}
                      onClick={() => { setDrawerDriverId(driver.driver_id); setDrawerOpen(true); }}
                    >
                      <td className="driver-row-number">
                        {(safePage - 1) * rowsPerPage + index + 1}
                      </td>

                      <td>
                        <div className="driver-name-cell">
                          <div className="driver-avatar">
                            <UserRound size={17} />
                          </div>
                          <div>
                            <span>{driver.name}</span>
                            <small>#{driver.driver_id}</small>
                            {isBlocked && (
                              <span className="driver-badge-inline driver-badge-danger">
                                <Ban size={10} /> Blocked
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="driver-contact-stack">
                          <span><Phone size={12} /> {driver.phone || "—"}</span>
                          <span><Mail size={12} /> {driver.email || "—"}</span>
                        </div>
                      </td>

                      <td>
                        {driver.vehicle_type ? (
                          <div className="driver-vehicle-stack">
                            <span><CarFront size={12} /> {driver.vehicle_type}</span>
                            <small>{driver.vehicle_number || "—"}</small>
                          </div>
                        ) : (
                          <span className="driver-muted">—</span>
                        )}
                      </td>

                      <td>
                        <span className="driver-rating">
                          {Number(driver.rating || 0).toFixed(1)}
                          <Star size={12} fill="currentColor" />
                        </span>
                      </td>

                      <td>
                        <span className="driver-rides">
                          <CarFront size={13} />
                          {driver.total_rides || 0}
                        </span>
                      </td>

                      <td>
                        <span className={`driver-verify-badge driver-verify-${verStatus.toLowerCase()}`}>
                          {verStatus}
                        </span>
                      </td>

                      <td>
                        <span className={`driver-status ${driver.is_online ? "driver-status-online" : "driver-status-offline"}`}>
                          <span className="driver-status-dot" />
                          {driver.is_online ? "Online" : "Offline"}
                        </span>
                      </td>

                      <td onClick={(e) => e.stopPropagation()}>
                        <RowMenu
                          driver={driver}
                          onView={() => { setDrawerDriverId(driver.driver_id); setDrawerOpen(true); }}
                          onKyc={() => navigate("/admin/drivers/kyc")}
                          onDocs={() => navigate(`/admin/drivers/${driver.driver_id}/documents`, { state: { from: "kyc" } })}
                          onRides={() => navigate("/admin/rides")}
                          onToggleBlock={(next) => handleToggleBlock(driver.driver_id, next)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="drivers-table-footer">
          <span>
            Showing {filteredDrivers.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1} –{" "}
            {Math.min(safePage * rowsPerPage, filteredDrivers.length)} of {filteredDrivers.length} drivers
          </span>
          <div className="drivers-pagination">
            <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
            <span>{safePage} / {totalPages}</span>
            <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
          </div>
        </footer>
      </section>

      {/* DRAWER */}
      <DriverDrawer
        open={drawerOpen}
        driverId={drawerDriverId}
        onClose={() => { setDrawerOpen(false); setDrawerDriverId(null); }}
        onToggleBlock={(id, next) => handleToggleBlock(id, next)}
        navigate={navigate}
      />
    </div>
  );
}