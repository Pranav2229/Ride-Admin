
// import React, { useEffect, useState } from "react";
// import {
//   Car,
//   IndianRupee,
//   Users,
//   UserRound,
//   Activity,
//   ShieldCheck,
//   AlertTriangle,
//   CreditCard,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   XCircle,
//   CheckCircle,
//   MapPin,
// } from "lucide-react";

// import { adminApi } from "../services/api";
// import "../styles/Dashboard.css";

// function Dashboard() {
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchDashboardOverview = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token =
//         sessionStorage.getItem("accessToken") ||
//         localStorage.getItem("accessToken");

//       if (!token) {
//         throw new Error("Please log in again to access the dashboard.");
//       }

//       const response = await adminApi.getDashboardOverview(token);

//       console.log("Dashboard Overview API response:", response);

//       if (!response?.success || !response?.data) {
//         throw new Error(
//           response?.message || "Invalid dashboard overview response."
//         );
//       }

//       setOverview(response.data);
//     } catch (err) {
//       console.error("Dashboard Overview API error:", err);
//       setError(err.message || "Failed to load dashboard overview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardOverview();
//   }, []);

//   const kpis = overview?.kpis;
//   const todayKpis = kpis?.today;
//   const liveKpis = kpis?.live;
//   const alerts = overview?.alerts;
//   const charts = overview?.charts;

//   const liveRides = overview?.live_rides ?? [];
//   const cancellations = overview?.cancellations ?? [];

//   const formatCurrency = (value) =>
//     value == null
//       ? "—"
//       : new Intl.NumberFormat("en-IN", {
//           style: "currency",
//           currency: "INR",
//           maximumFractionDigits: 2,
//         }).format(value);

//   const formatDateTime = (value) => {
//     if (!value) return "—";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return value;

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const today = new Date();

//   const formattedDate = today.toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const formattedTime = today.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   const hour = today.getHours();

//   const greeting =
//     hour < 12
//       ? "Good Morning"
//       : hour < 17
//         ? "Good Afternoon"
//         : "Good Evening";

//   const statCards = [
//     {
//       title: "Today's Rides",
//       value: todayKpis?.rides ?? "—",
//       change: todayKpis?.rides_change_pct,
//       icon: Car,
//       type: "yellow",
//     },
//     {
//       title: "Today's Revenue",
//       value: formatCurrency(todayKpis?.revenue),
//       change: todayKpis?.revenue_change_pct,
//       icon: IndianRupee,
//       type: "green",
//     },
//     {
//       title: "New Users Today",
//       value: todayKpis?.new_users ?? "—",
//       change: todayKpis?.new_users_change_pct,
//       icon: Users,
//       type: "purple",
//     },
//     {
//       title: "Online Drivers",
//       value: liveKpis?.active_drivers ?? "—",
//       icon: UserRound,
//       type: "blue",
//     },
//     {
//       title: "Active Rides",
//       value: liveKpis?.active_rides ?? "—",
//       icon: Activity,
//       type: "green",
//     },
//     {
//       title: "Pending KYC",
//       value: liveKpis?.pending_kyc ?? "—",
//       icon: ShieldCheck,
//       type: "orange",
//     },
//   ];

//   const alertCards = [
//     {
//       key: "pending_kyc",
//       title: "Pending KYC",
//       icon: ShieldCheck,
//       fallbackLabel: "Drivers waiting KYC approval",
//     },
//     {
//       key: "payment_disputes",
//       title: "Payment Disputes",
//       icon: CreditCard,
//       fallbackLabel: "Payment disputes open",
//     },
//     {
//       key: "stuck_rides",
//       title: "Stuck Rides",
//       icon: Clock,
//       fallbackLabel: "Rides stuck in searching (>10 min)",
//     },
//     {
//       key: "pending_payouts",
//       title: "Pending Payouts",
//       icon: IndianRupee,
//       fallbackLabel: "Pending driver payouts",
//     },
//   ];

//   const revenueData = charts?.revenue ?? [];
//   const ridesData = charts?.rides ?? [];

//   const maxRevenue = Math.max(
//     ...revenueData.map((item) => Number(item.amount) || 0),
//     1
//   );

//   const maxRides = Math.max(
//     ...ridesData.map((item) => Number(item.count) || 0),
//     1
//   );

//   const getChangeIcon = (change) => {
//     if (change == null) return null;

//     return Number(change) < 0 ? (
//       <TrendingDown size={14} />
//     ) : (
//       <TrendingUp size={14} />
//     );
//   };

//   return (
//     <div className="dashboard-page">
//       {/* Page Header */}
//       <div className="dashboard-header">
//         <div className="dashboard-heading">
//           <span className="dashboard-eyebrow">RIDE OPERATIONS</span>

//           <h1>
//             {greeting}, Admin <span>👋</span>
//           </h1>

//           <p>Here's what's happening with RideBuddy today.</p>
//         </div>

//         <div className="dashboard-header-actions">
//           <div className="dashboard-date">
//             <span className="dashboard-date-icon">▦</span>

//             <div className="dashboard-date-info">
//               <span>{formattedDate}</span>
//               <span>{formattedTime}</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="dashboard-refresh-btn"
//             onClick={fetchDashboardOverview}
//             disabled={loading}
//           >
//             <RefreshCw size={15} className={loading ? "refresh-spinning" : ""} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="dashboard-message" role="status">
//           Loading dashboard data...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="dashboard-error" role="alert">
//           <AlertTriangle size={18} />
//           <span>{error}</span>

//           <button type="button" onClick={fetchDashboardOverview}>
//             Try Again
//           </button>
//         </div>
//       )}

//       {!loading && overview && (
//         <>
//           {/* KPI Cards */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Dashboard Overview</h2>
//                 <p>Today's performance and current operations</p>
//               </div>
//               <span className="dashboard-live-badge">
//                 <span className="dashboard-live-dot" />
//                 Live Data
//               </span>
//             </div>

//             <div className="dashboard-stats dashboard-stats-expanded">
//               {statCards.map((stat) => {
//                 const Icon = stat.icon;

//                 return (
//                   <article className="stat-card" key={stat.title}>
//                     <div className={`stat-icon ${stat.type}`}>
//                       <Icon size={23} />
//                     </div>

//                     <div className="stat-content">
//                       <p className="stat-title">{stat.title}</p>
//                       <h2 className="stat-value">{stat.value}</h2>

//                       <div className="stat-growth">
//                         {stat.change != null ? (
//                           <>
//                             {getChangeIcon(stat.change)}
//                             <span
//                               className={
//                                 Number(stat.change) < 0
//                                   ? "dashboard-negative"
//                                   : "dashboard-positive"
//                               }
//                             >
//                               {Number(stat.change) > 0 ? "+" : ""}
//                               {stat.change}%
//                             </span>
//                             <small>vs. previous period</small>
//                           </>
//                         ) : (
//                           <small>Current value</small>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Alerts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Alerts &amp; Action Required</h2>
//                 <p>Items that may need administrator attention</p>
//               </div>
//             </div>

//             <div className="dashboard-alert-grid">
//               {alertCards.map((item) => {
//                 const Icon = item.icon;
//                 const alert = alerts?.[item.key];
//                 const count = alert?.count ?? 0;

//                 return (
//                   <article
//                     className={`dashboard-alert-card severity-${alert?.severity || "info"}`}
//                     key={item.key}
//                   >
//                     <div className="dashboard-alert-top">
//                       <div className="dashboard-alert-icon">
//                         <Icon size={20} />
//                       </div>

//                       <span className="dashboard-alert-count">{count}</span>
//                     </div>

//                     <h3>{item.title}</h3>
//                     <p>{alert?.label || item.fallbackLabel}</p>

//                     {item.key === "pending_payouts" && (
//                       <div className="dashboard-payout-amount">
//                         {formatCurrency(alert?.amount)}
//                       </div>
//                     )}

