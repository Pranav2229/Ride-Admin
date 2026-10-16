
import React from "react";
import StatCard from "../components/StatCard/StatCard";
import LiveMap from "../components/LiveMap/LiveMap";
import "../styles/Dashboard.css";

function Dashboard() {
  const stats = [
    {
      title: "Total Rides",
      value: "1,248",
      percentage: "12%",
      icon: "car",
      type: "yellow",
    },
    {
      title: "Active Rides",
      value: "18",
      percentage: "8%",
      icon: "active",
      type: "green",
    },
    {
      title: "Online Drivers",
      value: "42",
      percentage: "15%",
      icon: "driver",
      type: "blue",
    },
    {
      title: "Total Customers",
      value: "520",
      percentage: "10%",
      icon: "customer",
      type: "purple",
    },
  ];

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
    hour < 12 ? "Good Morning" :
    hour < 17 ? "Good Afternoon" :
    "Good Evening";

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow">
            RIDE OPERATIONS
          </span>

          <h1>
            {greeting}, Admin <span>👋</span>
          </h1>

          <p>
            Here's what's happening with RideBuddy today.
          </p>
        </div>

        <div className="dashboard-date">
          <span className="dashboard-date-icon">▦</span>
          <div className="dashboard-date-info">
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
            icon={stat.icon}
            type={stat.type}
          />
        ))}
      </div>

      <div className="dashboard-map-section">
        <LiveMap />
      </div>

      <div className="dashboard-placeholder-grid">
        <section className="dashboard-placeholder-card">
          <div className="dashboard-placeholder-heading">
            <h2>Recent Ride Requests</h2>
            <span>Ride Management</span>
          </div>
          <p>
            Ride request information will appear here when we add
            the ride requests component.
          </p>
        </section>

        <section className="dashboard-placeholder-card">
          <div className="dashboard-placeholder-heading">
            <h2>Live Rides</h2>
            <span>Live Monitoring</span>
          </div>
          <p>
            Active ride details will appear here when we add
            the live rides component.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
