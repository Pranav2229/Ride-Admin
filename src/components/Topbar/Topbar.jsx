
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

import "../../styles/Topbar.css";

function Topbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminToken");
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={15} />

        <input
          type="text"
          placeholder="Search by ride ID, customer, driver..."
          aria-label="Search RideBuddy admin panel"
        />

        <span className="search-shortcut">⌘</span>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="notification-count">3</span>
        </button>

        <div className="admin-profile-wrapper">
          <button
            type="button"
            className="admin-profile"
            aria-expanded={profileOpen}
            aria-label="Admin profile menu"
            onClick={() => setProfileOpen((open) => !open)}
          >
            <div className="admin-avatar">A</div>

            <div className="admin-info">
              <h4>Admin</h4>
              <span>Super Admin</span>
            </div>

            <ChevronDown className="admin-chevron" size={14} />
          </button>

          {profileOpen && (
            <div className="admin-profile-menu">
              <button type="button" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
