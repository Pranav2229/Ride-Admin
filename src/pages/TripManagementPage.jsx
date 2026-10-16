import React, { useMemo, useState } from "react";
import {
  Search,
  CarFront,
  CheckCircle,
  Clock3,
  XCircle,
  IndianRupee,
  MapPin,
  CalendarDays,
  Eye,
  Ban,
  RotateCcw,
  X,
  Phone,
  UserRound,
  ArrowRight,
} from "lucide-react";

import "../styles/TripManagementPage.css";

const initialTrips = [
  {
    id: "RBTR1001",
    customer: "Amit Sharma",
    customerPhone: "+91 98765 12345",
    driver: "Ramesh Patel",
    driverPhone: "+91 91234 56789",
    pickup: "Katraj, Pune",
    destination: "Swargate, Pune",
    date: "13 Oct 2026",
    time: "09:30 AM",
    fare: 250,
    payment: "UPI",
    status: "Completed",
  },
  {
    id: "RBTR1002",
    customer: "Priya Deshmukh",
    customerPhone: "+91 98765 22222",
    driver: "Suresh Kumar",
    driverPhone: "+91 98765 12345",
    pickup: "Baner, Pune",
    destination: "Hinjawadi, Pune",
    date: "13 Oct 2026",
    time: "10:15 AM",
    fare: 380,
    payment: "Card",
    status: "Ongoing",
  },
  {
    id: "RBTR1003",
    customer: "Rahul Patil",
    customerPhone: "+91 97654 33333",
    driver: "Vikram Singh",
    driverPhone: "+91 87654 32109",
    pickup: "Hadapsar, Pune",
    destination: "Pune Station",
    date: "13 Oct 2026",
    time: "10:45 AM",
    fare: 320,
    payment: "Cash",
    status: "Cancelled",
  },
  {
    id: "RBTR1004",
    customer: "Sneha Kulkarni",
    customerPhone: "+91 96543 44444",
    driver: "Arun Kumar",
    driverPhone: "+91 99887 65432",
    pickup: "Kondhwa, Pune",
    destination: "Camp, Pune",
    date: "13 Oct 2026",
    time: "11:00 AM",
    fare: 210,
    payment: "UPI",
    status: "Completed",
  },
  {
    id: "RBTR1005",
    customer: "Rohit Jadhav",
    customerPhone: "+91 95432 55555",
    driver: "Santosh Yadav",
    driverPhone: "+91 90123 45678",
    pickup: "Pimpri, Pune",
    destination: "Shivajinagar, Pune",
    date: "12 Oct 2026",
    time: "04:20 PM",
    fare: 450,
    payment: "UPI",
    status: "Ongoing",
  },
  {
    id: "RBTR1006",
    customer: "Neha Pawar",
    customerPhone: "+91 94321 66666",
    driver: "Mahesh Pawar",
    driverPhone: "+91 97654 32108",
    pickup: "Warje, Pune",
    destination: "Deccan, Pune",
    date: "12 Oct 2026",
    time: "06:10 PM",
    fare: 190,
    payment: "Cash",
    status: "Completed",
  },
  {
    id: "RBTR1007",
    customer: "Karan Mehta",
    customerPhone: "+91 93210 77777",
    driver: "Amit Desai",
    driverPhone: "+91 96543 21098",
    pickup: "Viman Nagar, Pune",
    destination: "Kharadi, Pune",
    date: "12 Oct 2026",
    time: "07:00 PM",
    fare: 280,
    payment: "Card",
    status: "Cancelled",
  },
  {
    id: "RBTR1008",
    customer: "Pooja Shah",
    customerPhone: "+91 92109 88888",
    driver: "Ramesh Patel",
    driverPhone: "+91 91234 56789",
    pickup: "Aundh, Pune",
    destination: "Baner, Pune",
    date: "11 Oct 2026",
    time: "08:30 AM",
    fare: 175,
    payment: "UPI",
    status: "Completed",
  },
];

