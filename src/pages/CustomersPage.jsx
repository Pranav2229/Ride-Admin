
import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Phone,
  CarFront,
  Ban,
  CheckCircle,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import "../styles/CustomersPage.css";

const initialCustomers = [
  {
    id: 1,
    name: "Priya Sharma",
    phone: "+91 98765 42100",
    rides: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Rohit Kumar",
    phone: "+91 87654 32109",
    rides: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Sneha Patel",
    phone: "+91 91234 56789",
    rides: 15,
    status: "Active",
  },
  {
    id: 4,
    name: "Amit Singh",
    phone: "+91 99887 76655",
    rides: 5,
    status: "Blocked",
  },
  {
    id: 5,
    name: "Neha Verma",
    phone: "+91 90123 45678",
    rides: 11,
    status: "Active",
  },
  {
    id: 6,
    name: "Arjun Mehta",
    phone: "+91 98901 23456",
    rides: 19,
    status: "Active",
  },
  {
    id: 7,
    name: "Pooja Deshmukh",
    phone: "+91 97654 32108",
    rides: 3,
    status: "Active",
  },
  {
    id: 8,
    name: "Karan Shah",
    phone: "+91 96543 21098",
    rides: 0,
    status: "Blocked",
  },
];

function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("");

  const rowsPerPage = 5;

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search) ||
        String(customer.id).includes(search);

      const matchesStatus =
        statusFilter === "All Status" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const displayedCustomers = filteredCustomers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const activeCount = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const blockedCount = customers.filter(
    (customer) => customer.status === "Blocked"
  ).length;

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setNotice("");
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setNotice("");
  };

  const toggleCustomerStatus = (customerId) => {
    const selectedCustomer = customers.find(
      (customer) => customer.id === customerId
    );

    if (!selectedCustomer) return;

    const nextStatus =
      selectedCustomer.status === "Active" ? "Blocked" : "Active";

    setCustomers((previousCustomers) =>
      previousCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: nextStatus }
          : customer
      )
    );

    setNotice(
      `${selectedCustomer.name} is now ${nextStatus.toLowerCase()}.`
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setCurrentPage(1);
    setNotice("");
  };

  return (
    <div className="customers-page">
      <header className="customers-page-header">
        <div>
          <span className="customers-eyebrow">USER MANAGEMENT</span>
          <h1>Customers</h1>
          <p>Manage your customers and their access.</p>
        </div>

        <div className="customers-header-icon">
          <Users size={23} />
        </div>
      </header>

      <div className="customers-summary">
        <div className="customer-summary-card">
          <div className="customer-summary-icon summary-icon-yellow">
            <Users size={20} />
          </div>
          <div>
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="customer-summary-card">
          <div className="customer-summary-icon summary-icon-green">
            <CheckCircle size={20} />
          </div>
          <div>
            <span>Active Customers</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="customer-summary-card">
          <div className="customer-summary-icon summary-icon-red">
            <Ban size={20} />
          </div>
          <div>
            <span>Blocked Customers</span>
            <strong>{blockedCount}</strong>
          </div>
        </div>
      </div>

      <section className="customers-card">
        <div className="customers-card-heading">
          <div>
            <h2>Customer Directory</h2>
            <p>View and manage registered customer accounts.</p>
          </div>

          <span className="customers-count">
            {filteredCustomers.length} customers
          </span>
        </div>

        <div className="customers-toolbar">
          <label className="customers-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by name, phone or ID..."
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>

          <label className="customers-status-select">
            <select
              value={statusFilter}
              onChange={(event) => handleStatusFilter(event.target.value)}
              aria-label="Filter customers by status"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Blocked</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <button
            type="button"
            className="customers-reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {notice && (
          <div className="customers-notice" role="status">
            <CheckCircle size={16} />
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th className="customer-number-column">#</th>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Total Rides</th>
                <th>Status</th>
                <th className="customer-action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td className="customer-row-number">
                    {(safePage - 1) * rowsPerPage + index + 1}
                  </td>

                  <td>
                    <div className="customer-name-cell">
                      <div className="customer-avatar">
                        <UserRound size={17} />
                      </div>
                      <span>{customer.name}</span>
                    </div>
                  </td>

                  <td>
                    <span className="customer-phone">
                      <Phone size={13} />
                      {customer.phone}
                    </span>
                  </td>

                  <td>
                    <span className="customer-rides">
                      <CarFront size={14} />
                      {customer.rides}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`customer-status ${
                        customer.status === "Active"
                          ? "customer-status-active"
                          : "customer-status-blocked"
                      }`}
                    >
                      <span className="customer-status-dot" />
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`customer-action-button ${
                        customer.status === "Active"
                          ? "customer-block-button"
                          : "customer-unblock-button"
                      }`}
                      onClick={() => toggleCustomerStatus(customer.id)}
                    >
                      {customer.status === "Active" ? (
                        <>
                          <Ban size={13} />
                          Block
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} />
                          Unblock
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {displayedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="customers-empty-state">
                      <Users size={28} />
                      <strong>No customers found</strong>
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

        <footer className="customers-table-footer">
          <span>
            Showing{" "}
            {filteredCustomers.length === 0
              ? 0
              : (safePage - 1) * rowsPerPage + 1}
            {" "}–{" "}
            {Math.min(safePage * rowsPerPage, filteredCustomers.length)}
            {" "}of {filteredCustomers.length} customers
          </span>

          <div className="customers-pagination">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>
              {safePage} / {totalPages}
            </span>

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

      <p className="customers-demo-note">
        Demo data: customer changes are stored in page state only and will
        reset when this page reloads.
      </p>
    </div>
  );
}

export default CustomersPage;













// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Users,
//   UserCheck,
//   UserX,
//   RefreshCw,
//   AlertCircle,
// } from "lucide-react";
// import { apiRequest } from "../services/api";

// import "../styles/CustomersPage.css";

// const CUSTOMER_LIST_ENDPOINT = import.meta.env.VITE_CUSTOMERS_ENDPOINT;

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
//     if (!CUSTOMER_LIST_ENDPOINT) {
//       setError(
//         "No verified all-customers API is configured. Set VITE_CUSTOMERS_ENDPOINT to an existing backend route that returns all customers."
//       );
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await apiRequest(CUSTOMER_LIST_ENDPOINT, { token });
//       const list = unwrapCustomers(response);

//       if (!list) {
//         throw new Error(
//           "The API response does not contain a customer array. Check the response format."
//         );
//       }

//       setCustomers(list.map(normalizeCustomer));
//     } catch (err) {
//       setCustomers([]);
//       setError(err.message || "Unable to load customers.");
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
//           <h1>Customers</h1>
//           <p>View and search customer records from the backend.</p>
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
//                           {String(customer.name).charAt(0).toUpperCase()}
//                         </span>
//                         <div>
//                           <strong>{customer.name}</strong>
//                           <small>ID: {customer.id}</small>
//                         </div>
//                       </div>
//                     </td>

//                     <td>{customer.phone}</td>
//                     <td>{customer.email}</td>
//                     <td>{customer.rides}</td>
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

