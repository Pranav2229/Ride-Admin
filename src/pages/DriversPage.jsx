
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Users,
//   UserRound,
//   Phone,
//   Star,
//   CarFront,
//   CheckCircle,
//   Ban,
//   ChevronDown,
//   RotateCcw,
//   Wallet,
// } from "lucide-react";

// import { driverApi } from "../services/api";
// import "../styles/DriversPage.css";




// const [earnings, setEarnings] = useState(null);
// const [earningsLoading, setEarningsLoading] = useState(false);
// const [earningsError, setEarningsError] = useState("");

// const fetchDriverEarnings = useCallback(async () => {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     setEarningsError(
//       "Access token not found. Please login with a driver account."
//     );
//     return;
//   }

//   try {
//     setEarningsLoading(true);
//     setEarningsError("");

//     const response = await driverApi.getEarnings(token);

//     console.log("DRIVER EARNINGS API RESPONSE:", response);

//     if (response?.success && response?.data) {
//       setEarnings(response.data);
//     } else {
//       setEarningsError(
//         response?.message || "Earnings data was not returned by the API."
//       );
//     }
//   } catch (error) {
//     console.error("Driver earnings API error:", error);
//     setEarningsError(error.message || "Unable to fetch earnings.");
//   } finally {
//     setEarningsLoading(false);
//   }
// }, []);

// useEffect(() => {
//   fetchDriverEarnings();
// }, [fetchDriverEarnings]);

// const initialDrivers = [
//   {
//     id: 1,
//     name: "Ramesh Patel",
//     phone: "+91 91234 56789",
//     rating: 4.8,
//     rides: 156,
//     status: "Online",
//   },
//   {
//     id: 2,
//     name: "Suresh Kumar",
//     phone: "+91 98765 12345",
//     rating: 4.6,
//     rides: 142,
//     status: "Online",
//   },
//   {
//     id: 3,
//     name: "Vikram Singh",
//     phone: "+91 87654 32109",
//     rating: 4.7,
//     rides: 118,
//     status: "Offline",
//   },
//   {
//     id: 4,
//     name: "Arun Kumar",
//     phone: "+91 99887 65432",
//     rating: 4.5,
//     rides: 96,
//     status: "Online",
//   },
//   {
//     id: 5,
//     name: "Santosh Yadav",
//     phone: "+91 90123 45678",
//     rating: 4.4,
//     rides: 87,
//     status: "Offline",
//   },
//   {
//     id: 6,
//     name: "Mahesh Pawar",
//     phone: "+91 97654 32108",
//     rating: 4.9,
//     rides: 203,
//     status: "Online",
//   },
//   {
//     id: 7,
//     name: "Amit Desai",
//     phone: "+91 96543 21098",
//     rating: 4.3,
//     rides: 64,
//     status: "Offline",
//   },
// ];

// function DriversPage() {
//   const [drivers, setDrivers] = useState(initialDrivers);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [notice, setNotice] = useState("");

//   const rowsPerPage = 5;

//   const filteredDrivers = useMemo(() => {
//     const search = searchTerm.trim().toLowerCase();

//     return drivers.filter((driver) => {
//       const matchesSearch =
//         driver.name.toLowerCase().includes(search) ||
//         driver.phone.toLowerCase().includes(search) ||
//         String(driver.id).includes(search);

//       const matchesStatus =
//         statusFilter === "All Status" ||
//         driver.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [drivers, searchTerm, statusFilter]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredDrivers.length / rowsPerPage)
//   );

//   const safePage = Math.min(currentPage, totalPages);

//   const displayedDrivers = filteredDrivers.slice(
//     (safePage - 1) * rowsPerPage,
//     safePage * rowsPerPage
//   );

//   const onlineCount = drivers.filter(
//     (driver) => driver.status === "Online"
//   ).length;

//   const offlineCount = drivers.filter(
//     (driver) => driver.status === "Offline"
//   ).length;

//   const averageRating = drivers.length
//     ? (
//         drivers.reduce((total, driver) => total + driver.rating, 0) /
//         drivers.length
//       ).toFixed(1)
//     : "0.0";

