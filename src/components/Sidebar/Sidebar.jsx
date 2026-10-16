
import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  ShieldCheck,
  Files,
  Radio,
  Route,
  ChartColumnIncreasing,
  MapPin,
  Settings,
} from "lucide-react";

import "../../styles/Sidebar.css";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Drivers",
      path: "/drivers",
      icon: UserRound,
    },
    {
      name: "Driver KYC",
      path: "/driver-kyc",
      icon: ShieldCheck,
    },
    {
      name: "Driver Documents",
      path: "/driver-documents",
      icon: Files,
    },
    {
      name: "Live Rides",
      path: "/live-rides",
      icon: Radio,
    },
    {
      name: "Trip Management",
      path: "/trip-management",
      icon: Route,
    },
    {
      name: "Revenue & Reports",
      path: "/reports",
      icon: ChartColumnIncreasing,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-logo">
        <div className="logo-pin">
          <MapPin size={25} strokeWidth={3} />
        </div>

        <div className="logo-text">
          <h1>RideBuddy</h1>
          <p>ADMIN PANEL</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          MAIN MENU
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              title={item.name}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <Icon
                className="sidebar-item-icon"
                size={17}
                strokeWidth={2.2}
              />

              <span className="sidebar-item-text">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-line" />

        <div className="sidebar-footer-brand">
          <div className="sidebar-footer-pin">
            <MapPin size={17} />
          </div>

          <div>
            <p className="sidebar-footer-title">
              RideBuddy
            </p>
            <p className="sidebar-footer-subtitle">
              Admin Dashboard
            </p>
          </div>
        </div>

        <p className="sidebar-copyright">
          © 2026 RideBuddy
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
