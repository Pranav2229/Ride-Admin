
import React from "react";
import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import "../../styles/Topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <Search size={15} />

        <input
          type="text"
          placeholder="Search by ride ID, customer, driver..."
          aria-label="Search RideBuddy admin panel"
        />

        <span className="search-shortcut">⌘</span>
      </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* Notifications */}
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={17} />

          <span className="notification-count">3</span>
        </button>

        {/* Admin Profile */}
        <button
          type="button"
          className="admin-profile"
          aria-label="Admin profile"
        >
          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <h4>Admin</h4>
            <span>Super Admin</span>
          </div>

          <ChevronDown
            className="admin-chevron"
            size={14}
          />
        </button>
      </div>
    </header>
  );
}

export default Topbar;