//   const totalRides = drivers.reduce(
//     (total, driver) => total + driver.rides,
//     0
//   );

//   const toggleDriverStatus = (driverId) => {
//     const selectedDriver = drivers.find(
//       (driver) => driver.id === driverId
//     );

//     if (!selectedDriver) return;

//     const nextStatus =
//       selectedDriver.status === "Online" ? "Offline" : "Online";

//     setDrivers((previousDrivers) =>
//       previousDrivers.map((driver) =>
//         driver.id === driverId
//           ? { ...driver, status: nextStatus }
//           : driver
//       )
//     );

//     setNotice(
//       `${selectedDriver.name}'s demo status is now ${nextStatus.toLowerCase()}.`
//     );
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("All Status");
//     setCurrentPage(1);
//     setNotice("");
//   };

//   return (
//     <div className="drivers-page">
//       <header className="drivers-page-header">
//         <div>
//           <span className="drivers-eyebrow">FLEET MANAGEMENT</span>
//           <h1>Driver Management</h1>
//           <p>Manage driver accounts, ratings and activity.</p>
//         </div>

//         <div className="drivers-header-icon">
//           <Users size={23} />
//         </div>
//       </header>

//       <div className="drivers-summary">
//         <div className="driver-summary-card">
//           <div className="driver-summary-icon driver-icon-yellow">
//             <Users size={20} />
//           </div>
//           <div>
//             <span>Total Drivers</span>
//             <strong>{drivers.length}</strong>
//           </div>
//         </div>

//         <div className="driver-summary-card">
//           <div className="driver-summary-icon driver-icon-green">
//             <CheckCircle size={20} />
//           </div>
//           <div>
//             <span>Online Drivers</span>
//             <strong>{onlineCount}</strong>
//           </div>
//         </div>

//         <div className="driver-summary-card">
//           <div className="driver-summary-icon driver-icon-gray">
//             <UserRound size={20} />
//           </div>
//           <div>
//             <span>Offline Drivers</span>
//             <strong>{offlineCount}</strong>
//           </div>
//         </div>

//         <div className="driver-summary-card">
//           <div className="driver-summary-icon driver-icon-blue">
//             <Star size={20} />
//           </div>
//           <div>
//             <span>Average Rating</span>
//             <strong>{averageRating} <small>★</small></strong>
//           </div>
//         </div>
//       </div>


//       <section className="driver-earnings-summary">
//   <div className="driver-earnings-heading">
//     <div className="driver-earnings-icon">
//       <Wallet size={22} />
//     </div>

//     <div>
//       <h2>Driver Earnings</h2>
//       <p>Data returned by the existing driver earnings API</p>
//     </div>

//     <button
//       type="button"
//       onClick={fetchDriverEarnings}
//       disabled={earningsLoading}
//     >
//       <RotateCcw size={15} />
//       {earningsLoading ? "Loading..." : "Refresh"}
//     </button>
//   </div>

//   {earningsError ? (
//     <p className="driver-earnings-error">{earningsError}</p>
//   ) : earningsLoading && !earnings ? (
//     <p>Loading earnings...</p>
//   ) : earnings ? (
//     <div className="driver-earnings-values">
//       <div>
//         <span>Total Earnings</span>
//         <strong>
//           ₹{Number(earnings.total_earnings ?? 0).toLocaleString("en-IN")}
//         </strong>
//       </div>

//       <div>
//         <span>Total Trips</span>
//         <strong>{earnings.total_rides ?? 0}</strong>
//       </div>

//       {earnings.today_earnings !== undefined && (
//         <div>
//           <span>Today's Earnings</span>
//           <strong>
//             ₹{Number(earnings.today_earnings ?? 0).toLocaleString("en-IN")}
//           </strong>
//         </div>
//       )}

//       {earnings.today_trips !== undefined && (
//         <div>
//           <span>Today's Trips</span>
//           <strong>{earnings.today_trips ?? 0}</strong>
//         </div>
//       )}
//     </div>
//   ) : (
//     <p>No earnings data available.</p>
//   )}
// </section>