//                     {alert?.link && (
//                       <a
//                         className="dashboard-alert-link"
//                         href={alert.link}
//                       >
//                         View details <span>→</span>
//                       </a>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Seven-day charts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Weekly Analytics</h2>
//                 <p>
//                   Revenue and completed ride activity over the last{" "}
//                   {charts?.days ?? 7} days
//                 </p>
//               </div>
//             </div>

//             <div className="dashboard-charts-grid">
//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Revenue Overview</h3>
//                     <p>Daily revenue in INR</p>
//                   </div>
//                   <div className="dashboard-chart-icon revenue-chart-icon">
//                     <IndianRupee size={18} />
//                   </div>
//                 </div>

//                 {revenueData.length === 0 ? (
//                   <p className="dashboard-empty">No revenue chart data available.</p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {revenueData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${formatCurrency(item.amount)}`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {Number(item.amount) > 0
//                             ? formatCurrency(item.amount)
//                             : "₹0"}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar revenue-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.amount || 0) / maxRevenue) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>

//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Rides Overview</h3>
//                     <p>Daily ride count</p>
//                   </div>
//                   <div className="dashboard-chart-icon rides-chart-icon">
//                     <Car size={18} />
//                   </div>
//                 </div>

//                 {ridesData.length === 0 ? (
//                   <p className="dashboard-empty">No ride chart data available.</p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {ridesData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${item.count} rides`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {item.count}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar rides-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.count || 0) / maxRides) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>
//             </div>
//           </section>

//           {/* Live Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Live Rides</h2>
//                 <p>Currently active rides from the API</p>
//               </div>

