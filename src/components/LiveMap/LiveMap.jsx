import React from "react";

import {
  RefreshCw,
  Plus,
  Minus,
  Car,
  UserRound,
  MapPin,
} from "lucide-react";

import "../../styles/LiveMap.css";

function LiveMap() {
  const drivers = [
    {
      id: 1,
      left: "15%",
      top: "17%",
    },
    {
      id: 2,
      left: "53%",
      top: "27%",
    },
    {
      id: 3,
      left: "73%",
      top: "21%",
    },
    {
      id: 4,
      left: "91%",
      top: "34%",
    },
    {
      id: 5,
      left: "12%",
      top: "67%",
    },
    {
      id: 6,
      left: "42%",
      top: "63%",
    },
    {
      id: 7,
      left: "54%",
      top: "82%",
    },
    {
      id: 8,
      left: "66%",
      top: "76%",
    },
    {
      id: 9,
      left: "91%",
      top: "73%",
    },
  ];

  return (
    <section className="live-map-card">

      {/* =========================
          MAP HEADER
      ========================= */}

      <div className="live-map-header">

        <div>
          <h2>Live Map</h2>

          <p>
            Track drivers, customers and ongoing rides in real-time
          </p>
        </div>

        <div className="live-map-actions">

          <div className="live-status">
            <span className="live-dot"></span>
            Live
          </div>

          <button
            className="map-refresh-button"
            type="button"
            aria-label="Refresh map"
          >
            <RefreshCw size={18} />
          </button>

        </div>

      </div>

      {/* =========================
          MAP
      ========================= */}

      <div className="map-container">

        {/* Map background */}

        <div className="map-background">

          {/* Roads */}

          <div className="map-road road-1"></div>
          <div className="map-road road-2"></div>
          <div className="map-road road-3"></div>
          <div className="map-road road-4"></div>
          <div className="map-road road-5"></div>

          {/* Water / River */}

          <div className="map-river"></div>

          {/* Area labels */}

          <span className="map-label label-baner">
            BANER
          </span>

          <span className="map-label label-aundh">
            AUNDH
          </span>

          <span className="map-label label-kothrud">
            KOTHRUD
          </span>

          <span className="map-label label-hadapsar">
            HADAPSAR
          </span>

          <span className="map-city">
            Pune
          </span>

          {/* Driver markers */}

          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="driver-map-marker"
              style={{
                left: driver.left,
                top: driver.top,
              }}
            >
              <Car size={16} />
            </div>
          ))}

          {/* Customer marker */}

          <div className="customer-map-marker">
            <UserRound size={17} />
          </div>

          {/* Destination marker */}

          <div className="destination-map-marker">
            <MapPin size={24} />
          </div>

          {/* Route */}

          <div className="ride-route"></div>

          {/* Driver information */}

          <div className="driver-map-info">

            <div className="driver-avatar">
              <UserRound size={17} />
            </div>

            <div>
              <span>Driver</span>

              <strong>Rahul Patil</strong>

              <small>1.2 km</small>
            </div>

          </div>

          {/* Zoom controls */}

          <div className="map-zoom-controls">

            <button type="button">
              <Plus size={20} />
            </button>

            <button type="button">
              <Minus size={20} />
            </button>

          </div>

          {/* Map legend */}

          <div className="map-legend">

            <div className="legend-item">
              <span className="legend-driver">
                <Car size={12} />
              </span>
              Driver
            </div>

            <div className="legend-item">
              <span className="legend-customer">
                <UserRound size={12} />
              </span>
              Customer
            </div>

            <div className="legend-item">
              <span className="legend-destination">
                <MapPin size={13} />
              </span>
              Destination
            </div>

            <div className="legend-item">
              <span className="legend-active"></span>
              Active Ride
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default LiveMap;