//       <section className="drivers-card">
//         <div className="drivers-card-heading">
//           <div>
//             <h2>All Drivers</h2>
//             <p>Review driver performance and account status.</p>
//           </div>

//           <span className="drivers-count">
//             {filteredDrivers.length} drivers
//           </span>
//         </div>

//         <div className="drivers-toolbar">
//           <label className="drivers-search">
//             <Search size={17} />
//             <input
//               type="search"
//               placeholder="Search by name, phone or ID..."
//               value={searchTerm}
//               onChange={(event) => {
//                 setSearchTerm(event.target.value);
//                 setCurrentPage(1);
//                 setNotice("");
//               }}
//             />
//           </label>

//           <label className="drivers-status-select">
//             <select
//               value={statusFilter}
//               onChange={(event) => {
//                 setStatusFilter(event.target.value);
//                 setCurrentPage(1);
//                 setNotice("");
//               }}
//               aria-label="Filter drivers by status"
//             >
//               <option>All Status</option>
//               <option>Online</option>
//               <option>Offline</option>
//             </select>
//             <ChevronDown size={15} />
//           </label>

//           <button
//             type="button"
//             className="drivers-reset-button"
//             onClick={resetFilters}
//           >
//             <RotateCcw size={15} />
//             Reset
//           </button>
//         </div>

//         {notice && (
//           <div className="drivers-notice" role="status">
//             <CheckCircle size={16} />
//             <span>{notice}</span>
//             <button
//               type="button"
//               onClick={() => setNotice("")}
//               aria-label="Dismiss notification"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         <div className="drivers-table-wrapper">
//           <table className="drivers-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Driver</th>
//                 <th>Phone Number</th>
//                 <th>Rating</th>
//                 <th>Completed Rides</th>
//                 <th>Status</th>
//                 <th className="driver-action-column">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {displayedDrivers.map((driver, index) => (
//                 <tr key={driver.id}>
//                   <td className="driver-row-number">
//                     {(safePage - 1) * rowsPerPage + index + 1}
//                   </td>

//                   <td>
//                     <div className="driver-name-cell">
//                       <div className="driver-avatar">
//                         <UserRound size={17} />
//                       </div>
//                       <span>{driver.name}</span>
//                     </div>
//                   </td>

//                   <td>
//                     <span className="driver-phone">
//                       <Phone size={13} />
//                       {driver.phone}
//                     </span>
//                   </td>

//                   <td>
//                     <span className="driver-rating">
//                       {driver.rating.toFixed(1)}
//                       <Star size={13} fill="currentColor" />
//                     </span>
//                   </td>

//                   <td>
//                     <span className="driver-rides">
//                       <CarFront size={14} />
//                       {driver.rides}
//                     </span>
//                   </td>

//                   <td>
//                     <span
//                       className={`driver-status ${
//                         driver.status === "Online"
//                           ? "driver-status-online"
//                           : "driver-status-offline"
//                       }`}
//                     >
//                       <span className="driver-status-dot" />
//                       {driver.status}
//                     </span>
//                   </td>