//               <span className="dashboard-table-count">
//                 {liveRides.length} rides
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {liveRides.length > 0 ? (
//                     liveRides.map((ride, index) => (
//                       <tr key={ride.ride_id ?? ride.ride_unique_id ?? index}>
//                         <td>
//                           {ride.ride_unique_id || ride.ride_id || "—"}
//                         </td>
//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="dashboard-table-empty">
//                         <Activity size={22} />
//                         <span>No live rides at the moment.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* Cancelled Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Cancelled Rides</h2>
//                 <p>Cancellation history and reasons reported by the API</p>
//               </div>

//               <span className="dashboard-table-count">
//                 {cancellations.length} records
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                     <th>Cancelled By</th>
//                     <th>Reason</th>
//                     <th>Cancelled At</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {cancellations.length > 0 ? (
//                     cancellations.map((ride, index) => (
//                       <tr key={ride.ride_id ?? index}>
//                         <td>
//                           <span className="dashboard-ride-id">
//                             {ride.ride_unique_id || `#${ride.ride_id}`}
//                           </span>
//                         </td>

//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>

//                         <td>
//                           <span
//                             className={`dashboard-cancelled-by ${
//                               ride.cancelled_by === "DRIVER"
//                                 ? "cancelled-driver"
//                                 : "cancelled-user"
//                             }`}
//                           >
//                             {ride.cancelled_by || "Unknown"}
//                           </span>
//                         </td>

//                         <td>
//                           <span className="dashboard-cancel-reason">
//                             <XCircle size={14} />
//                             {ride.cancel_reason || "Not provided"}
//                           </span>
//                         </td>

//                         <td>{formatDateTime(ride.cancelled_at)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="dashboard-table-empty">
//                         <CheckCircle size={22} />
//                         <span>No cancelled rides found.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

// export default Dashboard;



// import React, { useEffect, useState } from "react";
// import {
//   Car,
//   IndianRupee,
//   Users,
//   UserRound,
//   Activity,
//   ShieldCheck,
//   AlertTriangle,
//   CreditCard,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   XCircle,
//   CheckCircle,
// } from "lucide-react";

// import { adminApi } from "../services/api";
// import "../styles/Dashboard.css";

// function Dashboard() {
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeAlertModal, setActiveAlertModal] = useState(null);

//   const fetchDashboardOverview = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token =
//         sessionStorage.getItem("accessToken") ||
//         localStorage.getItem("accessToken");

//       if (!token) {
//         throw new Error("Please log in again to access the dashboard.");
//       }

//       const response = await adminApi.getDashboardOverview(token);

//       console.log("Dashboard Overview API response:", response);

//       if (!response?.success || !response?.data) {
//         throw new Error(
//           response?.message || "Invalid dashboard overview response."
//         );
//       }

//       setOverview(response.data);
//     } catch (err) {
//       console.error("Dashboard Overview API error:", err);
//       setError(err.message || "Failed to load dashboard overview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardOverview();
//   }, []);

//   useEffect(() => {
//     if (!activeAlertModal) return undefined;

//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") {
//         setActiveAlertModal(null);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [activeAlertModal]);

//   const kpis = overview?.kpis;
//   const todayKpis = kpis?.today;
//   const liveKpis = kpis?.live;
//   const alerts = overview?.alerts;
//   const charts = overview?.charts;

//   const liveRides = overview?.live_rides ?? [];
//   const cancellations = overview?.cancellations ?? [];

//   const formatCurrency = (value) =>
//     value == null
//       ? "—"
//       : new Intl.NumberFormat("en-IN", {
//           style: "currency",
//           currency: "INR",
//           maximumFractionDigits: 2,
//         }).format(value);

//   const formatDateTime = (value) => {
//     if (!value) return "—";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return value;

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const today = new Date();

//   const formattedDate = today.toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const formattedTime = today.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   const hour = today.getHours();

//   const greeting =
//     hour < 12
//       ? "Good Morning"
//       : hour < 17
//         ? "Good Afternoon"
//         : "Good Evening";

//   const statCards = [
//     {
//       title: "Today's Rides",
//       value: todayKpis?.rides ?? "—",
//       change: todayKpis?.rides_change_pct,
//       icon: Car,
//       type: "yellow",
//     },
//     {
//       title: "Today's Revenue",
//       value: formatCurrency(todayKpis?.revenue),
//       change: todayKpis?.revenue_change_pct,
//       icon: IndianRupee,
//       type: "green",
//     },
//     {
//       title: "New Users Today",
//       value: todayKpis?.new_users ?? "—",
//       change: todayKpis?.new_users_change_pct,
//       icon: Users,
//       type: "purple",
//     },
//     {
//       title: "Online Drivers",
//       value: liveKpis?.active_drivers ?? "—",
//       icon: UserRound,
//       type: "blue",
//     },
//     {
//       title: "Active Rides",
//       value: liveKpis?.active_rides ?? "—",
//       icon: Activity,
//       type: "green",
//     },
//     {
//       title: "Pending KYC",
//       value: liveKpis?.pending_kyc ?? "—",
//       icon: ShieldCheck,
//       type: "orange",
//     },
//   ];

//   const alertCards = [
//     {
//       key: "pending_kyc",
//       title: "Pending KYC",
//       icon: ShieldCheck,
//       fallbackLabel: "Drivers waiting KYC approval",
//     },
//     {
//       key: "payment_disputes",
//       title: "Payment Disputes",
//       icon: CreditCard,
//       fallbackLabel: "Payment disputes open",
//     },
//     {
//       key: "stuck_rides",
//       title: "Stuck Rides",
//       icon: Clock,
//       fallbackLabel: "Rides stuck in searching (>10 min)",
//     },
//     {
//       key: "pending_payouts",
//       title: "Pending Payouts",
//       icon: IndianRupee,
//       fallbackLabel: "Pending driver payouts",
//     },
//   ];

//   const revenueData = charts?.revenue ?? [];
//   const ridesData = charts?.rides ?? [];

//   const maxRevenue = Math.max(
//     ...revenueData.map((item) => Number(item.amount) || 0),
//     1
//   );

//   const maxRides = Math.max(
//     ...ridesData.map((item) => Number(item.count) || 0),
//     1
//   );

//   const getChangeIcon = (change) => {
//     if (change == null) return null;

//     return Number(change) < 0 ? (
//       <TrendingDown size={14} />
//     ) : (
//       <TrendingUp size={14} />
//     );
//   };

//   const openAlertModal = (item, alert, count) => {
//     setActiveAlertModal({
//       key: item.key,
//       title: item.title,
//       count,
//       amount: alert?.amount,
//       label: alert?.label || item.fallbackLabel,
//       severity: alert?.severity || "info",
//     });
//   };

//   return (
//     <div className="dashboard-page">
//       {/* Page Header */}
//       <div className="dashboard-header">
//         <div className="dashboard-heading">
//           <span className="dashboard-eyebrow">RIDE OPERATIONS</span>

//           <h1>
//             {greeting}, Admin <span>👋</span>
//           </h1>

//           <p>Here's what's happening with RideBuddy today.</p>
//         </div>

//         <div className="dashboard-header-actions">
//           <div className="dashboard-date">
//             <span className="dashboard-date-icon">▦</span>

//             <div className="dashboard-date-info">
//               <span>{formattedDate}</span>
//               <span>{formattedTime}</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="dashboard-refresh-btn"
//             onClick={fetchDashboardOverview}
//             disabled={loading}
//           >
//             <RefreshCw
//               size={15}
//               className={loading ? "refresh-spinning" : ""}
//             />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="dashboard-message" role="status">
//           Loading dashboard data...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="dashboard-error" role="alert">
//           <AlertTriangle size={18} />
//           <span>{error}</span>

//           <button type="button" onClick={fetchDashboardOverview}>
//             Try Again
//           </button>
//         </div>
//       )}

//       {!loading && overview && (
//         <>
//           {/* KPI Cards */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Dashboard Overview</h2>
//                 <p>Today's performance and current operations</p>
//               </div>

//               <span className="dashboard-live-badge">
//                 <span className="dashboard-live-dot" />
//                 Live Data
//               </span>
//             </div>

//             <div className="dashboard-stats dashboard-stats-expanded">
//               {statCards.map((stat) => {
//                 const Icon = stat.icon;

//                 return (
//                   <article className="stat-card" key={stat.title}>
//                     <div className={`stat-icon ${stat.type}`}>
//                       <Icon size={23} />
//                     </div>

//                     <div className="stat-content">
//                       <p className="stat-title">{stat.title}</p>
//                       <h2 className="stat-value">{stat.value}</h2>

//                       <div className="stat-growth">
//                         {stat.change != null ? (
//                           <>
//                             {getChangeIcon(stat.change)}

//                             <span
//                               className={
//                                 Number(stat.change) < 0
//                                   ? "dashboard-negative"
//                                   : "dashboard-positive"
//                               }
//                             >
//                               {Number(stat.change) > 0 ? "+" : ""}
//                               {stat.change}%
//                             </span>

//                             <small>vs. previous period</small>
//                           </>
//                         ) : (
//                           <small>Current value</small>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Alerts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Alerts &amp; Action Required</h2>
//                 <p>Items that may need administrator attention</p>
//               </div>
//             </div>

//             <div className="dashboard-alert-grid">
//               {alertCards.map((item) => {
//                 const Icon = item.icon;
//                 const alert = alerts?.[item.key];
//                 const count = alert?.count ?? 0;

//                 return (
//                   <article
//                     className={`dashboard-alert-card severity-${alert?.severity || "info"}`}
//                     key={item.key}
//                   >
//                     <div className="dashboard-alert-top">
//                       <div className="dashboard-alert-icon">
//                         <Icon size={20} />
//                       </div>

//                       <span className="dashboard-alert-count">{count}</span>
//                     </div>

//                     <h3>{item.title}</h3>
//                     <p>{alert?.label || item.fallbackLabel}</p>

//                     {item.key === "pending_payouts" && (
//                       <div className="dashboard-payout-amount">
//                         {formatCurrency(alert?.amount)}
//                       </div>
//                     )}

//                     {[
//                       "payment_disputes",
//                       "stuck_rides",
//                       "pending_payouts",
//                     ].includes(item.key) && (
//                       <button
//                         type="button"
//                         className="dashboard-alert-link"
//                         onClick={() => openAlertModal(item, alert, count)}
//                       >
//                         View details <span>→</span>
//                       </button>
//                     )}

//                     {item.key === "pending_kyc" && alert?.link && (
//                       <a
//                         className="dashboard-alert-link"
//                         href={alert.link}
//                       >
//                         View details <span>→</span>
//                       </a>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Seven-day charts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Weekly Analytics</h2>
//                 <p>
//                   Revenue and completed ride activity over the last{" "}
//                   {charts?.days ?? 7} days
//                 </p>
//               </div>
//             </div>

//             <div className="dashboard-charts-grid">
//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Revenue Overview</h3>
//                     <p>Daily revenue in INR</p>
//                   </div>

//                   <div className="dashboard-chart-icon revenue-chart-icon">
//                     <IndianRupee size={18} />
//                   </div>
//                 </div>

//                 {revenueData.length === 0 ? (
//                   <p className="dashboard-empty">
//                     No revenue chart data available.
//                   </p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {revenueData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${formatCurrency(item.amount)}`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {Number(item.amount) > 0
//                             ? formatCurrency(item.amount)
//                             : "₹0"}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar revenue-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.amount || 0) / maxRevenue) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>

//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Rides Overview</h3>
//                     <p>Daily ride count</p>
//                   </div>

//                   <div className="dashboard-chart-icon rides-chart-icon">
//                     <Car size={18} />
//                   </div>
//                 </div>

//                 {ridesData.length === 0 ? (
//                   <p className="dashboard-empty">
//                     No ride chart data available.
//                   </p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {ridesData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${item.count} rides`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {item.count}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar rides-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.count || 0) / maxRides) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>
//             </div>
//           </section>

//           {/* Live Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Live Rides</h2>
//                 <p>Currently active rides from the API</p>
//               </div>

//               <span className="dashboard-table-count">
//                 {liveRides.length} rides
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {liveRides.length > 0 ? (
//                     liveRides.map((ride, index) => (
//                       <tr
//                         key={ride.ride_id ?? ride.ride_unique_id ?? index}
//                       >
//                         <td>
//                           {ride.ride_unique_id || ride.ride_id || "—"}
//                         </td>
//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="dashboard-table-empty">
//                         <Activity size={22} />
//                         <span>No live rides at the moment.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* Cancelled Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Cancelled Rides</h2>
//                 <p>
//                   Cancellation history and reasons reported by the API
//                 </p>
//               </div>

//               <span className="dashboard-table-count">
//                 {cancellations.length} records
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                     <th>Cancelled By</th>
//                     <th>Reason</th>
//                     <th>Cancelled At</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {cancellations.length > 0 ? (
//                     cancellations.map((ride, index) => (
//                       <tr key={ride.ride_id ?? index}>
//                         <td>
//                           <span className="dashboard-ride-id">
//                             {ride.ride_unique_id || `#${ride.ride_id}`}
//                           </span>
//                         </td>

//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>

//                         <td>
//                           <span
//                             className={`dashboard-cancelled-by ${
//                               ride.cancelled_by === "DRIVER"
//                                 ? "cancelled-driver"
//                                 : "cancelled-user"
//                             }`}
//                           >
//                             {ride.cancelled_by || "Unknown"}
//                           </span>
//                         </td>

//                         <td>
//                           <span className="dashboard-cancel-reason">
//                             <XCircle size={14} />
//                             {ride.cancel_reason || "Not provided"}
//                           </span>
//                         </td>

//                         <td>{formatDateTime(ride.cancelled_at)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="dashboard-table-empty">
//                         <CheckCircle size={22} />
//                         <span>No cancelled rides found.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       )}

//       {/* Alert Details Modal */}
//       {activeAlertModal && (
//         <div
//           className="dashboard-modal-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setActiveAlertModal(null);
//             }
//           }}
//         >
//           <section
//             className="dashboard-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="dashboard-modal-title"
//           >
//             <header className="dashboard-modal-header">
//               <div>
//                 <span className="dashboard-modal-eyebrow">
//                   RIDE OPERATIONS
//                 </span>

//                 <h2 id="dashboard-modal-title">
//                   {activeAlertModal.title}
//                 </h2>

//                 <p>{activeAlertModal.label}</p>
//               </div>

//               <button
//                 type="button"
//                 className="dashboard-modal-close"
//                 aria-label="Close dialog"
//                 onClick={() => setActiveAlertModal(null)}
//               >
//                 <XCircle size={21} />
//               </button>
//             </header>

//             <div className="dashboard-modal-body">
//               <div className="dashboard-modal-summary">
//                 <div>
//                   <span className="dashboard-modal-summary-label">
//                     {activeAlertModal.key === "payment_disputes"
//                       ? "Open disputes"
//                       : activeAlertModal.key === "stuck_rides"
//                         ? "Rides requiring attention"
//                         : "Pending payouts"}
//                   </span>

//                   <strong>{activeAlertModal.count}</strong>
//                 </div>

//                 {activeAlertModal.key === "pending_payouts" && (
//                   <div>
//                     <span className="dashboard-modal-summary-label">
//                       Pending amount
//                     </span>

//                     <strong className="dashboard-modal-amount">
//                       {formatCurrency(activeAlertModal.amount)}
//                     </strong>
//                   </div>
//                 )}
//               </div>

//               {activeAlertModal.key === "payment_disputes" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon dispute">
//                     <CreditCard size={22} />
//                   </div>

//                   <div>
//                     <h3>Payment dispute management</h3>
//                     <p>
//                       Review disputed payments, transaction references,
//                       dispute reasons and resolution status.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {activeAlertModal.key === "stuck_rides" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon stuck">
//                     <Clock size={22} />
//                   </div>

//                   <div>
//                     <h3>Stuck ride monitoring</h3>
//                     <p>
//                       Review rides that have remained in searching status
//                       for more than 10 minutes and investigate their
//                       current progress.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {activeAlertModal.key === "pending_payouts" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon payout">
//                     <IndianRupee size={22} />
//                   </div>

//                   <div>
//                     <h3>Driver payout management</h3>
//                     <p>
//                       Review pending driver payments, payout amounts and
//                       payment processing status.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="dashboard-modal-notice">
//                 <AlertTriangle size={18} />

//                 <p>
//                   This modal displays the alert summary from the dashboard
//                   API. Detailed records and management actions require the
//                   corresponding API endpoints to be connected.
//                 </p>
//               </div>
//             </div>

//             <footer className="dashboard-modal-footer">
//               <button
//                 type="button"
//                 className="dashboard-modal-done"
//                 onClick={() => setActiveAlertModal(null)}
//               >
//                 Close
//               </button>
//             </footer>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;




// import React, { useEffect, useState } from "react";
// import {
//   Car,
//   IndianRupee,
//   Users,
//   UserRound,
//   Activity,
//   ShieldCheck,
//   AlertTriangle,
//   CreditCard,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   XCircle,
//   CheckCircle,
// } from "lucide-react";

// import { adminApi } from "../services/api";
// import "../styles/Dashboard.css";

// /* =========================================
//    DASHBOARD SKELETON LOADER
// ========================================= */

// function DashboardSkeleton() {
//   return (
//     <div className="dashboard-loading" role="status" aria-label="Loading dashboard">
//       {/* KPI Skeleton Cards */}
//       <section className="dashboard-section">
//         <div className="dashboard-section-heading">
//           <div>
//             <div className="skeleton skeleton-heading" />
//             <div className="skeleton skeleton-subheading" />
//           </div>
//         </div>

//         <div className="dashboard-stats dashboard-stats-expanded">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <article className="stat-card dashboard-skeleton-card" key={index}>
//               <div className="skeleton skeleton-icon" />

//               <div className="stat-content">
//                 <div className="skeleton skeleton-title" />
//                 <div className="skeleton skeleton-value" />
//                 <div className="skeleton skeleton-growth" />
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Alert Skeleton Cards */}
//       <section className="dashboard-section">
//         <div className="dashboard-section-heading">
//           <div>
//             <div className="skeleton skeleton-heading" />
//             <div className="skeleton skeleton-subheading" />
//           </div>
//         </div>

//         <div className="dashboard-alert-grid">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <article className="dashboard-alert-card" key={index}>
//               <div className="skeleton skeleton-icon" />
//               <div className="skeleton skeleton-alert-title" />
//               <div className="skeleton skeleton-alert-text" />
//               <div className="skeleton skeleton-alert-link" />
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Chart Skeleton Cards */}
//       <section className="dashboard-section">
//         <div className="dashboard-section-heading">
//           <div>
//             <div className="skeleton skeleton-heading" />
//             <div className="skeleton skeleton-subheading" />
//           </div>
//         </div>

//         <div className="dashboard-charts-grid">
//           {[1, 2].map((item) => (
//             <article className="dashboard-panel" key={item}>
//               <div className="skeleton skeleton-heading" />
//               <div className="skeleton skeleton-chart" />
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Table Skeleton Cards */}
//       {[1, 2].map((item) => {
//         const columnCount = item === 1 ? 6 : 9;