const statusClass = {
  Completed: "trip-status-completed",
  Ongoing: "trip-status-ongoing",
  Cancelled: "trip-status-cancelled",
};

function TripManagementPage() {
  const [trips, setTrips] = useState(initialTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [cancelTripId, setCancelTripId] = useState(null);
  const [cancelReason, setCancelReason] = useState("Customer request");
  const [notice, setNotice] = useState("");

  const rowsPerPage = 6;

  const filteredTrips = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return trips.filter((trip) => {
      const matchesSearch = [
        trip.id,
        trip.customer,
        trip.customerPhone,
        trip.driver,
        trip.driverPhone,
        trip.pickup,
        trip.destination,
      ].some((value) => value.toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "All Status" || trip.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All Payments" || trip.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [trips, searchTerm, statusFilter, paymentFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrips.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const displayedTrips = filteredTrips.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const completedCount = trips.filter(
    (trip) => trip.status === "Completed"
  ).length;

  const ongoingCount = trips.filter(
    (trip) => trip.status === "Ongoing"
  ).length;

  const cancelledCount = trips.filter(
    (trip) => trip.status === "Cancelled"
  ).length;

  const completedRevenue = trips
    .filter((trip) => trip.status === "Completed")
    .reduce((total, trip) => total + trip.fare, 0);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPaymentFilter("All Payments");
    setCurrentPage(1);
    setNotice("");
  };

  const confirmCancellation = () => {
    const trip = trips.find((item) => item.id === cancelTripId);

    if (!trip) return;

    if (trip.status === "Cancelled") {
      setNotice("This trip is already cancelled.");
      setCancelTripId(null);
      return;
    }

    setTrips((previous) =>
      previous.map((item) =>
        item.id === cancelTripId
          ? {
              ...item,
              status: "Cancelled",
              cancellationReason: cancelReason,
            }
          : item
      )
    );

    setNotice(`${trip.id} was cancelled in the demo.`);
    setSelectedTrip(null);
    setCancelTripId(null);
    setCancelReason("Customer request");
  };

  return (
    <div className="trip-management-page">
      <header className="trip-page-header">
        <div>
          <span className="trip-eyebrow">TRIP OPERATIONS</span>
          <h1>Trip Management</h1>
          <p>Monitor trip details, review fares and manage cancellations.</p>
        </div>

        <div className="trip-header-icon">
          <CarFront size={24} />
        </div>
      </header>

      <section className="trip-summary-grid">
        <div className="trip-summary-card">
          <div className="trip-summary-icon trip-summary-yellow">
            <CarFront size={21} />
          </div>
          <div>
            <span>Total Trips</span>
            <strong>{trips.length}</strong>
            <small>All recorded trips</small>
          </div>
        </div>

        <div className="trip-summary-card">
          <div className="trip-summary-icon trip-summary-green">
            <CheckCircle size={21} />
          </div>
          <div>
            <span>Completed Trips</span>
            <strong>{completedCount}</strong>
            <small>Successfully completed</small>
          </div>
        </div>

        <div className="trip-summary-card">
          <div className="trip-summary-icon trip-summary-blue">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Ongoing Trips</span>
            <strong>{ongoingCount}</strong>
            <small>Currently in progress</small>
          </div>
        </div>

        <div className="trip-summary-card">
          <div className="trip-summary-icon trip-summary-red">
            <XCircle size={21} />
          </div>
          <div>
            <span>Cancelled Trips</span>
            <strong>{cancelledCount}</strong>
            <small>Cancelled trip records</small>
          </div>
        </div>
      </section>

      <section className="trip-revenue-strip">
        <div className="trip-revenue-icon">
          <IndianRupee size={21} />
        </div>
        <div>
          <span>Completed Trip Fare Total</span>
          <strong>₹{completedRevenue.toLocaleString("en-IN")}</strong>
        </div>
        <span className="trip-revenue-note">
          Demo total · Completed trips only
        </span>
      </section>

      <section className="trip-table-card">
        <div className="trip-card-heading">
          <div>
            <h2>All Trips</h2>
            <p>View trip records and manage cancellation requests.</p>
          </div>
          <span className="trip-count-badge">
            {filteredTrips.length} trips
          </span>
        </div>

        <div className="trip-toolbar">
          <label className="trip-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search trip ID, customer, driver or location..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
                setNotice("");
              }}
            />
          </label>

          <label className="trip-select">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by trip status"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Ongoing</option>
              <option>Cancelled</option>
            </select>
            <span className="trip-select-chevron">
              <ArrowRight size={14} />
            </span>
          </label>

          <label className="trip-select">
            <select
              value={paymentFilter}
              onChange={(event) => {
                setPaymentFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by payment method"
            >
              <option>All Payments</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
            </select>
            <span className="trip-select-chevron">
              <ArrowRight size={14} />
            </span>
          </label>

          <button
            type="button"
            className="trip-reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {notice && (
          <div className="trip-notice" role="status">
            <CheckCircle size={16} />
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        <div className="trip-table-wrap">
          <table className="trip-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Trip ID</th>
                <th>Customer / Driver</th>
                <th>Route</th>
                <th>Date &amp; Time</th>
                <th>Fare</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedTrips.map((trip, index) => (
                <tr key={trip.id}>
                  <td className="trip-row-number">
                    {(safePage - 1) * rowsPerPage + index + 1}
                  </td>

                  <td>
                    <strong className="trip-id">{trip.id}</strong>
                  </td>

                  <td>
                    <div className="trip-person-cell">
                      <strong>{trip.customer}</strong>
                      <span>Driver: {trip.driver}</span>
                    </div>
                  </td>

                  <td>
                    <div className="trip-route-cell">
                      <span><i className="trip-route-dot" />{trip.pickup}</span>
                      <span><i className="trip-route-end" />{trip.destination}</span>
                    </div>
                  </td>

                  <td>
                    <div className="trip-date-cell">
                      <strong>{trip.date}</strong>
                      <span>{trip.time}</span>
                    </div>
                  </td>

                  <td className="trip-fare">
                    ₹{trip.fare.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span className="trip-payment">{trip.payment}</span>
                  </td>

                  <td>
                    <span className={`trip-status ${statusClass[trip.status]}`}>
                      <span className="trip-status-dot" />
                      {trip.status}
                    </span>
                  </td>

                  <td>
                    <div className="trip-row-actions">
                      <button
                        type="button"
                        className="trip-view-button"
                        onClick={() => setSelectedTrip(trip)}
                        title="View trip details"
                        aria-label={`View ${trip.id}`}
                      >
                        <Eye size={15} />
                      </button>

                      {trip.status !== "Cancelled" && (
                        <button
                          type="button"
                          className="trip-cancel-button"
                          onClick={() => {
                            setCancelTripId(trip.id);
                            setCancelReason("Customer request");
                          }}
                          title="Cancel trip"
                          aria-label={`Cancel ${trip.id}`}
                        >
                          <Ban size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayedTrips.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className="trip-empty-state">
                      <CarFront size={30} />
                      <strong>No trips found</strong>
                      <span>Try changing your search or filters.</span>
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

        <footer className="trip-table-footer">
          <span>
            Showing{" "}
            {filteredTrips.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1}
            {" "}– {Math.min(safePage * rowsPerPage, filteredTrips.length)}
            {" "}of {filteredTrips.length} trips
          </span>

          <div className="trip-pagination">
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

      <p className="trip-demo-note">
        Demo data only. Cancelling a trip changes local page state only. Connect
        your backend API before using these controls for real trips.
      </p>

      {selectedTrip && (
        <div
          className="trip-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedTrip(null);
          }}
        >
          <section className="trip-modal" role="dialog" aria-modal="true" aria-labelledby="trip-details-title">
            <div className="trip-modal-header">
              <div>
                <span className="trip-eyebrow">TRIP DETAILS</span>
                <h2 id="trip-details-title">{selectedTrip.id}</h2>
              </div>
              <button
                type="button"
                className="trip-modal-close"
                onClick={() => setSelectedTrip(null)}
                aria-label="Close trip details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="trip-modal-status-row">
              <span className={`trip-status ${statusClass[selectedTrip.status]}`}>
                <span className="trip-status-dot" />
                {selectedTrip.status}
              </span>
              <strong>₹{selectedTrip.fare.toLocaleString("en-IN")}</strong>
            </div>

            <h3 className="trip-modal-section-title">Route information</h3>
            <div className="trip-modal-route">
              <div><MapPin size={18} /><span><small>Pickup</small><strong>{selectedTrip.pickup}</strong></span></div>
              <div className="trip-modal-route-line" />
              <div><MapPin size={18} /><span><small>Destination</small><strong>{selectedTrip.destination}</strong></span></div>
            </div>

            <h3 className="trip-modal-section-title">Customer and driver</h3>
            <div className="trip-modal-people">
              <div>
                <UserRound size={18} />
                <span><small>Customer</small><strong>{selectedTrip.customer}</strong></span>
              </div>
              <div>
                <Phone size={17} />
                <span><small>Customer phone</small><strong>{selectedTrip.customerPhone}</strong></span>
              </div>
              <div>
                <UserRound size={18} />
                <span><small>Driver</small><strong>{selectedTrip.driver}</strong></span>
              </div>
              <div>
                <Phone size={17} />
                <span><small>Driver phone</small><strong>{selectedTrip.driverPhone}</strong></span>
              </div>
            </div>

            <div className="trip-modal-meta">
              <div><CalendarDays size={17} /><span><small>Date &amp; time</small><strong>{selectedTrip.date}, {selectedTrip.time}</strong></span></div>
              <div><IndianRupee size={17} /><span><small>Payment method</small><strong>{selectedTrip.payment}</strong></span></div>
            </div>

            {selectedTrip.cancellationReason && (
              <p className="trip-cancel-reason">
                Cancellation reason: {selectedTrip.cancellationReason}
              </p>
            )}

            <div className="trip-modal-footer">
              <button type="button" className="trip-modal-secondary" onClick={() => setSelectedTrip(null)}>
                Close
              </button>
              {selectedTrip.status !== "Cancelled" && (
                <button
                  type="button"
                  className="trip-modal-danger"
                  onClick={() => {
                    setCancelTripId(selectedTrip.id);
                    setCancelReason("Customer request");
                    setSelectedTrip(null);
                  }}
                >
                  <Ban size={15} /> Cancel Trip
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {cancelTripId && (
        <div className="trip-modal-backdrop">
          <section className="trip-modal trip-cancel-modal" role="dialog" aria-modal="true" aria-labelledby="trip-cancel-title">
            <div className="trip-modal-header">
              <div>
                <span className="trip-eyebrow">CANCELLATION CONTROL</span>
                <h2 id="trip-cancel-title">Cancel this trip?</h2>
              </div>
              <button
                type="button"
                className="trip-modal-close"
                onClick={() => setCancelTripId(null)}
                aria-label="Close cancellation dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p className="trip-cancel-description">
              You are cancelling <strong>{cancelTripId}</strong>. Choose a reason to record with this demo action.
            </p>

            <label className="trip-cancel-label">
              Cancellation reason
              <select value={cancelReason} onChange={(event) => setCancelReason(event.target.value)}>
                <option>Customer request</option>
                <option>Driver unavailable</option>
                <option>Vehicle issue</option>
                <option>Duplicate booking</option>
                <option>Admin cancellation</option>
              </select>
            </label>

            <div className="trip-modal-footer">
              <button type="button" className="trip-modal-secondary" onClick={() => setCancelTripId(null)}>
                Keep Trip
              </button>
              <button type="button" className="trip-modal-danger" onClick={confirmCancellation}>
                <Ban size={15} /> Confirm Cancellation
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default TripManagementPage;
