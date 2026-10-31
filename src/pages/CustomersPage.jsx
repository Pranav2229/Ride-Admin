import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  AlertCircle,
  UserRound,
  Phone,
  CarFront,
  ShieldAlert,
  Ban,
} from "lucide-react";
import { adminApi } from "../services/api";
import "../styles/CustomersPage.css";
function getAdminToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("adminToken") ||
    null
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const token = getAdminToken();

  // ---------------------------------------------------
  // LOAD CUSTOMERS
  // ---------------------------------------------------
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getCustomers(token, { search });

      if (res?.success) {
        setCustomers(res.data || []);
      } else {
        setError(res?.message || "Failed to load customers");
        setCustomers([]);
      }
    } catch (err) {
      setCustomers([]);
      setError(err.message || "Unable to load customers from server.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadCustomers(), 300);
    return () => clearTimeout(timer);
  }, [loadCustomers]);

  // ---------------------------------------------------
  // TOGGLE BLOCK STATUS
  // ---------------------------------------------------
  const handleToggleBlock = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) return;

    setActionLoading(true);

    try {
      const res = await adminApi.toggleCustomerBlock(token, userId, !currentStatus);

      if (res?.success) {
        // Update the local state immediately
        setCustomers((prev) =>
          prev.map((c) => (c.user_id === userId ? { ...c, is_blocked: !currentStatus } : c))
        );
      } else {
        alert(res?.message || "Failed to update status.");
      }
    } catch (err) {
      alert(err.message || "Network error. Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------
  // FILTERS
  // ---------------------------------------------------
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch =
        String(c.name).toLowerCase().includes(query) ||
        String(c.phone).toLowerCase().includes(query) ||
        String(c.email).toLowerCase().includes(query) ||
        String(c.user_id).includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Blocked" && c.is_blocked) ||
        (statusFilter === "Active" && !c.is_blocked);

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCount = customers.filter((c) => !c.is_blocked).length;
  const blockedCount = customers.filter((c) => c.is_blocked).length;

  return (
    <main className="customers-page">
      <div className="customers-header">
        <div>
          <span className="customers-eyebrow">USER MANAGEMENT</span>
          <h1>Customers</h1>
          <p>Manage registered customer accounts and access.</p>
        </div>

        <button
          className="customers-refresh-btn"
          onClick={loadCustomers}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <section className="customers-stats">
        <article className="customer-stat-card">
          <div className="customer-stat-icon total">
            <Users size={22} />
          </div>
          <div>
            <p>Total Customers</p>
            <h2>{customers.length}</h2>
          </div>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon active">
            <UserCheck size={22} />
          </div>
          <div>
            <p>Active Customers</p>
            <h2>{activeCount}</h2>
          </div>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon blocked">
            <UserX size={22} />
          </div>
          <div>
            <p>Blocked Customers</p>
            <h2>{blockedCount}</h2>
          </div>
        </article>
      </section>

      <section className="customers-table-card">
        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by name, phone, email or ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter customers by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {error && (
          <div className="customers-error" role="alert">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {loading && customers.length === 0 ? (
          <div className="customers-message">Loading customers...</div>
        ) : !error && filteredCustomers.length === 0 ? (
          <div className="customers-message">No customer records found.</div>
        ) : !error ? (
          <div className="customers-table-wrap">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Total Rides</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.user_id}>
                    <td>
                      <div className="customer-name-cell">
                        <span className="customer-avatar">
                          <UserRound size={17} />
                        </span>
                        <div>
                          <strong>{customer.name}</strong>
                          <small>ID: {customer.user_id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="customer-phone">
                        <Phone size={13} />
                        {customer.phone}
                      </span>
                    </td>

                    <td>{customer.email}</td>

                    <td>
                      <span className="customer-rides">
                        <CarFront size={14} />
                        {customer.total_rides}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`customer-status ${customer.is_blocked ? "blocked" : "active"
                          }`}
                      >
                        {customer.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`customer-action-btn ${customer.is_blocked ? "btn-unblock" : "btn-block"
                          }`}
                        onClick={() => handleToggleBlock(customer.user_id, customer.is_blocked)}
                        disabled={actionLoading}
                      >
                        {customer.is_blocked ? (
                          <><ShieldAlert size={14} /> Unblock</>
                        ) : (
                          <><Ban size={14} /> Block</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="customers-table-footer">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </section>
    </main>
  );
}
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Users,
//   UserCheck,
//   UserX,
//   RefreshCw,
//   AlertCircle,
//   UserRound,
//   Phone,
//   CarFront,
//   ShieldAlert,
// } from "lucide-react";
// import { apiRequest } from "../services/api";

// import "../styles/CustomersPage.css";

// function unwrapCustomers(response) {
//   const candidates = [
//     response?.data?.customers,
//     response?.data?.users,
//     response?.customers,
//     response?.users,
//     response?.data,
//     response,
//   ];

//   return candidates.find(Array.isArray) || null;
// }

// function normalizeCustomer(customer, index) {
//   return {
//     id: customer.id ?? customer.user_id ?? customer.customer_id ?? index,
//     name:
//       customer.full_name ??
//       customer.fullName ??
//       customer.name ??
//       "Unknown customer",
//     phone: customer.phone ?? customer.phone_number ?? "—",
//     email: customer.email ?? "—",
//     rides: Number(
//       customer.total_rides ?? customer.rides_count ?? customer.totalRides ?? 0
//     ),
//     status: customer.status ?? (customer.is_blocked ? "Blocked" : "Active"),
//   };
// }

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadCustomers = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("accessToken");
//       // Backend admin endpoint for fetching users/customers
//       const response = await apiRequest("user/get_user_rides", { token });
//       const list = unwrapCustomers(response);

//       if (!list) {
//         throw new Error(
//           "The API response does not contain a customer array. Check the response format."
//         );
//       }

//       setCustomers(list.map(normalizeCustomer));
//     } catch (err) {
//       setCustomers([]);
//       setError(err.message || "Unable to load customers from server.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadCustomers();
//   }, [loadCustomers]);

//   const filteredCustomers = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return customers.filter((customer) => {
//       const matchesSearch =
//         String(customer.name).toLowerCase().includes(query) ||
//         String(customer.phone).toLowerCase().includes(query) ||
//         String(customer.email).toLowerCase().includes(query) ||
//         String(customer.id).toLowerCase().includes(query);

//       const matchesStatus =
//         statusFilter === "All" ||
//         String(customer.status).toLowerCase() === statusFilter.toLowerCase();

//       return matchesSearch && matchesStatus;
//     });
//   }, [customers, search, statusFilter]);

//   const activeCount = customers.filter(
//     (customer) => String(customer.status).toLowerCase() === "active"
//   ).length;

//   const blockedCount = customers.filter(
//     (customer) => String(customer.status).toLowerCase() === "blocked"
//   ).length;

//   return (
//     <main className="customers-page">
//       <div className="customers-header">
//         <div>
//           <span className="customers-eyebrow">USER MANAGEMENT</span>
//           <h1>Customers</h1>
//           <p>Manage registered customer accounts and access from backend.</p>
//         </div>

//         <button
//           className="customers-refresh-btn"
//           onClick={loadCustomers}
//           disabled={loading}
//           type="button"
//         >
//           <RefreshCw size={16} />
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </div>

//       <section className="customers-stats">
//         <article className="customer-stat-card">
//           <div className="customer-stat-icon total">
//             <Users size={22} />
//           </div>
//           <div>
//             <p>Total Customers</p>
//             <h2>{customers.length}</h2>
//           </div>
//         </article>

//         <article className="customer-stat-card">
//           <div className="customer-stat-icon active">
//             <UserCheck size={22} />
//           </div>
//           <div>
//             <p>Active Customers</p>
//             <h2>{activeCount}</h2>
//           </div>
//         </article>

//         <article className="customer-stat-card">
//           <div className="customer-stat-icon blocked">
//             <UserX size={22} />
//           </div>
//           <div>
//             <p>Blocked Customers</p>
//             <h2>{blockedCount}</h2>
//           </div>
//         </article>
//       </section>

//       <section className="customers-table-card">
//         <div className="customers-toolbar">
//           <div className="customers-search">
//             <Search size={18} />
//             <input
//               type="search"
//               placeholder="Search by name, phone, email or ID..."
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(event) => setStatusFilter(event.target.value)}
//             aria-label="Filter customers by status"
//           >
//             <option value="All">All statuses</option>
//             <option value="Active">Active</option>
//             <option value="Blocked">Blocked</option>
//           </select>
//         </div>

//         {error && (
//           <div className="customers-error" role="alert">
//             <AlertCircle size={19} />
//             <span>{error}</span>
//           </div>
//         )}

//         {loading ? (
//           <div className="customers-message">Loading customers...</div>
//         ) : !error && filteredCustomers.length === 0 ? (
//           <div className="customers-message">No customer records found.</div>
//         ) : !error ? (
//           <div className="customers-table-wrap">
//             <table className="customers-table">
//               <thead>
//                 <tr>
//                   <th>Customer</th>
//                   <th>Phone</th>
//                   <th>Email</th>
//                   <th>Total Rides</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredCustomers.map((customer) => (
//                   <tr key={customer.id}>
//                     <td>
//                       <div className="customer-name-cell">
//                         <span className="customer-avatar">
//                           <UserRound size={17} />
//                         </span>
//                         <div>
//                           <strong>{customer.name}</strong>
//                           <small>ID: {customer.id}</small>
//                         </div>
//                       </div>
//                     </td>

//                     <td>
//                       <span className="customer-phone">
//                         <Phone size={13} />
//                         {customer.phone}
//                       </span>
//                     </td>

//                     <td>{customer.email}</td>

//                     <td>
//                       <span className="customer-rides">
//                         <CarFront size={14} />
//                         {customer.rides}
//                       </span>
//                     </td>

//                     <td>
//                       <span
//                         className={`customer-status ${
//                           String(customer.status).toLowerCase() === "blocked"
//                             ? "blocked"
//                             : "active"
//                         }`}
//                       >
//                         {customer.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : null}

//         <div className="customers-table-footer">
//           Showing {filteredCustomers.length} of {customers.length} customers
//         </div>
//       </section>
//     </main>
//   );
// }
