
import React, { useMemo, useState } from "react";
import {
  Activity,
  CarFront,
  Users,
  Clock3,
  Search,
  RotateCcw,
  MapPin,
  Navigation,
  Eye,
  Phone,
  X,
  Route,
  CircleAlert,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import "../styles/LiveRidesPage.css";

const initialRides = [
  {
    id: "RB-2401",
    customer: "Priya Sharma",
    customerPhone: "+91 98765 12340",
    driver: "Ramesh Patel",
    driverPhone: "+91 91234 56789",
    pickup: "Koregaon Park, Pune",
    destination: "Pune Airport",
    fare: 420,
    status: "In Progress",
    vehicle: "Swift Dzire",
    plate: "MH 12 AB 1234",
    elapsed: "18 min",
    distance: "7.2 km",
    eta: "12 min",
  },
  {
    id: "RB-2402",
    customer: "Aarav Deshmukh",
    customerPhone: "+91 98765 12341",
    driver: "Suresh Kumar",
    driverPhone: "+91 98765 12345",
    pickup: "Katraj, Pune",
    destination: "Swargate, Pune",
    fare: 260,
    status: "In Progress",
    vehicle: "Hyundai Aura",
    plate: "MH 12 CD 5678",
    elapsed: "11 min",
    distance: "4.8 km",
    eta: "8 min",
  },
  {
    id: "RB-2403",
    customer: "Sneha Kulkarni",
    customerPhone: "+91 98765 12342",
    driver: "Vikram Singh",
    driverPhone: "+91 87654 32109",
    pickup: "Baner, Pune",
    destination: "Hinjawadi Phase 1",
    fare: 380,
    status: "Delayed",
    vehicle: "Maruti Ertiga",
    plate: "MH 14 EF 9012",
    elapsed: "32 min",
    distance: "10.5 km",
    eta: "18 min",
  },
  {
    id: "RB-2404",
    customer: "Rahul Jadhav",
    customerPhone: "+91 98765 12343",
    driver: "Arun Kumar",
    driverPhone: "+91 99887 65432",
    pickup: "Hadapsar, Pune",
    destination: "Magarpatta City",
    fare: 190,
    status: "In Progress",
    vehicle: "Tata Tigor",
    plate: "MH 12 GH 3456",
    elapsed: "9 min",
    distance: "3.1 km",
    eta: "6 min",
  },
  {
    id: "RB-2405",
    customer: "Meera Patil",
    customerPhone: "+91 98765 12344",
    driver: "Mahesh Pawar",
    driverPhone: "+91 97654 32108",
    pickup: "Aundh, Pune",
    destination: "Shivajinagar, Pune",
    fare: 310,
    status: "Arriving",
    vehicle: "Swift Dzire",
    plate: "MH 12 JK 7890",
    elapsed: "6 min",
    distance: "2.4 km",
    eta: "3 min",
  },
  {
    id: "RB-2406",
    customer: "Karan Shah",
    customerPhone: "+91 98765 12346",
    driver: "Santosh Yadav",
    driverPhone: "+91 90123 45678",
    pickup: "Viman Nagar, Pune",
    destination: "Kalyani Nagar, Pune",
    fare: 220,
    status: "In Progress",
    vehicle: "Hyundai Aura",
    plate: "MH 12 LM 1122",
    elapsed: "14 min",
    distance: "5.6 km",
    eta: "7 min",
  },
];

const formatFare = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function LiveRidesPage() {
  const [rides, setRides] = useState(initialRides);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedRideId, setSelectedRideId] = useState(initialRides[0].id);
  const [notice, setNotice] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Safety concern");

  const activeRides = rides.filter(
    (ride) => ride.status !== "Completed" && ride.status !== "Cancelled"
  );

  const delayedCount = activeRides.filter(
    (ride) => ride.status === "Delayed"
  ).length;

  const filteredRides = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return rides.filter((ride) => {
      const matchesSearch = [
        ride.id,
        ride.customer,
        ride.driver,
        ride.pickup,
        ride.destination,
      ].some((value) => value.toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "All Status" || ride.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rides, searchTerm, statusFilter]);

  const selectedRide =
    rides.find((ride) => ride.id === selectedRideId) || filteredRides[0] || null;

  const updateStatus = (rideId, nextStatus) => {
    setRides((previous) =>
      previous.map((ride) =>
        ride.id === rideId ? { ...ride, status: nextStatus } : ride
      )
    );

    setNotice(`${rideId} demo status updated to ${nextStatus}.`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setNotice("");
  };

  const cancelSelectedRide = () => {
    if (!selectedRide) return;

    updateStatus(selectedRide.id, "Cancelled");
    setShowCancelModal(false);
  };

  return (
    <div className="live-rides-page">
      <header className="lr-page-header">
        <div>
          <span className="lr-eyebrow">REAL-TIME MONITORING</span>
          <h1>Live Rides</h1>
          <p>Monitor ongoing trips, drivers and ride progress.</p>
        </div>

        <div className="lr-live-indicator">
          <span className="lr-pulse-dot" />
          Demo Monitoring
        </div>
      </header>

      <section className="lr-summary-grid">
        <div className="lr-summary-card">
          <div className="lr-summary-icon lr-yellow">
            <Activity size={21} />
          </div>
          <div className="lr-summary-content">
            <span>Active Rides</span>
            <strong>{activeRides.length}</strong>
            <small>Currently on the road</small>
          </div>
          <ArrowUpRight className="lr-summary-arrow" size={17} />
        </div>

        <div className="lr-summary-card">
          <div className="lr-summary-icon lr-green">
            <CarFront size={21} />
          </div>
          <div className="lr-summary-content">
            <span>Drivers on Trip</span>
            <strong>{activeRides.length}</strong>
            <small>Assigned to active rides</small>
          </div>
          <ArrowUpRight className="lr-summary-arrow" size={17} />
        </div>

        <div className="lr-summary-card">
          <div className="lr-summary-icon lr-blue">
            <Users size={21} />
          </div>
          <div className="lr-summary-content">
            <span>Customers on Trip</span>
            <strong>{activeRides.length}</strong>
            <small>Currently travelling</small>
          </div>
          <ArrowUpRight className="lr-summary-arrow" size={17} />
        </div>

        <div className="lr-summary-card">
          <div className="lr-summary-icon lr-red">
            <Clock3 size={21} />
          </div>
          <div className="lr-summary-content">
            <span>Delayed Rides</span>
            <strong>{delayedCount}</strong>
            <small>Require attention</small>
          </div>
          <CircleAlert className="lr-summary-alert" size={17} />
        </div>
      </section>

      <div className="lr-main-layout">
        <section className="lr-panel lr-rides-panel">
          <div className="lr-panel-heading">
            <div>
              <h2>Ongoing Rides</h2>
              <p>Search and select a ride to see its details.</p>
            </div>
            <span className="lr-total-badge">
              {filteredRides.length} rides
            </span>
          </div>

          <div className="lr-toolbar">
            <label className="lr-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search ride, driver or customer..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="lr-status-filter">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter rides by status"
              >
                <option>All Status</option>
                <option>In Progress</option>
                <option>Arriving</option>
                <option>Delayed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <ChevronDown size={15} />
            </label>

            <button
              className="lr-reset-button"
              type="button"
              onClick={resetFilters}
              title="Reset filters"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          {notice && (
            <div className="lr-notice" role="status">
              <CheckCircleIcon />
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")}>
                ×
              </button>
            </div>
          )}

          <div className="lr-table-wrap">
            <table className="lr-table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Customer / Driver</th>
                  <th>Route</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((ride) => (
                  <tr
                    key={ride.id}
                    className={
                      selectedRide?.id === ride.id ? "lr-selected-row" : ""
                    }
                    onClick={() => setSelectedRideId(ride.id)}
                  >
                    <td>
                      <strong className="lr-ride-id">{ride.id}</strong>
                      <span className="lr-subtext">{ride.elapsed} elapsed</span>
                    </td>

                    <td>
                      <div className="lr-person-cell">
                        <span className="lr-mini-avatar">
                          {ride.customer.charAt(0)}
                        </span>
                        <div>
                          <strong>{ride.customer}</strong>
                          <span>Driver: {ride.driver}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="lr-route-cell">
                        <span title={ride.pickup}>
                          <i className="lr-route-pickup" />
                          {ride.pickup}
                        </span>
                        <span title={ride.destination}>
                          <i className="lr-route-destination" />
                          {ride.destination}
                        </span>
                      </div>
                    </td>

                    <td className="lr-fare">{formatFare(ride.fare)}</td>

                    <td>
                      <span
                        className={`lr-status lr-status-${ride.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        <i />
                        {ride.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="lr-view-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRideId(ride.id);
                        }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRides.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="lr-empty">
                        <CarFront size={28} />
                        <strong>No rides found</strong>
                        <span>Try a different search or status filter.</span>
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

          <div className="lr-table-footer">
            Showing {filteredRides.length} of {rides.length} rides
            <span>Updated using local demo data</span>
          </div>
        </section>

        <aside className="lr-side-column">
          <section className="lr-panel lr-map-panel">
            <div className="lr-panel-heading">
              <div>
                <h2>Ride Route</h2>
                <p>{selectedRide ? selectedRide.id : "Select a ride"}</p>
              </div>
              <span className="lr-map-pin-icon">
                <Navigation size={17} />
              </span>
            </div>

            {selectedRide ? (
              <>
                <div className="lr-map-visual">
                  <div className="lr-map-grid" />
                  <div className="lr-map-road lr-road-one" />
                  <div className="lr-map-road lr-road-two" />
                  <div className="lr-map-road lr-road-three" />
                  <div className="lr-map-road lr-road-four" />
                  <div className="lr-map-park" />
                  <div className="lr-map-route-line" />
                  <div className="lr-map-marker lr-marker-start">
                    <MapPin size={20} fill="currentColor" />
                  </div>
                  <div className="lr-map-marker lr-marker-end">
                    <Navigation size={19} fill="currentColor" />
                  </div>
                  <span className="lr-map-label lr-label-start">Pickup</span>
                  <span className="lr-map-label lr-label-end">Drop-off</span>
                  <span className="lr-map-car">
                    <CarFront size={17} />
                  </span>
                  <div className="lr-map-watermark">ROUTE PREVIEW</div>
                </div>

                <div className="lr-map-route-info">
                  <div>
                    <span>Distance travelled</span>
                    <strong>{selectedRide.distance}</strong>
                  </div>
                  <div>
                    <span>Estimated arrival</span>
                    <strong>{selectedRide.eta}</strong>
                  </div>
                </div>
                <p className="lr-map-demo-note">
                  Illustrative route only — not a live GPS map.
                </p>
              </>
            ) : (
              <div className="lr-empty lr-map-empty">
                Select a ride to preview its route.
              </div>
            )}
          </section>

          <section className="lr-panel lr-detail-panel">
            <div className="lr-panel-heading">
              <div>
                <h2>Ride Details</h2>
                <p>Selected trip information</p>
              </div>
              <Route size={19} className="lr-detail-heading-icon" />
            </div>

            {selectedRide ? (
              <>
                <div className="lr-detail-id-row">
                  <div>
                    <span>Ride ID</span>
                    <strong>{selectedRide.id}</strong>
                  </div>
                  <span
                    className={`lr-status lr-status-${selectedRide.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    <i />
                    {selectedRide.status}
                  </span>
                </div>

                <div className="lr-detail-route">
                  <div className="lr-detail-route-point">
                    <i className="lr-route-pickup" />
                    <div>
                      <span>Pickup location</span>
                      <strong>{selectedRide.pickup}</strong>
                    </div>
                  </div>
                  <div className="lr-detail-route-point">
                    <i className="lr-route-destination" />
                    <div>
                      <span>Destination</span>
                      <strong>{selectedRide.destination}</strong>
                    </div>
                  </div>
                </div>

                <div className="lr-detail-people">
                  <div className="lr-detail-person">
                    <div className="lr-person-icon lr-customer-icon">
                      <Users size={17} />
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{selectedRide.customer}</strong>
                      <small>{selectedRide.customerPhone}</small>
                    </div>
                  </div>

                  <div className="lr-detail-person">
                    <div className="lr-person-icon lr-driver-icon">
                      <CarFront size={17} />
                    </div>
                    <div>
                      <span>Assigned Driver</span>
                      <strong>{selectedRide.driver}</strong>
                      <small>{selectedRide.driverPhone}</small>
                    </div>
                  </div>
                </div>

                <div className="lr-vehicle-info">
                  <div>
                    <span>Vehicle</span>
                    <strong>{selectedRide.vehicle}</strong>
                  </div>
                  <div>
                    <span>Registration</span>
                    <strong>{selectedRide.plate}</strong>
                  </div>
                </div>

                <div className="lr-detail-fare">
                  <span>Estimated fare</span>
                  <strong>{formatFare(selectedRide.fare)}</strong>
                </div>

                <div className="lr-detail-actions">
                  <a
                    href={`tel:${selectedRide.driverPhone.replaceAll(" ", "")}`}
                    className="lr-call-button"
                  >
                    <Phone size={15} />
                    Call Driver
                  </a>

                  {selectedRide.status !== "Completed" &&
                    selectedRide.status !== "Cancelled" && (
                      <button
                        type="button"
                        className="lr-cancel-button"
                        onClick={() => setShowCancelModal(true)}
                      >
                        <X size={15} />
                        Cancel Ride
                      </button>
                    )}
                </div>
              </>
            ) : (
              <div className="lr-empty">No ride selected.</div>
            )}
          </section>
        </aside>
      </div>

      <p className="lr-demo-disclaimer">
        Demo environment: ride information, ETAs and route visuals are sample
        values. Status changes are local only and do not cancel a real trip.
      </p>

      {showCancelModal && selectedRide && (
        <div
          className="lr-modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >
          <section
            className="lr-cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lr-cancel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lr-modal-icon">
              <CircleAlert size={24} />
            </div>
            <button
              type="button"
              className="lr-modal-close"
              aria-label="Close dialog"
              onClick={() => setShowCancelModal(false)}
            >
              <X size={19} />
            </button>
            <h2 id="lr-cancel-title">Cancel this ride?</h2>
            <p>
              You're about to mark <strong>{selectedRide.id}</strong> as
              cancelled in the demo interface.
            </p>

            <label className="lr-reason-label" htmlFor="lr-cancel-reason">
              Cancellation reason
            </label>
            <select
              id="lr-cancel-reason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
            >
              <option>Safety concern</option>
              <option>Customer requested cancellation</option>
              <option>Driver unavailable</option>
              <option>Route or vehicle issue</option>
              <option>Other</option>
            </select>

            <div className="lr-modal-actions">
              <button
                type="button"
                className="lr-modal-keep"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Ride
              </button>
              <button
                type="button"
                className="lr-modal-confirm"
                onClick={cancelSelectedRide}
              >
                Confirm Cancel
              </button>
            </div>
            <small>Reason selected: {cancelReason}</small>
          </section>
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon() {
  return <Activity size={16} />;
}

export default LiveRidesPage;