//         return (
//           <section className="dashboard-section" key={item}>
//             <div className="dashboard-section-heading">
//               <div>
//                 <div className="skeleton skeleton-heading" />
//                 <div className="skeleton skeleton-subheading" />
//               </div>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     {Array.from({ length: columnCount }).map((_, index) => (
//                       <th key={index}> </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {Array.from({ length: 4 }).map((_, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {Array.from({ length: columnCount }).map((_, colIndex) => (
//                         <td key={colIndex}>
//                           <div className="skeleton skeleton-table-cell" />
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         );
//       })}

//       <span className="sr-only">Loading dashboard data...</span>
//     </div>
//   );
// }

// function Dashboard() {
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeAlertModal, setActiveAlertModal] = useState(null);

//   const fetchDashboardOverview = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token =
//         sessionStorage.getItem("accessToken") ||
//         localStorage.getItem("accessToken");

//       if (!token) {
//         throw new Error("Please log in again to access the dashboard.");
//       }

//       const response = await adminApi.getDashboardOverview(token);

//       console.log("Dashboard Overview API response:", response);

//       if (!response?.success || !response?.data) {
//         throw new Error(
//           response?.message || "Invalid dashboard overview response."
//         );
//       }

//       setOverview(response.data);
//     } catch (err) {
//       console.error("Dashboard Overview API error:", err);
//       setError(err.message || "Failed to load dashboard overview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardOverview();
//   }, []);

//   useEffect(() => {
//     if (!activeAlertModal) return undefined;

//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") {
//         setActiveAlertModal(null);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [activeAlertModal]);

//   const kpis = overview?.kpis;
//   const todayKpis = kpis?.today;
//   const liveKpis = kpis?.live;
//   const alerts = overview?.alerts;
//   const charts = overview?.charts;

//   const liveRides = overview?.live_rides ?? [];
//   const cancellations = overview?.cancellations ?? [];

//   const formatCurrency = (value) =>
//     value == null
//       ? "—"
//       : new Intl.NumberFormat("en-IN", {
//           style: "currency",
//           currency: "INR",
//           maximumFractionDigits: 2,
//         }).format(value);

//   const formatDateTime = (value) => {
//     if (!value) return "—";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) return value;

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const today = new Date();

//   const formattedDate = today.toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const formattedTime = today.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   const hour = today.getHours();

//   const greeting =
//     hour < 12
//       ? "Good Morning"
//       : hour < 17
//         ? "Good Afternoon"
//         : "Good Evening";

