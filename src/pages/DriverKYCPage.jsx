import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import { adminApi } from "../services/api";   // ← adjust path to your api.js
import "../styles/DriverKYCPage.css";

// =====================================================
// TOKEN HELPER
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

// =====================================================
// COMPONENT
// =====================================================
function DriverKYCPage() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ---------------------------------------------------
  // LOAD STATS
  // ---------------------------------------------------
  const loadStats = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setError("Not authenticated. Please login again.");
      return;
    }

    setLoadingStats(true);
    try {
      const res = await adminApi.getKycStats(token);
      if (res?.success) {
        console.log("res.datares.datares.data", res.data);

        setStats(res.data);
      }
    } catch (e) {
      console.error("loadStats error:", e.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ---------------------------------------------------
  // LOAD LIST
  // ---------------------------------------------------
  const loadList = useCallback(async (tab) => {
    const token = getAdminToken();
    if (!token) {
      setError("Not authenticated. Please login again.");
      return;
    }

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

  // ---------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList(activeTab);
  }, [activeTab, loadList]);

  // ---------------------------------------------------
  // TAB CHANGE
  // ---------------------------------------------------
  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setNotice("");
    setError("");
  };

  // ---------------------------------------------------
  // SEARCH FILTER (client-side)
  // ---------------------------------------------------
  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return applications;

    return applications.filter(
      (app) =>
        app.name?.toLowerCase().includes(search) ||
        app.phone?.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search)
    );
  }, [applications, searchTerm]);

  const selectedDriver =
    applications.find((item) => item.driver_id === selectedId) ||
    filteredApplications[0] ||
    null;

  // ---------------------------------------------------
  // APPROVE
  // ---------------------------------------------------
  const approveApplication = async (driverId) => {
    if (
      !window.confirm(
        "Approve this driver's KYC? They will be able to go online."
      )
    ) {
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setActionLoading(driverId);
    try {
      const res = await adminApi.approveKyc(token, driverId);
      if (res?.success) {
        setNoticeType("success");
        setNotice("KYC approved. Driver has been notified.");
        await Promise.all([loadStats(), loadList(activeTab)]);
      } else {
        setNoticeType("error");
        setNotice(res?.message || "Approval failed");
      }
    } catch (e) {
      console.error("approve error:", e.message);
      setNoticeType("error");
      setNotice(e.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------
  // REJECT (prompt for reason)
  // ---------------------------------------------------
  const rejectApplication = async (driverId) => {
    const reason = window.prompt(
      "Enter rejection reason (min 5 characters). This will be shown to the driver:"
    );

    if (reason === null) return;
    if (reason.trim().length < 5) {
      setNoticeType("error");
      setNotice("Rejection reason must be at least 5 characters.");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setActionLoading(driverId);
    try {
      const res = await adminApi.rejectKyc(token, driverId, reason.trim());
      if (res?.success) {
        setNoticeType("success");
        setNotice("KYC rejected. Driver has been notified.");
        await Promise.all([loadStats(), loadList(activeTab)]);
      } else {
        setNoticeType("error");
        setNotice(res?.message || "Rejection failed");
      }
    } catch (e) {
      console.error("reject error:", e.message);
      setNoticeType("error");
      setNotice(e.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------
  // RESET
  // ---------------------------------------------------
  const resetSearch = () => {
    setSearchTerm("");
    setNotice("");
    setError("");
  };

  // ---------------------------------------------------
  // STATUS DISPLAY
  // ---------------------------------------------------
  const statusToDisplay = (s) => {
    if (s === "PENDING") return "Pending";
    if (s === "APPROVED") return "Approved";
    return "Rejected";
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

      {/* ============================================================ */}
      {/* SUMMARY CARDS */}
      {/* ============================================================ */}
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
        {/* ============================================================ */}
        {/* LEFT — TABLE */}
        {/* ============================================================ */}
        <section className="driver-kyc-card">
          {/* TABS */}
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
                  className={`driver-kyc-tab ${activeTab === tab ? "active" : ""
                    }`}
                  onClick={() => changeTab(tab)}
                >
                  {tab}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          {/* TOOLBAR */}
          <div className="driver-kyc-toolbar">
            <label className="driver-kyc-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search driver name or phone..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="driver-kyc-reset"
              onClick={resetSearch}
              aria-label="Reset search"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* NOTICE */}
          {notice && (
            <div
              className="driver-kyc-notice"
              role="status"
              style={{
                background: noticeType === "error" ? "#FEE2E2" : "#ECFDF5",
                color: noticeType === "error" ? "#991B1B" : "#065F46",
              }}
            >
              {noticeType === "error" ? (
                <AlertCircle size={15} />
              ) : (
                <CheckCircle size={15} />
              )}
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")}>
                ×
              </button>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              className="driver-kyc-notice"
              style={{ background: "#FEE2E2", color: "#991B1B" }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
              <button type="button" onClick={() => setError("")}>
                ×
              </button>
            </div>
          )}

          {/* TABLE */}
          <div className="driver-kyc-table-wrap">
            <table className="driver-kyc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
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
                    const isActing = actionLoading === driver.driver_id;

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
                            onClick={(event) => {
                              event.stopPropagation();
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
                            {driver.documents_submitted || "0/7"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`kyc-status kyc-status-${displayStatus.toLowerCase()}`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td>
                          {driver.status === "PENDING" ? (
                            <div className="kyc-row-actions">
                              <button
                                type="button"
                                className="kyc-approve-button"
                                disabled={isActing}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  approveApplication(driver.driver_id);
                                }}
                              >
                                {isActing ? "…" : "Approve"}
                              </button>
                              <button
                                type="button"
                                className="kyc-reject-button"
                                disabled={isActing}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  rejectApplication(driver.driver_id);
                                }}
                              >
                                {isActing ? "…" : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <span className="kyc-reviewed-label">
                              Reviewed
                            </span>
                          )}
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
                        <strong>
                          No {activeTab.toLowerCase()} applications
                        </strong>
                        <span>Try another tab or change your search.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="driver-kyc-table-footer">
            Showing {filteredApplications.length} {activeTab.toLowerCase()}{" "}
            applications
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT — PROFILE PANEL */}
        {/* ============================================================ */}
        <aside className="driver-kyc-profile">
          <div className="kyc-profile-heading">
            <h2>Driver Profile Summary</h2>
            <span>Selected applicant</span>
          </div>

          {selectedDriver ? (
            <>
              <div className="kyc-profile-person">
                <div className="kyc-profile-avatar">
                  <UserRound size={30} />
                </div>
                <div>
                  <h3>{selectedDriver.name || "—"}</h3>
                  <p>
                    <Phone size={12} />
                    {selectedDriver.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="kyc-profile-status-row">
                <span>Verification Status</span>
                <span
                  className={`kyc-status kyc-status-${statusToDisplay(
                    selectedDriver.status
                  ).toLowerCase()}`}
                >
                  {statusToDisplay(selectedDriver.status)}
                </span>
              </div>

              <div className="kyc-profile-detail">
                <CalendarDays size={15} />
                <div>
                  <span>Applied On</span>
                  <strong>{formatDate(selectedDriver.applied_on)}</strong>
                </div>
              </div>

              <div className="kyc-profile-detail">
                <FileText size={15} />
                <div>
                  <span>Documents Submitted</span>
                  <strong>{selectedDriver.documents_submitted || "0/7"}</strong>
                </div>
              </div>

              {selectedDriver.vehicle_type && (
                <div className="kyc-profile-detail">
                  <BriefcaseBusiness size={15} />
                  <div>
                    <span>Vehicle</span>
                    <strong>
                      {selectedDriver.vehicle_type} ·{" "}
                      {selectedDriver.vehicle_number || "—"}
                    </strong>
                  </div>
                </div>
              )}

              {selectedDriver.bank_name && (
                <div className="kyc-profile-detail">
                  <MapPin size={15} />
                  <div>
                    <span>Bank</span>
                    <strong>{selectedDriver.bank_name}</strong>
                  </div>
                </div>
              )}

              {selectedDriver.rejection_reason && (
                <div
                  className="kyc-profile-detail"
                  style={{
                    background: "#FEE2E2",
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <AlertCircle size={15} />
                  <div>
                    <span>Rejection Reason</span>
                    <strong>{selectedDriver.rejection_reason}</strong>
                  </div>
                </div>
              )}

              {selectedDriver.status === "PENDING" && (
                <div className="kyc-profile-actions">
                  <button
                    type="button"
                    className="kyc-approve-button"
                    disabled={actionLoading === selectedDriver.driver_id}
                    onClick={() => approveApplication(selectedDriver.driver_id)}
                  >
                    <CheckCircle size={15} />
                    {actionLoading === selectedDriver.driver_id
                      ? "Approving…"
                      : "Approve Application"}
                  </button>
                  <button
                    type="button"
                    className="kyc-reject-button"
                    disabled={actionLoading === selectedDriver.driver_id}
                    onClick={() => rejectApplication(selectedDriver.driver_id)}
                  >
                    <XCircle size={15} />
                    {actionLoading === selectedDriver.driver_id
                      ? "Rejecting…"
                      : "Reject Application"}
                  </button>
                </div>
              )}

              <p className="kyc-demo-note">
                Approving will allow this driver to go online and accept rides.
              </p>
            </>
          ) : (
            <div className="kyc-empty-state" style={{ padding: 30 }}>
              <UserRound size={27} />
              <strong>No driver selected</strong>
              <span>Select a row from the table to see details.</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default DriverKYCPage;