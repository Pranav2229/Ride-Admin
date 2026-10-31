

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  RotateCcw,
  Loader2,
  AlertCircle,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Landmark,
  Star,
  Car,
} from "lucide-react";

import { adminApi } from "../services/api";
import "../styles/DriverKYCPage.css";

// =====================================================
// TOKEN
// =====================================================
function getAdminToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("adminToken") ||
    null
  );
}

const TAB_TO_API = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

// =====================================================
// HELPERS
// =====================================================
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function statusToDisplay(s) {
  if (s === "PENDING") return "Pending";
  if (s === "APPROVED" || s === "VERIFIED") return "Verified";
  if (s === "REJECTED") return "Rejected";
  return "Pending";
}

// Compute a section-level status from getDriverDocuments or getKycDetail data
function computeDocSectionStatus(docResponse) {
  const counts = docResponse?.counts;
  if (!counts) return { status: "PENDING", verified: 0, pending: 0, rejected: 0, total: 8 };
  if (counts.rejected > 0) return { status: "REJECTED", ...counts };
  if (counts.pending === 0 && counts.verified === counts.total) {
    return { status: "VERIFIED", ...counts };
  }
  return { status: "PENDING", ...counts };
}

function computeVehicleStatus(vehicle) {
  if (!vehicle) return "PENDING";
  if (vehicle.is_verified) return "VERIFIED";
  if (vehicle.rejection_reason) return "REJECTED";
  return "PENDING";
}

function computeBankStatus(bank) {
  if (!bank) return "PENDING";
  const s = (bank.verification_status || "").toUpperCase();
  if (s === "APPROVED" || s === "VERIFIED") return "VERIFIED";
  if (s === "REJECTED") return "REJECTED";
  return "PENDING";
}