//   const statCards = [
//     {
//       title: "Today's Rides",
//       value: todayKpis?.rides ?? "—",
//       change: todayKpis?.rides_change_pct,
//       icon: Car,
//       type: "yellow",
//     },
//     {
//       title: "Today's Revenue",
//       value: formatCurrency(todayKpis?.revenue),
//       change: todayKpis?.revenue_change_pct,
//       icon: IndianRupee,
//       type: "green",
//     },
//     {
//       title: "New Users Today",
//       value: todayKpis?.new_users ?? "—",
//       change: todayKpis?.new_users_change_pct,
//       icon: Users,
//       type: "purple",
//     },
//     {
//       title: "Online Drivers",
//       value: liveKpis?.active_drivers ?? "—",
//       icon: UserRound,
//       type: "blue",
//     },
//     {
//       title: "Active Rides",
//       value: liveKpis?.active_rides ?? "—",
//       icon: Activity,
//       type: "green",
//     },
//     {
//       title: "Pending KYC",
//       value: liveKpis?.pending_kyc ?? "—",
//       icon: ShieldCheck,
//       type: "orange",
//     },
//   ];

//   const alertCards = [
//     {
//       key: "pending_kyc",
//       title: "Pending KYC",
//       icon: ShieldCheck,
//       fallbackLabel: "Drivers waiting KYC approval",
//     },
//     {
//       key: "payment_disputes",
//       title: "Payment Disputes",
//       icon: CreditCard,
//       fallbackLabel: "Payment disputes open",
//     },
//     {
//       key: "stuck_rides",
//       title: "Stuck Rides",
//       icon: Clock,
//       fallbackLabel: "Rides stuck in searching (>10 min)",
//     },
//     {
//       key: "pending_payouts",
//       title: "Pending Payouts",
//       icon: IndianRupee,
//       fallbackLabel: "Pending driver payouts",
//     },
//   ];

//   const revenueData = charts?.revenue ?? [];
//   const ridesData = charts?.rides ?? [];

//   const maxRevenue = Math.max(
//     ...revenueData.map((item) => Number(item.amount) || 0),
//     1
//   );

//   const maxRides = Math.max(
//     ...ridesData.map((item) => Number(item.count) || 0),
//     1
//   );

//   const getChangeIcon = (change) => {
//     if (change == null) return null;

//     return Number(change) < 0 ? (
//       <TrendingDown size={14} />
//     ) : (
//       <TrendingUp size={14} />
//     );
//   };

//   const openAlertModal = (item, alert, count) => {
//     setActiveAlertModal({
//       key: item.key,
//       title: item.title,
//       count,
//       amount: alert?.amount,
//       label: alert?.label || item.fallbackLabel,
//       severity: alert?.severity || "info",
//     });
//   };

//   return (
//     <div className="dashboard-page">
//       {/* Page Header */}
//       <div className="dashboard-header">
//         <div className="dashboard-heading">
//           <span className="dashboard-eyebrow">RIDE OPERATIONS</span>

//           <h1>
//             {greeting}, Admin <span>👋</span>
//           </h1>

//           <p>Here's what's happening with RideBuddy today.</p>
//         </div>

//         <div className="dashboard-header-actions">
//           <div className="dashboard-date">
//             <span className="dashboard-date-icon">▦</span>

//             <div className="dashboard-date-info">
//               <span>{formattedDate}</span>
//               <span>{formattedTime}</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="dashboard-refresh-btn"
//             onClick={fetchDashboardOverview}
//             disabled={loading}
//           >
//             <RefreshCw
//               size={15}
//               className={loading ? "refresh-spinning" : ""}
//             />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Loading Skeleton */}
//       {loading && <DashboardSkeleton />}

//       {/* Error Message */}
//       {!loading && error && (
//         <div className="dashboard-error" role="alert">
//           <AlertTriangle size={18} />
//           <span>{error}</span>

//           <button type="button" onClick={fetchDashboardOverview}>
//             Try Again
//           </button>
//         </div>
//       )}

//       {!loading && overview && (
//         <>
//           {/* KPI Cards */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Dashboard Overview</h2>
//                 <p>Today's performance and current operations</p>
//               </div>

//               <span className="dashboard-live-badge">
//                 <span className="dashboard-live-dot" />
//                 Live Data
//               </span>
//             </div>

//             <div className="dashboard-stats dashboard-stats-expanded">
//               {statCards.map((stat) => {
//                 const Icon = stat.icon;

//                 return (
//                   <article className="stat-card" key={stat.title}>
//                     <div className={`stat-icon ${stat.type}`}>
//                       <Icon size={23} />
//                     </div>

//                     <div className="stat-content">
//                       <p className="stat-title">{stat.title}</p>
//                       <h2 className="stat-value">{stat.value}</h2>

//                       <div className="stat-growth">
//                         {stat.change != null ? (
//                           <>
//                             {getChangeIcon(stat.change)}

//                             <span
//                               className={
//                                 Number(stat.change) < 0
//                                   ? "dashboard-negative"
//                                   : "dashboard-positive"
//                               }
//                             >
//                               {Number(stat.change) > 0 ? "+" : ""}
//                               {stat.change}%
//                             </span>

//                             <small>vs. previous period</small>
//                           </>
//                         ) : (
//                           <small>Current value</small>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Alerts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Alerts &amp; Action Required</h2>
//                 <p>Items that may need administrator attention</p>
//               </div>
//             </div>

//             <div className="dashboard-alert-grid">
//               {alertCards.map((item) => {
//                 const Icon = item.icon;
//                 const alert = alerts?.[item.key];
//                 const count = alert?.count ?? 0;

//                 return (
//                   <article
//                     className={`dashboard-alert-card severity-${alert?.severity || "info"}`}
//                     key={item.key}
//                   >
//                     <div className="dashboard-alert-top">
//                       <div className="dashboard-alert-icon">
//                         <Icon size={20} />
//                       </div>

//                       <span className="dashboard-alert-count">{count}</span>
//                     </div>

//                     <h3>{item.title}</h3>
//                     <p>{alert?.label || item.fallbackLabel}</p>

//                     {item.key === "pending_payouts" && (
//                       <div className="dashboard-payout-amount">
//                         {formatCurrency(alert?.amount)}
//                       </div>
//                     )}

//                     {[
//                       "payment_disputes",
//                       "stuck_rides",
//                       "pending_payouts",
//                     ].includes(item.key) && (
//                       <button
//                         type="button"
//                         className="dashboard-alert-link"
//                         onClick={() => openAlertModal(item, alert, count)}
//                       >
//                         View details <span>→</span>
//                       </button>
//                     )}

//                     {item.key === "pending_kyc" && alert?.link && (
//                       <a
//                         className="dashboard-alert-link"
//                         href={alert.link}
//                       >
//                         View details <span>→</span>
//                       </a>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Seven-day charts */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Weekly Analytics</h2>
//                 <p>
//                   Revenue and completed ride activity over the last{" "}
//                   {charts?.days ?? 7} days
//                 </p>
//               </div>
//             </div>

//             <div className="dashboard-charts-grid">
//               {/* Revenue Chart */}
//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Revenue Overview</h3>
//                     <p>Daily revenue in INR</p>
//                   </div>

//                   <div className="dashboard-chart-icon revenue-chart-icon">
//                     <IndianRupee size={18} />
//                   </div>
//                 </div>

//                 {revenueData.length === 0 ? (
//                   <p className="dashboard-empty">
//                     No revenue chart data available.
//                   </p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {revenueData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${formatCurrency(item.amount)}`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {Number(item.amount) > 0
//                             ? formatCurrency(item.amount)
//                             : "₹0"}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar revenue-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.amount || 0) / maxRevenue) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>