//                   <td>
//                     <button
//                       type="button"
//                       className={`driver-action-button ${
//                         driver.status === "Online"
//                           ? "driver-deactivate-button"
//                           : "driver-activate-button"
//                       }`}
//                       onClick={() => toggleDriverStatus(driver.id)}
//                     >
//                       {driver.status === "Online" ? (
//                         <>
//                           <Ban size={13} />
//                           Deactivate
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle size={13} />
//                           Activate
//                         </>
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {displayedDrivers.length === 0 && (
//                 <tr>
//                   <td colSpan={7}>
//                     <div className="drivers-empty-state">
//                       <Users size={28} />
//                       <strong>No drivers found</strong>
//                       <span>
//                         Try changing your search or status filter.
//                       </span>
//                       <button type="button" onClick={resetFilters}>
//                         Clear filters
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <footer className="drivers-table-footer">
//           <span>
//             Showing{" "}
//             {filteredDrivers.length === 0
//               ? 0
//               : (safePage - 1) * rowsPerPage + 1}
//             {" "}–{" "}
//             {Math.min(safePage * rowsPerPage, filteredDrivers.length)}
//             {" "}of {filteredDrivers.length} drivers
//             <span className="drivers-total-rides">
//               {" "}· {totalRides} completed rides
//             </span>
//           </span>

//           <div className="drivers-pagination">
//             <button
//               type="button"
//               disabled={safePage <= 1}
//               onClick={() => setCurrentPage((page) => page - 1)}
//             >
//               Previous
//             </button>

//             <span>{safePage} / {totalPages}</span>

//             <button
//               type="button"
//               disabled={safePage >= totalPages}
//               onClick={() => setCurrentPage((page) => page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </footer>
//       </section>

//       <p className="drivers-demo-note">
//         Demo data only. Activate/Deactivate changes the displayed status
//         locally and does not update a real driver account or backend.
//       </p>
//     </div>
//   );
// }

// export default DriversPage;










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
} from "lucide-react";

import { driverApi } from "../services/api";
import "../styles/DriversPage.css";

const initialDrivers = [
  {
    id: 1,
    name: "Ramesh Patel",
    phone: "+91 91234 56789",
    rating: 4.8,
    rides: 156,
    status: "Online",
  },
  {
    id: 2,
    name: "Suresh Kumar",
    phone: "+91 98765 12345",
    rating: 4.6,
    rides: 142,
    status: "Online",
  },
  {
    id: 3,
    name: "Vikram Singh",
    phone: "+91 87654 32109",
    rating: 4.7,
    rides: 118,
    status: "Offline",
  },
  {
    id: 4,
    name: "Arun Kumar",
    phone: "+91 99887 65432",
    rating: 4.5,
    rides: 96,
    status: "Online",
  },
  {
    id: 5,
    name: "Santosh Yadav",
    phone: "+91 90123 45678",
    rating: 4.4,
    rides: 87,
    status: "Offline",
  },
  {
    id: 6,
    name: "Mahesh Pawar",
    phone: "+91 97654 32108",
    rating: 4.9,
    rides: 203,
    status: "Online",
  },
  {
    id: 7,
    name: "Amit Desai",
    phone: "+91 96543 21098",
    rating: 4.3,
    rides: 64,
    status: "Offline",
  },
];

function DriversPage() {
  const [earnings, setEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [earningsError, setEarningsError] = useState("");

  const fetchDriverEarnings = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setEarningsError(
        "Access token not found. Please login with a driver account."
      );
      return;
    }

    try {
      setEarningsLoading(true);
      setEarningsError("");

      const response = await driverApi.getEarnings(token);

      console.log("DRIVER EARNINGS API RESPONSE:", response);

      if (response?.success && response?.data) {
        setEarnings(response.data);
      } else {
        setEarningsError(
          response?.message || "Earnings data was not returned by the API."
        );
      }
    } catch (error) {
      console.error("Driver earnings API error:", error);
      setEarningsError(error.message || "Unable to fetch earnings.");
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDriverEarnings();
  }, [fetchDriverEarnings]);

  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("");

  const rowsPerPage = 5;

  const filteredDrivers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(search) ||
        driver.phone.toLowerCase().includes(search) ||
        String(driver.id).includes(search);

      const matchesStatus =
        statusFilter === "All Status" ||
        driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const displayedDrivers = filteredDrivers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const onlineCount = drivers.filter(
    (driver) => driver.status === "Online"
  ).length;

  const offlineCount = drivers.filter(
    (driver) => driver.status === "Offline"
  ).length;

  const averageRating = drivers.length
    ? (
        drivers.reduce((total, driver) => total + driver.rating, 0) /
        drivers.length
      ).toFixed(1)
    : "0.0";

  const totalRides = drivers.reduce(
    (total, driver) => total + driver.rides,
    0
  );

  const toggleDriverStatus = (driverId) => {
    const selectedDriver = drivers.find(
      (driver) => driver.id === driverId
    );

    if (!selectedDriver) return;

    const nextStatus =
      selectedDriver.status === "Online" ? "Offline" : "Online";

    setDrivers((previousDrivers) =>
      previousDrivers.map((driver) =>
        driver.id === driverId
          ? { ...driver, status: nextStatus }
          : driver
      )
    );

    setNotice(
      `${selectedDriver.name}'s demo status is now ${nextStatus.toLowerCase()}.`
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
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

      <section className="driver-earnings-summary">
        <div className="driver-earnings-heading">
          <div className="driver-earnings-icon">
            <Wallet size={22} />
          </div>

          <div>
            <h2>Driver Earnings</h2>
            <p>Data returned by the existing driver earnings API</p>
          </div>

          <button
            type="button"
            onClick={fetchDriverEarnings}
            disabled={earningsLoading}
          >
            <RotateCcw size={15} />
            {earningsLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {earningsError ? (
          <p className="driver-earnings-error">{earningsError}</p>
        ) : earningsLoading && !earnings ? (
          <p>Loading earnings...</p>
        ) : earnings ? (
          <div className="driver-earnings-values">
            <div>
              <span>Total Earnings</span>
              <strong>
                ₹{Number(earnings.total_earnings ?? 0).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Total Trips</span>
              <strong>{earnings.total_rides ?? 0}</strong>
            </div>

            {earnings.today_earnings !== undefined && (
              <div>
                <span>Today's Earnings</span>
                <strong>
                  ₹{Number(earnings.today_earnings ?? 0).toLocaleString("en-IN")}
                </strong>
              </div>
            )}

            {earnings.today_trips !== undefined && (
              <div>
                <span>Today's Trips</span>
                <strong>{earnings.today_trips ?? 0}</strong>
              </div>
            )}
          </div>
        ) : (
          <p>No earnings data available.</p>
        )}
      </section>

      <section className="drivers-card">
        <div className="drivers-card-heading">
          <div>
            <h2>All Drivers</h2>
            <p>Review driver performance and account status.</p>
          </div>

          <span className="drivers-count">
            {filteredDrivers.length} drivers
          </span>
        </div>

        <div className="drivers-toolbar">
          <label className="drivers-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by name, phone or ID..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
                setNotice("");
              }}
            />
          </label>

          <label className="drivers-status-select">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
                setNotice("");
              }}
              aria-label="Filter drivers by status"
            >
              <option>All Status</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <button
            type="button"
            className="drivers-reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {notice && (
          <div className="drivers-notice" role="status">
            <CheckCircle size={16} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
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
              {displayedDrivers.map((driver, index) => (
                <tr key={driver.id}>
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
                      {driver.rating.toFixed(1)}
                      <Star size={13} fill="currentColor" />
                    </span>
                  </td>

                  <td>
                    <span className="driver-rides">
                      <CarFront size={14} />
                      {driver.rides}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`driver-status ${
                        driver.status === "Online"
                          ? "driver-status-online"
                          : "driver-status-offline"
                      }`}
                    >
                      <span className="driver-status-dot" />
                      {driver.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`driver-action-button ${
                        driver.status === "Online"
                          ? "driver-deactivate-button"
                          : "driver-activate-button"
                      }`}
                      onClick={() => toggleDriverStatus(driver.id)}
                    >
                      {driver.status === "Online" ? (
                        <>
                          <Ban size={13} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} />
                          Activate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {displayedDrivers.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="drivers-empty-state">
                      <Users size={28} />
                      <strong>No drivers found</strong>
                      <span>
                        Try changing your search or status filter.
                      </span>
                      <button type="button" onClick={resetFilters}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="drivers-table-footer">
          <span>
            Showing{" "}
            {filteredDrivers.length === 0
              ? 0
              : (safePage - 1) * rowsPerPage + 1}
            {" "}–{" "}
            {Math.min(safePage * rowsPerPage, filteredDrivers.length)}
            {" "}of {filteredDrivers.length} drivers
            <span className="drivers-total-rides">
              {" "}· {totalRides} completed rides
            </span>
          </span>

          <div className="drivers-pagination">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>{safePage} / {totalPages}</span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      </section>

      <p className="drivers-demo-note">
        Demo data only. Activate/Deactivate changes the displayed status
        locally and does not update a real driver account or backend.
      </p>
    </div>
  );
}

export default DriversPage;