// =====================================================
// COMPONENT
// =====================================================
export default function DriverKYCPage() {
  const navigate = useNavigate();

  // ---- List state
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ---- Detail state
  const [detail, setDetail] = useState(null); // from getKycDetail
  const [docDetail, setDocDetail] = useState(null); // from getDriverDocuments
  const [activeSection, setActiveSection] = useState("documents");

  // ---- UI state
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ---- Reject modal state
  const [rejectModal, setRejectModal] = useState(null);
  // { scope: 'full' | 'vehicle' | 'bank', driverId, reason: '' }

  // =====================================================
  // LOADERS
  // =====================================================
  const loadStats = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return setError("Not authenticated.");
    setLoadingStats(true);
    try {
      const res = await adminApi.getKycStats(token);
      if (res?.success) setStats(res.data);
    } catch (e) {
      console.error("loadStats error:", e.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadList = useCallback(async (tab) => {
    const token = getAdminToken();
    if (!token) return setError("Not authenticated.");

    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getKycList(token, {
        status: TAB_TO_API[tab],
        limit: 100,
        offset: 0,
      });
      if (res?.success) {
        setApplications(res.data || []);
        setSelectedId(res.data?.[0]?.driver_id ?? null);
      } else {
        setError(res?.message || "Failed to load list");
        setApplications([]);
      }
    } catch (e) {
      console.error("loadList error:", e.message);
      setError(e.message || "Unable to load KYC applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (driverId) => {
    const token = getAdminToken();
    if (!token || !driverId) return;

    setLoadingDetail(true);
    setDetail(null);
    setDocDetail(null);

    try {
      const [detailRes, docsRes] = await Promise.all([
        adminApi.getKycDetail(token, driverId),
        adminApi.getDriverDocuments(token, driverId),
      ]);

      if (detailRes?.success) setDetail(detailRes.data);
      if (docsRes?.success) setDocDetail(docsRes.data);
    } catch (e) {
      console.error("loadDetail error:", e.message);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList(activeTab);
  }, [activeTab, loadList]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  // =====================================================
  // LIST FILTERS
  // =====================================================
  const filteredApplications = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return applications;
    return applications.filter(
      (a) =>
        a.name?.toLowerCase().includes(s) ||
        a.phone?.toLowerCase().includes(s) ||
        a.email?.toLowerCase().includes(s)
    );
  }, [applications, searchTerm]);

  const selectedDriver =
    applications.find((a) => a.driver_id === selectedId) ||
    filteredApplications[0] ||
    null;

  // =====================================================
  // DERIVED SECTIONS (from detail + docDetail)
  // =====================================================
  const vehicle = detail?.vehicle || null;
  const bank = detail?.bank || null;

  const docSection = computeDocSectionStatus(docDetail);
  const vehicleStatus = computeVehicleStatus(vehicle);
  const bankStatus = computeBankStatus(bank);

  const allVerified =
    docSection.status === "VERIFIED" &&
    vehicleStatus === "VERIFIED" &&
    bankStatus === "VERIFIED";

  const hasRejected =
    docSection.status === "REJECTED" ||
    vehicleStatus === "REJECTED" ||
    bankStatus === "REJECTED";

  // =====================================================
  // ACTIONS
  // =====================================================
  const flash = (msg, type = "success") => {
    setNotice(msg);
    setNoticeType(type);
  };

  const refreshAll = async () => {
    await Promise.all([loadStats(), loadList(activeTab), loadDetail(selectedId)]);
  };

  // Overall approve
  const approveFullKyc = async () => {
    if (!selectedDriver) return;
    const warn = !allVerified
      ? "\n\n⚠️ Some sections are NOT verified yet. Approving will bulk-approve ALL sections including pending documents.\n\nContinue?"
      : "";
    if (!window.confirm(`Approve this driver's full KYC?${warn}`)) return;

    setActionLoading("full");
    try {
      const token = getAdminToken();
      const res = await adminApi.approveKyc(token, selectedDriver.driver_id);
      if (res?.success) {
        flash("Full KYC approved.");
        await refreshAll();
      } else {
        flash(res?.message || "Approval failed", "error");
      }
    } catch (e) {
      flash(e.message || "Failed to approve", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Overall reject → open modal
  const openRejectFullModal = () => {
    if (!selectedDriver) return;
    setRejectModal({ scope: "full", driverId: selectedDriver.driver_id, reason: "" });
  };

  // Section approve
  const approveSection = async (section) => {
    if (!selectedDriver) return;
    if (!window.confirm(`Verify ${section}?`)) return;

    setActionLoading(section);
    try {
      const token = getAdminToken();
      const res = await adminApi.updateKycSection(
        token,
        selectedDriver.driver_id,
        section,
        "VERIFIED",
        null
      );
      if (res?.success) {
        flash(`${section} verified.`);
        await refreshAll();
      } else {
        flash(res?.message || "Failed", "error");
      }
    } catch (e) {
      flash(e.message || "Failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Section reject → open modal
  const openRejectSectionModal = (section) => {
    if (!selectedDriver) return;
    setRejectModal({ scope: section, driverId: selectedDriver.driver_id, reason: "" });
  };

  // Submit reject (from modal)
  const submitReject = async () => {
    const r = rejectModal;
    if (!r) return;
    const reason = r.reason.trim();
    if (reason.length < 5) {
      flash("Reason must be at least 5 characters.", "error");
      return;
    }

    setActionLoading(r.scope);
    try {
      const token = getAdminToken();
      let res;
      if (r.scope === "full") {
        res = await adminApi.rejectKyc(token, r.driverId, reason);
      } else {
        res = await adminApi.updateKycSection(token, r.driverId, r.scope, "REJECTED", reason);
      }

      if (res?.success) {
        flash(
          r.scope === "full" ? "Full KYC rejected." : `${r.scope} rejected.`
        );
        setRejectModal(null);
        await refreshAll();
      } else {
        flash(res?.message || "Failed", "error");
      }
    } catch (e) {
      flash(e.message || "Failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Navigate to docs page
  const goToDocuments = () => {
    if (!selectedDriver) return;
    navigate(`/admin/drivers/${selectedDriver.driver_id}/documents`, {
      state: { from: "kyc" },
    });
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="driver-kyc-page">
      <header className="driver-kyc-header">
        <div>
          <span className="driver-kyc-eyebrow">VERIFICATION CENTER</span>
          <h1>Driver KYC Review</h1>
          <p>Review and verify driver applications.</p>
        </div>
        <div className="driver-kyc-header-icon">
          <FileText size={23} />
        </div>
      </header>

      {/* SUMMARY */}
      <div className="driver-kyc-summary">
        <div className="kyc-summary-card">
          <span>Pending Review</span>
          <strong>{loadingStats ? "…" : stats.pending}</strong>
          <Clock size={19} />
        </div>
        <div className="kyc-summary-card">
          <span>Approved Applications</span>
          <strong>{loadingStats ? "…" : stats.approved}</strong>
          <CheckCircle size={19} />
        </div>
        <div className="kyc-summary-card">
          <span>Rejected Applications</span>
          <strong>{loadingStats ? "…" : stats.rejected}</strong>
          <XCircle size={19} />
        </div>
      </div>

      <div className="driver-kyc-layout">
        {/* ================= LEFT — LIST ================= */}
        <section className="driver-kyc-card">
          <div className="driver-kyc-tabs">
            {["Pending", "Approved", "Rejected"].map((tab) => {
              const count =
                tab === "Pending"
                  ? stats.pending
                  : tab === "Approved"
                    ? stats.approved
                    : stats.rejected;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`driver-kyc-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchTerm("");
                    setNotice("");
                    setError("");
                  }}
                >
                  {tab} <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="driver-kyc-toolbar">
            <label className="driver-kyc-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search driver name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="driver-kyc-reset"
              onClick={() => {
                setSearchTerm("");
                setNotice("");
                setError("");
              }}
              aria-label="Reset search"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {notice && (
            <div
              className="driver-kyc-notice"
              role="status"
              style={{
                background: noticeType === "error" ? "#FEE2E2" : "#ECFDF5",
                color: noticeType === "error" ? "#991B1B" : "#065F46",
              }}
            >
              {noticeType === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")}>×</button>
            </div>
          )}

          {error && (
            <div className="driver-kyc-notice" style={{ background: "#FEE2E2", color: "#991B1B" }}>
              <AlertCircle size={15} />
              <span>{error}</span>
              <button type="button" onClick={() => setError("")}>×</button>
            </div>
          )}

          <div className="driver-kyc-table-wrap">
            <table className="driver-kyc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver Name</th>
                  <th>Phone</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="kyc-empty-state">
                        <Loader2 size={27} className="kyc-spin" />
                        <strong>Loading applications…</strong>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((driver, index) => {
                    const displayStatus = statusToDisplay(driver.status);
                    return (
                      <tr
                        key={driver.driver_id}
                        className={
                          selectedDriver?.driver_id === driver.driver_id
                            ? "kyc-selected-row"
                            : ""
                        }
                        onClick={() => setSelectedId(driver.driver_id)}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <button
                            type="button"
                            className="kyc-driver-name"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(driver.driver_id);
                            }}
                          >
                            <span className="kyc-mini-avatar">
                              <UserRound size={15} />
                            </span>
                            {driver.name || "—"}
                          </button>
                        </td>
                        <td>{driver.phone || "—"}</td>
                        <td>
                          <span className="kyc-document-count">
                            <FileText size={13} />
                            {driver.documents_submitted || "0/8"}
                          </span>
                        </td>
                        <td>
                          <span className={`kyc-status kyc-status-${displayStatus.toLowerCase()}`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="kyc-view-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(driver.driver_id);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
                {!loading && filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="kyc-empty-state">
                        <FileText size={27} />
                        <strong>No {activeTab.toLowerCase()} applications</strong>
                        <span>Try another tab or change your search.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="driver-kyc-table-footer">
            Showing {filteredApplications.length} {activeTab.toLowerCase()} applications
          </div>
        </section>

        {/* ================= RIGHT — DETAIL ================= */}
        <aside className="driver-kyc-profile">
          {!selectedDriver ? (
            <div className="kyc-empty-state" style={{ padding: 30 }}>
              <UserRound size={27} />
              <strong>No driver selected</strong>
              <span>Select a row to see details.</span>
            </div>
          ) : loadingDetail ? (
            <div className="kyc-empty-state" style={{ padding: 30 }}>
              <Loader2 size={27} className="kyc-spin" />
              <strong>Loading details…</strong>
            </div>
          ) : (
            <>
              {/* Profile header */}
              <div className="kyc-profile-person">
                <div className="kyc-profile-avatar">
                  {detail?.driver?.profile_image ? (
                    <img src={detail.driver.profile_image} alt={detail.driver.full_name} />
                  ) : (
                    <UserRound size={30} />
                  )}
                </div>
                <div>
                  <h3>{detail?.driver?.full_name || selectedDriver.name || "—"}</h3>
                  <p>
                    <Phone size={12} />
                    {detail?.driver?.phone || selectedDriver.phone || "—"}
                  </p>
                  <p className="kyc-profile-meta">
                    <Star size={12} />
                    {(detail?.driver?.rating ?? 0).toFixed?.(1) ?? "0.0"} ·{" "}
                    <Car size={12} />
                    {detail?.driver?.total_rides ?? 0} rides
                  </p>
                </div>
              </div>

              <div className="kyc-profile-status-row">
                <span>Overall Status</span>
                <span className={`kyc-status kyc-status-${statusToDisplay(selectedDriver.status).toLowerCase()}`}>
                  {statusToDisplay(selectedDriver.status)}
                </span>
              </div>

              <div className="kyc-profile-detail">
                <CalendarDays size={15} />
                <div>
                  <span>Applied On</span>
                  <strong>{formatDate(detail?.driver?.created_at || selectedDriver.applied_on)}</strong>
                </div>
              </div>

              {/* SECTION TABS */}
              <div className="kyc-section-tabs">
                {[
                  { key: "documents", label: "Documents", status: docSection.status, Icon: FileText },
                  { key: "vehicle", label: "Vehicle", status: vehicleStatus, Icon: Car },
                  { key: "bank", label: "Bank", status: bankStatus, Icon: Landmark },
                ].map(({ key, label, status, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`kyc-section-tab ${activeSection === key ? "active" : ""} kyc-sec-${status.toLowerCase()}`}
                    onClick={() => setActiveSection(key)}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                    <span className="kyc-section-tab-dot" />
                  </button>
                ))}
              </div>

              {/* SECTION BODY */}
              <div className="kyc-section-body">
                {/* DOCUMENTS TAB */}
                {activeSection === "documents" && (
                  <div className="kyc-section-content">
                    <div className={`kyc-status-banner kyc-status-${docSection.status.toLowerCase()}`}>
                      <ShieldCheck size={16} />
                      <span>
                        {docSection.status === "VERIFIED" && "All documents verified"}
                        {docSection.status === "PENDING" && "Documents pending verification"}
                        {docSection.status === "REJECTED" && "Documents rejected"}
                      </span>
                    </div>

                    <div className="kyc-doc-summary">
                      <div className="kyc-doc-stat">
                        <span className="kyc-doc-stat-label">Total</span>
                        <span className="kyc-doc-stat-value">{docSection.total ?? 8}</span>
                      </div>
                      <div className="kyc-doc-stat kyc-doc-stat-green">
                        <span className="kyc-doc-stat-label">Verified</span>
                        <span className="kyc-doc-stat-value">{docSection.verified ?? 0}</span>
                      </div>
                      <div className="kyc-doc-stat kyc-doc-stat-amber">
                        <span className="kyc-doc-stat-label">Pending</span>
                        <span className="kyc-doc-stat-value">{docSection.pending ?? 0}</span>
                      </div>
                      <div className="kyc-doc-stat kyc-doc-stat-red">
                        <span className="kyc-doc-stat-label">Rejected</span>
                        <span className="kyc-doc-stat-value">{docSection.rejected ?? 0}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="kyc-review-docs-button"
                      onClick={goToDocuments}
                    >
                      <ExternalLink size={15} />
                      Review Documents
                    </button>

                    <p className="kyc-hint">
                      Open the documents page to approve or reject each submitted document.
                    </p>
                  </div>
                )}

                {/* VEHICLE TAB */}
                {activeSection === "vehicle" && (
                  <div className="kyc-section-content">
                    <div className={`kyc-status-banner kyc-status-${vehicleStatus.toLowerCase()}`}>
                      <Car size={16} />
                      <span>
                        {vehicleStatus === "VERIFIED" && "Vehicle verified"}
                        {vehicleStatus === "PENDING" && "Vehicle pending verification"}
                        {vehicleStatus === "REJECTED" && "Vehicle rejected"}
                      </span>
                    </div>

                    {!vehicle ? (
                      <div className="kyc-empty-inline">
                        <AlertCircle size={18} />
                        <span>No vehicle details submitted.</span>
                      </div>
                    ) : (
                      <>
                        <div className="kyc-info-grid">
                          <div className="kyc-info-row"><span>Type</span><strong>{vehicle.vehicle_type || "—"}</strong></div>
                          <div className="kyc-info-row"><span>Model</span><strong>{vehicle.vehicle_model || "—"}</strong></div>
                          <div className="kyc-info-row"><span>Number</span><strong>{vehicle.vehicle_number || "—"}</strong></div>
                          <div className="kyc-info-row"><span>Color</span><strong>{vehicle.vehicle_color || "—"}</strong></div>
                        </div>

                        {vehicle.rejection_reason && (
                          <div className="kyc-reject-reason">
                            <AlertCircle size={14} />
                            <span>{vehicle.rejection_reason}</span>
                          </div>
                        )}

                        <div className="kyc-section-actions">
                          <button
                            type="button"
                            className="kyc-approve-button"
                            disabled={actionLoading === "vehicle"}
                            onClick={() => approveSection("vehicle")}
                          >
                            <CheckCircle size={15} />
                            {actionLoading === "vehicle" ? "Verifying…" : "Verify Vehicle"}
                          </button>
                          <button
                            type="button"
                            className="kyc-reject-button"
                            disabled={actionLoading === "vehicle"}
                            onClick={() => openRejectSectionModal("vehicle")}
                          >
                            <XCircle size={15} />
                            Reject Vehicle
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* BANK TAB */}
                {activeSection === "bank" && (
                  <div className="kyc-section-content">
                    <div className={`kyc-status-banner kyc-status-${bankStatus.toLowerCase()}`}>
                      <CreditCard size={16} />
                      <span>
                        {bankStatus === "VERIFIED" && "Bank verified"}
                        {bankStatus === "PENDING" && "Bank pending verification"}
                        {bankStatus === "REJECTED" && "Bank rejected"}
                      </span>
                    </div>

                    {!bank ? (
                      <div className="kyc-empty-inline">
                        <AlertCircle size={18} />
                        <span>No bank details submitted.</span>
                      </div>
                    ) : (
                      <>
                        <div className="kyc-info-grid">
                          <div className="kyc-info-row"><span>Holder</span><strong>{bank.account_holder_name || "—"}</strong></div>
                          <div className="kyc-info-row"><span>Bank</span><strong>{bank.bank_name || "—"}</strong></div>
                          <div className="kyc-info-row"><span>Account</span><strong>{bank.account_number || "—"}</strong></div>
                          <div className="kyc-info-row"><span>IFSC</span><strong>{bank.ifsc_code || "—"}</strong></div>
                        </div>

                        {bank.rejection_reason && (
                          <div className="kyc-reject-reason">
                            <AlertCircle size={14} />
                            <span>{bank.rejection_reason}</span>
                          </div>
                        )}

                        <div className="kyc-section-actions">
                          <button
                            type="button"
                            className="kyc-approve-button"
                            disabled={actionLoading === "bank"}
                            onClick={() => approveSection("bank")}
                          >
                            <CheckCircle size={15} />
                            {actionLoading === "bank" ? "Verifying…" : "Verify Bank"}
                          </button>
                          <button
                            type="button"
                            className="kyc-reject-button"
                            disabled={actionLoading === "bank"}
                            onClick={() => openRejectSectionModal("bank")}
                          >
                            <XCircle size={15} />
                            Reject Bank
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* OVERALL ACTIONS */}
              {selectedDriver.status === "PENDING" && (
                <div className="kyc-overall-actions">
                  {!allVerified && (
                    <div className="kyc-warning-banner">
                      <AlertCircle size={15} />
                      <span>
                        Not all sections verified. Approving will force-approve everything.
                      </span>
                    </div>
                  )}
                  <div className="kyc-overall-buttons">
                    <button
                      type="button"
                      className="kyc-approve-button kyc-approve-full"
                      disabled={actionLoading === "full"}
                      onClick={approveFullKyc}
                    >
                      <ShieldCheck size={16} />
                      {actionLoading === "full" ? "Approving…" : "Approve Full KYC"}
                    </button>
                    <button
                      type="button"
                      className="kyc-reject-button"
                      disabled={actionLoading === "full"}
                      onClick={openRejectFullModal}
                    >
                      <XCircle size={16} />
                      Reject Full KYC
                    </button>
                  </div>
                </div>
              )}

              {selectedDriver.status !== "PENDING" && hasRejected && (
                <div className="kyc-reject-reason">
                  <AlertCircle size={14} />
                  <span>{selectedDriver.rejection_reason || "Application rejected."}</span>
                </div>
              )}
            </>
          )}
        </aside>
      </div>

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="kyc-modal-backdrop" onClick={() => setRejectModal(null)}>
          <div className="kyc-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              Reject {rejectModal.scope === "full" ? "Full KYC" : rejectModal.scope}
            </h3>
            <p className="kyc-modal-hint">
              Reason will be shown to the driver. Minimum 5 characters.
            </p>
            <textarea
              rows={4}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="e.g. Driving license image is unclear"
              autoFocus
            />
            <div className="kyc-modal-actions">
              <button
                type="button"
                className="kyc-modal-cancel"
                onClick={() => setRejectModal(null)}
                disabled={actionLoading === rejectModal.scope}
              >
                Cancel
              </button>
              <button
                type="button"
                className="kyc-modal-confirm"
                disabled={
                  actionLoading === rejectModal.scope ||
                  rejectModal.reason.trim().length < 5
                }
                onClick={submitReject}
              >
                {actionLoading === rejectModal.scope ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   UserRound,
//   Phone,
//   FileText,
//   CheckCircle,
//   XCircle,
//   Clock,
//   MapPin,
//   CalendarDays,
//   BriefcaseBusiness,
//   RotateCcw,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";

// import { adminApi } from "../services/api";   // ← adjust path to your api.js
// import "../styles/DriverKYCPage.css";

// // =====================================================
// // TOKEN HELPER
// // =====================================================
// function getAdminToken() {
//   return (
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("adminToken") ||
//     sessionStorage.getItem("accessToken") ||
//     sessionStorage.getItem("adminToken") ||
//     null
//   );
// }

// const TAB_TO_API = {
//   Pending: "PENDING",
//   Approved: "APPROVED",
//   Rejected: "REJECTED",
// };

// // =====================================================
// // HELPERS
// // =====================================================
// function formatDate(dateStr) {
//   if (!dateStr) return "—";
//   try {
//     return new Date(dateStr).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return dateStr;
//   }
// }

// // =====================================================
// // COMPONENT
// // =====================================================
// function DriverKYCPage() {
//   const [applications, setApplications] = useState([]);
//   const [stats, setStats] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     total: 0,
//   });
//   const [activeTab, setActiveTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedId, setSelectedId] = useState(null);
//   const [notice, setNotice] = useState("");
//   const [noticeType, setNoticeType] = useState("success");

//   const [loading, setLoading] = useState(false);
//   const [loadingStats, setLoadingStats] = useState(false);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [error, setError] = useState("");

//   // ---------------------------------------------------
//   // LOAD STATS
//   // ---------------------------------------------------
//   const loadStats = useCallback(async () => {
//     const token = getAdminToken();
//     if (!token) {
//       setError("Not authenticated. Please login again.");
//       return;
//     }

//     setLoadingStats(true);
//     try {
//       const res = await adminApi.getKycStats(token);
//       if (res?.success) {
//         console.log("res.datares.datares.data", res.data);

//         setStats(res.data);
//       }
//     } catch (e) {
//       console.error("loadStats error:", e.message);
//     } finally {
//       setLoadingStats(false);
//     }
//   }, []);

//   // ---------------------------------------------------
//   // LOAD LIST
//   // ---------------------------------------------------
//   const loadList = useCallback(async (tab) => {
//     const token = getAdminToken();
//     if (!token) {
//       setError("Not authenticated. Please login again.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     try {
//       const res = await adminApi.getKycList(token, {
//         status: TAB_TO_API[tab],
//         limit: 100,
//         offset: 0,
//       });

//       if (res?.success) {
//         setApplications(res.data || []);
//         setSelectedId(res.data?.[0]?.driver_id ?? null);
//       } else {
//         setError(res?.message || "Failed to load list");
//         setApplications([]);
//       }
//     } catch (e) {
//       console.error("loadList error:", e.message);
//       setError(e.message || "Unable to load KYC applications");
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ---------------------------------------------------
//   // INITIAL LOAD
//   // ---------------------------------------------------
//   useEffect(() => {
//     loadStats();
//   }, [loadStats]);

//   useEffect(() => {
//     loadList(activeTab);
//   }, [activeTab, loadList]);

//   // ---------------------------------------------------
//   // TAB CHANGE
//   // ---------------------------------------------------
//   const changeTab = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm("");
//     setNotice("");
//     setError("");
//   };

//   // ---------------------------------------------------
//   // SEARCH FILTER (client-side)
//   // ---------------------------------------------------
//   const filteredApplications = useMemo(() => {
//     const search = searchTerm.trim().toLowerCase();
//     if (!search) return applications;

//     return applications.filter(
//       (app) =>
//         app.name?.toLowerCase().includes(search) ||
//         app.phone?.toLowerCase().includes(search) ||
//         app.email?.toLowerCase().includes(search)
//     );
//   }, [applications, searchTerm]);

//   const selectedDriver =
//     applications.find((item) => item.driver_id === selectedId) ||
//     filteredApplications[0] ||
//     null;

//   // ---------------------------------------------------
//   // APPROVE
//   // ---------------------------------------------------
//   const approveApplication = async (driverId) => {
//     if (
//       !window.confirm(
//         "Approve this driver's KYC? They will be able to go online."
//       )
//     ) {
//       return;
//     }

//     const token = getAdminToken();
//     if (!token) {
//       setError("Not authenticated");
//       return;
//     }

//     setActionLoading(driverId);
//     try {
//       const res = await adminApi.approveKyc(token, driverId);
//       if (res?.success) {
//         setNoticeType("success");
//         setNotice("KYC approved. Driver has been notified.");
//         await Promise.all([loadStats(), loadList(activeTab)]);
//       } else {
//         setNoticeType("error");
//         setNotice(res?.message || "Approval failed");
//       }
//     } catch (e) {
//       console.error("approve error:", e.message);
//       setNoticeType("error");
//       setNotice(e.message || "Failed to approve");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ---------------------------------------------------
//   // REJECT (prompt for reason)
//   // ---------------------------------------------------
//   const rejectApplication = async (driverId) => {
//     const reason = window.prompt(
//       "Enter rejection reason (min 5 characters). This will be shown to the driver:"
//     );

//     if (reason === null) return;
//     if (reason.trim().length < 5) {
//       setNoticeType("error");
//       setNotice("Rejection reason must be at least 5 characters.");
//       return;
//     }

//     const token = getAdminToken();
//     if (!token) {
//       setError("Not authenticated");
//       return;
//     }

//     setActionLoading(driverId);
//     try {
//       const res = await adminApi.rejectKyc(token, driverId, reason.trim());
//       if (res?.success) {
//         setNoticeType("success");
//         setNotice("KYC rejected. Driver has been notified.");
//         await Promise.all([loadStats(), loadList(activeTab)]);
//       } else {
//         setNoticeType("error");
//         setNotice(res?.message || "Rejection failed");
//       }
//     } catch (e) {
//       console.error("reject error:", e.message);
//       setNoticeType("error");
//       setNotice(e.message || "Failed to reject");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ---------------------------------------------------
//   // RESET
//   // ---------------------------------------------------
//   const resetSearch = () => {
//     setSearchTerm("");
//     setNotice("");
//     setError("");
//   };

//   // ---------------------------------------------------
//   // STATUS DISPLAY
//   // ---------------------------------------------------
//   const statusToDisplay = (s) => {
//     if (s === "PENDING") return "Pending";
//     if (s === "APPROVED") return "Approved";
//     return "Rejected";
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <div className="driver-kyc-page">
//       <header className="driver-kyc-header">
//         <div>
//           <span className="driver-kyc-eyebrow">VERIFICATION CENTER</span>
//           <h1>Driver KYC Review</h1>
//           <p>Review and verify driver applications.</p>
//         </div>

//         <div className="driver-kyc-header-icon">
//           <FileText size={23} />
//         </div>
//       </header>

//       {/* ============================================================ */}
//       {/* SUMMARY CARDS */}
//       {/* ============================================================ */}
//       <div className="driver-kyc-summary">
//         <div className="kyc-summary-card">
//           <span>Pending Review</span>
//           <strong>{loadingStats ? "…" : stats.pending}</strong>
//           <Clock size={19} />
//         </div>
//         <div className="kyc-summary-card">
//           <span>Approved Applications</span>
//           <strong>{loadingStats ? "…" : stats.approved}</strong>
//           <CheckCircle size={19} />
//         </div>
//         <div className="kyc-summary-card">
//           <span>Rejected Applications</span>
//           <strong>{loadingStats ? "…" : stats.rejected}</strong>
//           <XCircle size={19} />
//         </div>
//       </div>

//       <div className="driver-kyc-layout">
//         {/* ============================================================ */}
//         {/* LEFT — TABLE */}
//         {/* ============================================================ */}
//         <section className="driver-kyc-card">
//           {/* TABS */}
//           <div className="driver-kyc-tabs">
//             {["Pending", "Approved", "Rejected"].map((tab) => {
//               const count =
//                 tab === "Pending"
//                   ? stats.pending
//                   : tab === "Approved"
//                     ? stats.approved
//                     : stats.rejected;

//               return (
//                 <button
//                   key={tab}
//                   type="button"
//                   className={`driver-kyc-tab ${activeTab === tab ? "active" : ""
//                     }`}
//                   onClick={() => changeTab(tab)}
//                 >
//                   {tab}
//                   <span>{count}</span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* TOOLBAR */}
//           <div className="driver-kyc-toolbar">
//             <label className="driver-kyc-search">
//               <Search size={16} />
//               <input
//                 type="search"
//                 placeholder="Search driver name or phone..."
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//               />
//             </label>

//             <button
//               type="button"
//               className="driver-kyc-reset"
//               onClick={resetSearch}
//               aria-label="Reset search"
//             >
//               <RotateCcw size={15} />
//             </button>
//           </div>

//           {/* NOTICE */}
//           {notice && (
//             <div
//               className="driver-kyc-notice"
//               role="status"
//               style={{
//                 background: noticeType === "error" ? "#FEE2E2" : "#ECFDF5",
//                 color: noticeType === "error" ? "#991B1B" : "#065F46",
//               }}
//             >
//               {noticeType === "error" ? (
//                 <AlertCircle size={15} />
//               ) : (
//                 <CheckCircle size={15} />
//               )}
//               <span>{notice}</span>
//               <button type="button" onClick={() => setNotice("")}>
//                 ×
//               </button>
//             </div>
//           )}

//           {/* ERROR */}
//           {error && (
//             <div
//               className="driver-kyc-notice"
//               style={{ background: "#FEE2E2", color: "#991B1B" }}
//             >
//               <AlertCircle size={15} />
//               <span>{error}</span>
//               <button type="button" onClick={() => setError("")}>
//                 ×
//               </button>
//             </div>
//           )}

//           {/* TABLE */}
//           <div className="driver-kyc-table-wrap">
//             <table className="driver-kyc-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Driver Name</th>
//                   <th>Phone Number</th>
//                   <th>Documents</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="kyc-empty-state">
//                         <Loader2 size={27} className="kyc-spin" />
//                         <strong>Loading applications…</strong>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredApplications.map((driver, index) => {
//                     const displayStatus = statusToDisplay(driver.status);
//                     const isActing = actionLoading === driver.driver_id;

//                     return (
//                       <tr
//                         key={driver.driver_id}
//                         className={
//                           selectedDriver?.driver_id === driver.driver_id
//                             ? "kyc-selected-row"
//                             : ""
//                         }
//                         onClick={() => setSelectedId(driver.driver_id)}
//                       >
//                         <td>{index + 1}</td>
//                         <td>
//                           <button
//                             type="button"
//                             className="kyc-driver-name"
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               setSelectedId(driver.driver_id);
//                             }}
//                           >
//                             <span className="kyc-mini-avatar">
//                               <UserRound size={15} />
//                             </span>
//                             {driver.name || "—"}
//                           </button>
//                         </td>
//                         <td>{driver.phone || "—"}</td>
//                         <td>
//                           <span className="kyc-document-count">
//                             <FileText size={13} />
//                             {driver.documents_submitted || "0/7"}
//                           </span>
//                         </td>
//                         <td>
//                           <span
//                             className={`kyc-status kyc-status-${displayStatus.toLowerCase()}`}
//                           >
//                             {displayStatus}
//                           </span>
//                         </td>
//                         <td>
//                           {driver.status === "PENDING" ? (
//                             <div className="kyc-row-actions">
//                               <button
//                                 type="button"
//                                 className="kyc-approve-button"
//                                 disabled={isActing}
//                                 onClick={(event) => {
//                                   event.stopPropagation();
//                                   approveApplication(driver.driver_id);
//                                 }}
//                               >
//                                 {isActing ? "…" : "Approve"}
//                               </button>
//                               <button
//                                 type="button"
//                                 className="kyc-reject-button"
//                                 disabled={isActing}
//                                 onClick={(event) => {
//                                   event.stopPropagation();
//                                   rejectApplication(driver.driver_id);
//                                 }}
//                               >
//                                 {isActing ? "…" : "Reject"}
//                               </button>
//                             </div>
//                           ) : (
//                             <span className="kyc-reviewed-label">
//                               Reviewed
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}

//                 {!loading && filteredApplications.length === 0 && (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="kyc-empty-state">
//                         <FileText size={27} />
//                         <strong>
//                           No {activeTab.toLowerCase()} applications
//                         </strong>
//                         <span>Try another tab or change your search.</span>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="driver-kyc-table-footer">
//             Showing {filteredApplications.length} {activeTab.toLowerCase()}{" "}
//             applications
//           </div>
//         </section>

//         {/* ============================================================ */}
//         {/* RIGHT — PROFILE PANEL */}
//         {/* ============================================================ */}
//         <aside className="driver-kyc-profile">
//           <div className="kyc-profile-heading">
//             <h2>Driver Profile Summary</h2>
//             <span>Selected applicant</span>
//           </div>

//           {selectedDriver ? (
//             <>
//               <div className="kyc-profile-person">
//                 <div className="kyc-profile-avatar">
//                   <UserRound size={30} />
//                 </div>
//                 <div>
//                   <h3>{selectedDriver.name || "—"}</h3>
//                   <p>
//                     <Phone size={12} />
//                     {selectedDriver.phone || "—"}
//                   </p>
//                 </div>
//               </div>

//               <div className="kyc-profile-status-row">
//                 <span>Verification Status</span>
//                 <span
//                   className={`kyc-status kyc-status-${statusToDisplay(
//                     selectedDriver.status
//                   ).toLowerCase()}`}
//                 >
//                   {statusToDisplay(selectedDriver.status)}
//                 </span>
//               </div>

//               <div className="kyc-profile-detail">
//                 <CalendarDays size={15} />
//                 <div>
//                   <span>Applied On</span>
//                   <strong>{formatDate(selectedDriver.applied_on)}</strong>
//                 </div>
//               </div>

//               <div className="kyc-profile-detail">
//                 <FileText size={15} />
//                 <div>
//                   <span>Documents Submitted</span>
//                   <strong>{selectedDriver.documents_submitted || "0/7"}</strong>
//                 </div>
//               </div>

//               {selectedDriver.vehicle_type && (
//                 <div className="kyc-profile-detail">
//                   <BriefcaseBusiness size={15} />
//                   <div>
//                     <span>Vehicle</span>
//                     <strong>
//                       {selectedDriver.vehicle_type} ·{" "}
//                       {selectedDriver.vehicle_number || "—"}
//                     </strong>
//                   </div>
//                 </div>
//               )}

//               {selectedDriver.bank_name && (
//                 <div className="kyc-profile-detail">
//                   <MapPin size={15} />
//                   <div>
//                     <span>Bank</span>
//                     <strong>{selectedDriver.bank_name}</strong>
//                   </div>
//                 </div>
//               )}

//               {selectedDriver.rejection_reason && (
//                 <div
//                   className="kyc-profile-detail"
//                   style={{
//                     background: "#FEE2E2",
//                     borderRadius: 8,
//                     padding: 10,
//                   }}
//                 >
//                   <AlertCircle size={15} />
//                   <div>
//                     <span>Rejection Reason</span>
//                     <strong>{selectedDriver.rejection_reason}</strong>
//                   </div>
//                 </div>
//               )}

//               {selectedDriver.status === "PENDING" && (
//                 <div className="kyc-profile-actions">
//                   <button
//                     type="button"
//                     className="kyc-approve-button"
//                     disabled={actionLoading === selectedDriver.driver_id}
//                     onClick={() => approveApplication(selectedDriver.driver_id)}
//                   >
//                     <CheckCircle size={15} />
//                     {actionLoading === selectedDriver.driver_id
//                       ? "Approving…"
//                       : "Approve Application"}
//                   </button>
//                   <button
//                     type="button"
//                     className="kyc-reject-button"
//                     disabled={actionLoading === selectedDriver.driver_id}
//                     onClick={() => rejectApplication(selectedDriver.driver_id)}
//                   >
//                     <XCircle size={15} />
//                     {actionLoading === selectedDriver.driver_id
//                       ? "Rejecting…"
//                       : "Reject Application"}
//                   </button>
//                 </div>
//               )}

//               <p className="kyc-demo-note">
//                 Approving will allow this driver to go online and accept rides.
//               </p>
//             </>
//           ) : (
//             <div className="kyc-empty-state" style={{ padding: 30 }}>
//               <UserRound size={27} />
//               <strong>No driver selected</strong>
//               <span>Select a row from the table to see details.</span>
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// }

// export default DriverKYCPage;