//               {/* Rides Chart */}
//               <article className="dashboard-panel">
//                 <div className="dashboard-panel-heading">
//                   <div>
//                     <h3>Rides Overview</h3>
//                     <p>Daily ride count</p>
//                   </div>

//                   <div className="dashboard-chart-icon rides-chart-icon">
//                     <Car size={18} />
//                   </div>
//                 </div>

//                 {ridesData.length === 0 ? (
//                   <p className="dashboard-empty">
//                     No ride chart data available.
//                   </p>
//                 ) : (
//                   <div className="dashboard-bar-chart">
//                     {ridesData.map((item) => (
//                       <div
//                         className="dashboard-bar-column"
//                         key={item.date}
//                         title={`${item.label}: ${item.count} rides`}
//                       >
//                         <span className="dashboard-bar-value">
//                           {item.count}
//                         </span>

//                         <div className="dashboard-bar-track">
//                           <div
//                             className="dashboard-bar rides-bar"
//                             style={{
//                               height: `${Math.max(
//                                 (Number(item.count || 0) / maxRides) * 100,
//                                 2
//                               )}%`,
//                             }}
//                           />
//                         </div>

//                         <span className="dashboard-bar-label">
//                           {item.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </article>
//             </div>
//           </section>

//           {/* Live Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Live Rides</h2>
//                 <p>Currently active rides from the API</p>
//               </div>

