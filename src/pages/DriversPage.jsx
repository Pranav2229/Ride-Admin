import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Phone,
  Star,
  CarFront,
  CheckCircle,
  Ban,
  ChevronDown,
  RotateCcw,
  Wallet,
  AlertCircle,
} from "lucide-react";

import { adminApi } from "../services/api"; // Note: Using adminApi, not driverApi
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
export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("");
  const token = getAdminToken();

  const rowsPerPage = 5;

  // ---------------------------------------------------
  // LOAD DRIVERS
  // ---------------------------------------------------
  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getDrivers(token, { search });

      if (res?.success) {
        setDrivers(res.data || []);
      } else {
        setError(res?.message || "Failed to load drivers");
        setDrivers([]);
      }
    } catch (err) {
      setDrivers([]);
      setError(err.message || "Unable to load drivers from server.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadDrivers(), 300);
    return () => clearTimeout(timer);
  }, [loadDrivers]);

  // ---------------------------------------------------
  // TOGGLE STATUS
  // ---------------------------------------------------
  const toggleDriverStatus = (driverId) => {
    const selectedDriver = drivers.find((d) => d.driver_id === driverId);
    if (!selectedDriver) return;

    const nextStatus = selectedDriver.is_online ? "Offline" : "Online";

    setDrivers((prev) =>
      prev.map((d) =>
        d.driver_id === driverId ? { ...d, is_online: !d.is_online } : d
      )
    );

    setNotice(
      `${selectedDriver.name}'s status is now ${nextStatus.toLowerCase()} (Demo mode).`
    );

    // TODO: Connect to actual block/activate API
  };

  // ---------------------------------------------------
  // FILTERS & PAGINATION
  // ---------------------------------------------------
  const filteredDrivers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.filter((d) => {
      const matchesSearch =
        String(d.name).toLowerCase().includes(q) ||
        String(d.phone).toLowerCase().includes(q) ||
        String(d.driver_id).includes(q);

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Online" && d.is_online) ||
        (statusFilter === "Offline" && !d.is_online);

      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const displayedDrivers = filteredDrivers.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const onlineCount = drivers.filter((d) => d.is_online).length;
  const offlineCount = drivers.filter((d) => !d.is_online).length;

  const averageRating = drivers.length
    ? (drivers.reduce((total, d) => total + Number(d.rating || 0), 0) / drivers.length).toFixed(1)
    : "0.0";

  const totalRides = drivers.reduce((total, d) => total + Number(d.total_rides || 0), 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setCurrentPage(1);
    setNotice("");
  };

  return (
    <div className="drivers-page">
      <header className="drivers-page-header">
        <div>
          <span className="drivers-eyebrow">FLEET MANAGEMENT</span>
          <h1>Driver Management</h1>
          <p>Manage driver accounts, ratings and activity.</p>
        </div>
        <div className="drivers-header-icon">
          <Users size={23} />
        </div>
      </header>

      {/* STATS */}
      <div className="drivers-summary">
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-yellow">
            <Users size={20} />
          </div>
          <div>
            <span>Total Drivers</span>
            <strong>{drivers.length}</strong>
          </div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-green">
            <CheckCircle size={20} />
          </div>
          <div>
            <span>Online Drivers</span>
            <strong>{onlineCount}</strong>
          </div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-gray">
            <UserRound size={20} />
          </div>
          <div>
            <span>Offline Drivers</span>
            <strong>{offlineCount}</strong>
          </div>
        </div>
        <div className="driver-summary-card">
          <div className="driver-summary-icon driver-icon-blue">
            <Star size={20} />
          </div>
          <div>
            <span>Average Rating</span>
            <strong>{averageRating} <small>★</small></strong>
          </div>
        </div>
      </div>

      {/* EARNINGS SUMMARY */}
      <section className="driver-earnings-summary">
        <div className="driver-earnings-heading">
          <div className="flex">
            <div className="driver-earnings-icon">
              <Wallet size={22} />
            </div>
            <div>
              <h2>Total Completed Rides</h2>
              <p>Across all drivers on the platform</p>
            </div>
          </div>
          <div className="driver-earnings-values">
            <div>
              <span>Total Rides</span>
              <strong>{totalRides}</strong>
            </div>
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

        <div className="drivers-toolbar">
          <label className="drivers-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by name, phone or ID..."
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

          <button type="button" className="drivers-reset-button" onClick={resetFilters}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        {error && (
          <div className="drivers-notice" style={{ background: "#FEE2E2", color: "#991B1B" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="drivers-notice" role="status">
            <CheckCircle size={16} />
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
                <th>Phone Number</th>
                <th>Rating</th>
                <th>Completed Rides</th>
                <th>Status</th>
                <th className="driver-action-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && drivers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="drivers-empty-state">Loading drivers...</div>
                  </td>
                </tr>
              ) : displayedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="drivers-empty-state">
                      <Users size={28} />
                      <strong>No drivers found</strong>
                      <span>Try changing your search or status filter.</span>
                      <button type="button" onClick={resetFilters}>Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedDrivers.map((driver, index) => (
                  <tr key={driver.driver_id}>
                    <td className="driver-row-number">
                      {(safePage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td>
                      <div className="driver-name-cell">
                        <div className="driver-avatar">
                          <UserRound size={17} />
                        </div>
                        <span>{driver.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="driver-phone">
                        <Phone size={13} />
                        {driver.phone}
                      </span>
                    </td>
                    <td>
                      <span className="driver-rating">
                        {Number(driver.rating).toFixed(1)}
                        <Star size={13} fill="currentColor" />
                      </span>
                    </td>
                    <td>
                      <span className="driver-rides">
                        <CarFront size={14} />
                        {driver.total_rides}
                      </span>
                    </td>
                    <td>
                      <span className={`driver-status ${driver.is_online ? "driver-status-online" : "driver-status-offline"}`}>
                        <span className="driver-status-dot" />
                        {driver.is_online ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`driver-action-button ${driver.is_online ? "driver-deactivate-button" : "driver-activate-button"}`}
                        onClick={() => toggleDriverStatus(driver.driver_id)}
                      >
                        {driver.is_online ? (
                          <><Ban size={13} /> Deactivate</>
                        ) : (
                          <><CheckCircle size={13} /> Activate</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="drivers-table-footer">
          <span>
            Showing {filteredDrivers.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1} – {Math.min(safePage * rowsPerPage, filteredDrivers.length)} of {filteredDrivers.length} drivers
          </span>
          <div className="drivers-pagination">
            <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
            <span>{safePage} / {totalPages}</span>
            <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
          </div>
        </footer>
      </section>
    </div>
  );
}