//               <span className="dashboard-table-count">
//                 {liveRides.length} rides
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {liveRides.length > 0 ? (
//                     liveRides.map((ride, index) => (
//                       <tr
//                         key={ride.ride_id ?? ride.ride_unique_id ?? index}
//                       >
//                         <td>
//                           {ride.ride_unique_id || ride.ride_id || "—"}
//                         </td>
//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="dashboard-table-empty">
//                         <Activity size={22} />
//                         <span>No live rides at the moment.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* Cancelled Rides */}
//           <section className="dashboard-section">
//             <div className="dashboard-section-heading">
//               <div>
//                 <h2>Cancelled Rides</h2>
//                 <p>
//                   Cancellation history and reasons reported by the API
//                 </p>
//               </div>

//               <span className="dashboard-table-count">
//                 {cancellations.length} records
//               </span>
//             </div>

//             <div className="dashboard-table-wrapper">
//               <table className="dashboard-data-table">
//                 <thead>
//                   <tr>
//                     <th>Ride ID</th>
//                     <th>Customer</th>
//                     <th>Driver</th>
//                     <th>Pickup</th>
//                     <th>Drop</th>
//                     <th>Amount</th>
//                     <th>Cancelled By</th>
//                     <th>Reason</th>
//                     <th>Cancelled At</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {cancellations.length > 0 ? (
//                     cancellations.map((ride, index) => (
//                       <tr key={ride.ride_id ?? index}>
//                         <td>
//                           <span className="dashboard-ride-id">
//                             {ride.ride_unique_id || `#${ride.ride_id}`}
//                           </span>
//                         </td>

//                         <td>{ride.customer_name || "—"}</td>
//                         <td>{ride.driver_name || "Not assigned"}</td>
//                         <td>{ride.pickup_address || "—"}</td>
//                         <td>{ride.drop_address || "—"}</td>
//                         <td>{formatCurrency(ride.final_amount)}</td>

//                         <td>
//                           <span
//                             className={`dashboard-cancelled-by ${
//                               ride.cancelled_by === "DRIVER"
//                                 ? "cancelled-driver"
//                                 : "cancelled-user"
//                             }`}
//                           >
//                             {ride.cancelled_by || "Unknown"}
//                           </span>
//                         </td>

//                         <td>
//                           <span className="dashboard-cancel-reason">
//                             <XCircle size={14} />
//                             {ride.cancel_reason || "Not provided"}
//                           </span>
//                         </td>

//                         <td>{formatDateTime(ride.cancelled_at)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="dashboard-table-empty">
//                         <CheckCircle size={22} />
//                         <span>No cancelled rides found.</span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       )}

//       {/* Alert Details Modal */}
//       {activeAlertModal && (
//         <div
//           className="dashboard-modal-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setActiveAlertModal(null);
//             }
//           }}
//         >
//           <section
//             className="dashboard-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="dashboard-modal-title"
//           >
//             <header className="dashboard-modal-header">
//               <div>
//                 <span className="dashboard-modal-eyebrow">
//                   RIDE OPERATIONS
//                 </span>

//                 <h2 id="dashboard-modal-title">
//                   {activeAlertModal.title}
//                 </h2>

//                 <p>{activeAlertModal.label}</p>
//               </div>

//               <button
//                 type="button"
//                 className="dashboard-modal-close"
//                 aria-label="Close dialog"
//                 onClick={() => setActiveAlertModal(null)}
//               >
//                 <XCircle size={21} />
//               </button>
//             </header>

//             <div className="dashboard-modal-body">
//               <div className="dashboard-modal-summary">
//                 <div>
//                   <span className="dashboard-modal-summary-label">
//                     {activeAlertModal.key === "payment_disputes"
//                       ? "Open disputes"
//                       : activeAlertModal.key === "stuck_rides"
//                         ? "Rides requiring attention"
//                         : "Pending payouts"}
//                   </span>

//                   <strong>{activeAlertModal.count}</strong>
//                 </div>

//                 {activeAlertModal.key === "pending_payouts" && (
//                   <div>
//                     <span className="dashboard-modal-summary-label">
//                       Pending amount
//                     </span>

//                     <strong className="dashboard-modal-amount">
//                       {formatCurrency(activeAlertModal.amount)}
//                     </strong>
//                   </div>
//                 )}
//               </div>

//               {activeAlertModal.key === "payment_disputes" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon dispute">
//                     <CreditCard size={22} />
//                   </div>

//                   <div>
//                     <h3>Payment dispute management</h3>
//                     <p>
//                       Review disputed payments, transaction references,
//                       dispute reasons and resolution status.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {activeAlertModal.key === "stuck_rides" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon stuck">
//                     <Clock size={22} />
//                   </div>

//                   <div>
//                     <h3>Stuck ride monitoring</h3>
//                     <p>
//                       Review rides that have remained in searching status
//                       for more than 10 minutes and investigate their
//                       current progress.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {activeAlertModal.key === "pending_payouts" && (
//                 <div className="dashboard-modal-info">
//                   <div className="dashboard-modal-info-icon payout">
//                     <IndianRupee size={22} />
//                   </div>

//                   <div>
//                     <h3>Driver payout management</h3>
//                     <p>
//                       Review pending driver payments, payout amounts and
//                       payment processing status.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="dashboard-modal-notice">
//                 <AlertTriangle size={18} />

//                 <p>
//                   This modal displays the alert summary from the dashboard
//                   API. Detailed records and management actions require the
//                   corresponding API endpoints to be connected.
//                 </p>
//               </div>
//             </div>

//             <footer className="dashboard-modal-footer">
//               <button
//                 type="button"
//                 className="dashboard-modal-done"
//                 onClick={() => setActiveAlertModal(null)}
//               >
//                 Close
//               </button>
//             </footer>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;




import React, { useEffect, useState } from "react";
import {
  Car,
  IndianRupee,
  Users,
  UserRound,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { adminApi } from "../services/api";
import "../styles/Dashboard.css";

/* =========================================
   DASHBOARD SKELETON LOADER
========================================= */

function DashboardSkeleton() {
  return (
    <div className="dashboard-loading" role="status" aria-label="Loading dashboard">
      {/* KPI Skeleton Cards */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-subheading" />
          </div>
        </div>

        <div className="dashboard-stats dashboard-stats-expanded">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="stat-card dashboard-skeleton-card" key={index}>
              <div className="skeleton skeleton-icon" />

              <div className="stat-content">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-value" />
                <div className="skeleton skeleton-growth" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Alert Skeleton Cards */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-subheading" />
          </div>
        </div>

        <div className="dashboard-alert-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <article className="dashboard-alert-card" key={index}>
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-alert-title" />
              <div className="skeleton skeleton-alert-text" />
              <div className="skeleton skeleton-alert-link" />
            </article>
          ))}
        </div>
      </section>

      {/* Chart Skeleton Cards */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-subheading" />
          </div>
        </div>

        <div className="dashboard-charts-grid">
          {[1, 2].map((item) => (
            <article className="dashboard-panel" key={item}>
              <div className="skeleton skeleton-heading" />
              <div className="skeleton skeleton-chart" />
            </article>
          ))}
        </div>
      </section>

      {/* Table Skeleton Cards */}
      {[1, 2].map((item) => {
        const columnCount = item === 1 ? 6 : 9;

        return (
          <section className="dashboard-section" key={item}>
            <div className="dashboard-section-heading">
              <div>
                <div className="skeleton skeleton-heading" />
                <div className="skeleton skeleton-subheading" />
              </div>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-data-table">
                <thead>
                  <tr>
                    {Array.from({ length: columnCount }).map((_, index) => (
                      <th key={index}> </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: columnCount }).map((_, colIndex) => (
                        <td key={colIndex}>
                          <div className="skeleton skeleton-table-cell" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <span className="sr-only">Loading dashboard data...</span>
    </div>
  );
}

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeAlertModal, setActiveAlertModal] = useState(null);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Please log in again to access the dashboard.");
      }

      const response = await adminApi.getDashboardOverview(token);

      console.log("Dashboard Overview API response:", response);

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Invalid dashboard overview response."
        );
      }

      setOverview(response.data);
    } catch (err) {
      console.error("Dashboard Overview API error:", err);
      setError(err.message || "Failed to load dashboard overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  useEffect(() => {
    if (!activeAlertModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveAlertModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeAlertModal]);

  const kpis = overview?.kpis;
  const todayKpis = kpis?.today;
  const liveKpis = kpis?.live;
  const alerts = overview?.alerts;
  const charts = overview?.charts;

  const liveRides = overview?.live_rides ?? [];
  const cancellations = overview?.cancellations ?? [];

  const formatCurrency = (value) =>
    value == null
      ? "—"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(value);

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = today.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
        ? "Good Afternoon"
        : "Good Evening";

  const statCards = [
    {
      title: "Today's Rides",
      value: todayKpis?.rides ?? "—",
      change: todayKpis?.rides_change_pct,
      icon: Car,
      type: "yellow",
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(todayKpis?.revenue),
      change: todayKpis?.revenue_change_pct,
      icon: IndianRupee,
      type: "green",
    },
    {
      title: "New Users Today",
      value: todayKpis?.new_users ?? "—",
      change: todayKpis?.new_users_change_pct,
      icon: Users,
      type: "purple",
    },
    {
      title: "Online Drivers",
      value: liveKpis?.active_drivers ?? "—",
      icon: UserRound,
      type: "blue",
    },
    {
      title: "Active Rides",
      value: liveKpis?.active_rides ?? "—",
      icon: Activity,
      type: "green",
    },
    {
      title: "Pending KYC",
      value: liveKpis?.pending_kyc ?? "—",
      icon: ShieldCheck,
      type: "orange",
    },
  ];

  const alertCards = [
    {
      key: "pending_kyc",
      title: "Pending KYC",
      icon: ShieldCheck,
      fallbackLabel: "Drivers waiting KYC approval",
    },
    {
      key: "payment_disputes",
      title: "Payment Disputes",
      icon: CreditCard,
      fallbackLabel: "Payment disputes open",
    },
    {
      key: "stuck_rides",
      title: "Stuck Rides",
      icon: Clock,
      fallbackLabel: "Rides stuck in searching (>10 min)",
    },
    {
      key: "pending_payouts",
      title: "Pending Payouts",
      icon: IndianRupee,
      fallbackLabel: "Pending driver payouts",
    },
  ];

  const revenueData = charts?.revenue ?? [];
  const ridesData = charts?.rides ?? [];

  const maxRevenue = Math.max(
    ...revenueData.map((item) => Number(item.amount) || 0),
    1
  );

  const maxRides = Math.max(
    ...ridesData.map((item) => Number(item.count) || 0),
    1
  );

  const getChangeIcon = (change) => {
    if (change == null) return null;

    return Number(change) < 0 ? (
      <TrendingDown size={14} />
    ) : (
      <TrendingUp size={14} />
    );
  };

  const openAlertModal = (item, alert, count) => {
    setActiveAlertModal({
      key: item.key,
      title: item.title,
      count,
      amount: alert?.amount,
      label: alert?.label || item.fallbackLabel,
      severity: alert?.severity || "info",
    });
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow">RIDE OPERATIONS</span>

          <h1>
            {greeting}, Admin <span>👋</span>
          </h1>

          <p>Here's what's happening with RideBuddy today.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-date">
            <span className="dashboard-date-icon">▦</span>

            <div className="dashboard-date-info">
              <span>{formattedDate}</span>
              <span>{formattedTime}</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={fetchDashboardOverview}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "refresh-spinning" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && <DashboardSkeleton />}

      {/* Error Message */}
      {!loading && error && (
        <div className="dashboard-error" role="alert">
          <AlertTriangle size={18} />
          <span>{error}</span>

          <button type="button" onClick={fetchDashboardOverview}>
            Try Again
          </button>
        </div>
      )}

      {!loading && overview && (
        <>
          {/* KPI Cards */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Today's performance and current operations</p>
              </div>

              <span className="dashboard-live-badge">
                <span className="dashboard-live-dot" />
                Live Data
              </span>
            </div>

            <div className="dashboard-stats dashboard-stats-expanded">
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article className="stat-card" key={stat.title}>
                    <div className={`stat-icon ${stat.type}`}>
                      <Icon size={23} />
                    </div>

                    <div className="stat-content">
                      <p className="stat-title">{stat.title}</p>
                      <h2 className="stat-value">{stat.value}</h2>

                      <div className="stat-growth">
                        {stat.change != null ? (
                          <>
                            {getChangeIcon(stat.change)}

                            <span
                              className={
                                Number(stat.change) < 0
                                  ? "dashboard-negative"
                                  : "dashboard-positive"
                              }
                            >
                              {Number(stat.change) > 0 ? "+" : ""}
                              {stat.change}%
                            </span>

                            <small>vs. previous period</small>
                          </>
                        ) : (
                          <small>Current value</small>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Alerts */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Alerts &amp; Action Required</h2>
                <p>Items that may need administrator attention</p>
              </div>
            </div>

            <div className="dashboard-alert-grid">
              {alertCards.map((item) => {
                const Icon = item.icon;
                const alert = alerts?.[item.key];
                const count = alert?.count ?? 0;

                return (
                  <article
                    className={`dashboard-alert-card severity-${alert?.severity || "info"}`}
                    key={item.key}
                  >
                    <div className="dashboard-alert-top">
                      <div className="dashboard-alert-icon">
                        <Icon size={20} />
                      </div>

                      <span className="dashboard-alert-count">{count}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{alert?.label || item.fallbackLabel}</p>

                    {item.key === "pending_payouts" && (
                      <div className="dashboard-payout-amount">
                        {formatCurrency(alert?.amount)}
                      </div>
                    )}

                    {[
                      "payment_disputes",
                      "stuck_rides",
                      "pending_payouts",
                    ].includes(item.key) && (
                      <button
                        type="button"
                        className="dashboard-alert-link"
                        onClick={() => openAlertModal(item, alert, count)}
                      >
                        View details <span>→</span>
                      </button>
                    )}

                    {item.key === "pending_kyc" && alert?.link && (
                      <a
                        className="dashboard-alert-link"
                        href={alert.link}
                      >
                        View details <span>→</span>
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Seven-day charts */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Weekly Analytics</h2>
                <p>
                  Revenue and completed ride activity over the last{" "}
                  {charts?.days ?? 7} days
                </p>
              </div>
            </div>

            <div className="dashboard-charts-grid">
              {/* Revenue Chart */}
              <article className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h3>Revenue Overview</h3>
                    <p>Daily revenue in INR</p>
                  </div>

                  <div className="dashboard-chart-icon revenue-chart-icon">
                    <IndianRupee size={18} />
                  </div>
                </div>

                {revenueData.length === 0 ? (
                  <p className="dashboard-empty">
                    No revenue chart data available.
                  </p>
                ) : (
                  <div className="dashboard-bar-chart">
                    {revenueData.map((item) => (
                      <div
                        className="dashboard-bar-column"
                        key={item.date}
                        title={`${item.label}: ${formatCurrency(item.amount)}`}
                      >
                        <span className="dashboard-bar-value">
                          {Number(item.amount) > 0
                            ? formatCurrency(item.amount)
                            : "₹0"}
                        </span>

                        <div className="dashboard-bar-track">
                          <div
                            className="dashboard-bar revenue-bar"
                            style={{
                              height: `${Math.max(
                                (Number(item.amount || 0) / maxRevenue) * 100,
                                2
                              )}%`,
                            }}
                          />
                        </div>

                        <span className="dashboard-bar-label">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              {/* Rides Chart */}
              <article className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h3>Rides Overview</h3>
                    <p>Daily ride count</p>
                  </div>

                  <div className="dashboard-chart-icon rides-chart-icon">
                    <Car size={18} />
                  </div>
                </div>

                {ridesData.length === 0 ? (
                  <p className="dashboard-empty">
                    No ride chart data available.
                  </p>
                ) : (
                  <div className="dashboard-bar-chart">
                    {ridesData.map((item) => (
                      <div
                        className="dashboard-bar-column"
                        key={item.date}
                        title={`${item.label}: ${item.count} rides`}
                      >
                        <span className="dashboard-bar-value">
                          {item.count}
                        </span>

                        <div className="dashboard-bar-track">
                          <div
                            className="dashboard-bar rides-bar"
                            style={{
                              height: `${Math.max(
                                (Number(item.count || 0) / maxRides) * 100,
                                2
                              )}%`,
                            }}
                          />
                        </div>

                        <span className="dashboard-bar-label">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </section>

          {/* Live Rides */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Live Rides</h2>
                <p>Currently active rides from the API</p>
              </div>

              <span className="dashboard-table-count">
                {liveRides.length} rides
              </span>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-data-table">
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {liveRides.length > 0 ? (
                    liveRides.map((ride, index) => (
                      <tr
                        key={ride.ride_id ?? ride.ride_unique_id ?? index}
                      >
                        <td>
                          {ride.ride_unique_id || ride.ride_id || "—"}
                        </td>
                        <td>{ride.customer_name || "—"}</td>
                        <td>{ride.driver_name || "Not assigned"}</td>
                        <td>{ride.pickup_address || "—"}</td>
                        <td>{ride.drop_address || "—"}</td>
                        <td>{formatCurrency(ride.final_amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="dashboard-table-empty">
                        <Activity size={22} />
                        <span>No live rides at the moment.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Cancelled Rides */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Cancelled Rides</h2>
                <p>
                  Cancellation history and reasons reported by the API
                </p>
              </div>

              <span className="dashboard-table-count">
                {cancellations.length} records
              </span>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-data-table">
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Amount</th>
                    <th>Cancelled By</th>
                    <th>Reason</th>
                    <th>Cancelled At</th>
                  </tr>
                </thead>

                <tbody>
                  {cancellations.length > 0 ? (
                    cancellations.map((ride, index) => (
                      <tr key={ride.ride_id ?? index}>
                        <td>
                          <span className="dashboard-ride-id">
                            {ride.ride_unique_id || `#${ride.ride_id}`}
                          </span>
                        </td>

                        <td>{ride.customer_name || "—"}</td>
                        <td>{ride.driver_name || "Not assigned"}</td>
                        <td>{ride.pickup_address || "—"}</td>
                        <td>{ride.drop_address || "—"}</td>
                        <td>{formatCurrency(ride.final_amount)}</td>

                        <td>
                          <span
                            className={`dashboard-cancelled-by ${
                              ride.cancelled_by === "DRIVER"
                                ? "cancelled-driver"
                                : "cancelled-user"
                            }`}
                          >
                            {ride.cancelled_by || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <span className="dashboard-cancel-reason">
                            <XCircle size={14} />
                            {ride.cancel_reason || "Not provided"}
                          </span>
                        </td>

                        <td>{formatDateTime(ride.cancelled_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="dashboard-table-empty">
                        <CheckCircle size={22} />
                        <span>No cancelled rides found.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Alert Details Modal */}
      {activeAlertModal && (
        <div
          className="dashboard-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveAlertModal(null);
            }
          }}
        >
          <section
            className="dashboard-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-modal-title"
          >
            <header className="dashboard-modal-header">
              <div>
                <span className="dashboard-modal-eyebrow">
                  RIDE OPERATIONS
                </span>

                <h2 id="dashboard-modal-title">
                  {activeAlertModal.title}
                </h2>

                <p>{activeAlertModal.label}</p>
              </div>

              <button
                type="button"
                className="dashboard-modal-close"
                aria-label="Close dialog"
                onClick={() => setActiveAlertModal(null)}
              >
                <XCircle size={21} />
              </button>
            </header>

            <div className="dashboard-modal-body">
              <div className="dashboard-modal-summary">
                <div>
                  <span className="dashboard-modal-summary-label">
                    {activeAlertModal.key === "payment_disputes"
                      ? "Open disputes"
                      : activeAlertModal.key === "stuck_rides"
                        ? "Rides requiring attention"
                        : "Pending payouts"}
                  </span>

                  <strong>{activeAlertModal.count}</strong>
                </div>

                {activeAlertModal.key === "pending_payouts" && (
                  <div>
                    <span className="dashboard-modal-summary-label">
                      Pending amount
                    </span>

                    <strong className="dashboard-modal-amount">
                      {formatCurrency(activeAlertModal.amount)}
                    </strong>
                  </div>
                )}
              </div>

              {activeAlertModal.key === "payment_disputes" && (
                <div className="dashboard-modal-info">
                  <div className="dashboard-modal-info-icon dispute">
                    <CreditCard size={22} />
                  </div>

                  <div>
                    <h3>Payment dispute management</h3>
                    <p>
                      Review disputed payments, transaction references,
                      dispute reasons and resolution status.
                    </p>
                  </div>
                </div>
              )}

              {activeAlertModal.key === "stuck_rides" && (
                <div className="dashboard-modal-info">
                  <div className="dashboard-modal-info-icon stuck">
                    <Clock size={22} />
                  </div>

                  <div>
                    <h3>Stuck ride monitoring</h3>
                    <p>
                      Review rides that have remained in searching status
                      for more than 10 minutes and investigate their
                      current progress.
                    </p>
                  </div>
                </div>
              )}

              {activeAlertModal.key === "pending_payouts" && (
                <div className="dashboard-modal-info">
                  <div className="dashboard-modal-info-icon payout">
                    <IndianRupee size={22} />
                  </div>

                  <div>
                    <h3>Driver payout management</h3>
                    <p>
                      Review pending driver payments, payout amounts and
                      payment processing status.
                    </p>
                  </div>
                </div>
              )}

              <div className="dashboard-modal-notice">
                <AlertTriangle size={18} />

                <p>
                  This modal displays the alert summary from the dashboard
                  API. Detailed records and management actions require the
                  corresponding API endpoints to be connected.
                </p>
              </div>
            </div>

            <footer className="dashboard-modal-footer">
              <button
                type="button"
                className="dashboard-modal-done"
                onClick={() => setActiveAlertModal(null)}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
