
import React, { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Bell,
  Wallet,
  CarFront,
  Save,
  LockKeyhole,
  Mail,
  Phone,
  Percent,
  Clock,
  RotateCcw,
  CheckCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import "../styles/SettingsPage.css";

const initialSettings = {
  name: "RideBuddy Admin",
  email: "admin@ridebuddy.com",
  phone: "+91 98765 43210",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  emailNotifications: true,
  rideNotifications: true,
  paymentNotifications: true,
  kycNotifications: true,
  commission: "15",
  minimumFare: "50",
  cancellationWindow: "5",
  autoAssign: true,
  allowCash: true,
  allowOnlinePayment: true,
};

function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const updateSetting = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  };

  const saveSettings = (event) => {
    event.preventDefault();

    if (activeTab === "security") {
      if (!settings.currentPassword || !settings.newPassword) {
        setNoticeType("error");
        setNotice("Enter your current password and a new password.");
        return;
      }

      if (settings.newPassword.length < 8) {
        setNoticeType("error");
        setNotice("Your new password must contain at least 8 characters.");
        return;
      }

      if (settings.newPassword !== settings.confirmPassword) {
        setNoticeType("error");
        setNotice("New password and confirmation do not match.");
        return;
      }
    }

    if (activeTab === "commission") {
      if (
        settings.commission === "" ||
        !Number.isFinite(Number(settings.commission)) ||
        Number(settings.commission) < 0
      ) {
        setNoticeType("error");
        setNotice("Enter a valid commission amount of ₹0 or more.");
        return;
      }

      if (
        settings.minimumFare === "" ||
        !Number.isFinite(Number(settings.minimumFare)) ||
        Number(settings.minimumFare) < 0
      ) {
        setNoticeType("error");
        setNotice("Enter a valid minimum fare of ₹0 or more.");
        return;
      }

      if (
        settings.cancellationWindow === "" ||
        !Number.isFinite(Number(settings.cancellationWindow)) ||
        Number(settings.cancellationWindow) < 0
      ) {
        setNoticeType("error");
        setNotice("Enter a valid cancellation window of 0 minutes or more.");
        return;
      }
    }

    if (activeTab === "security") {
      setSettings((previous) => ({
        ...previous,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setNoticeType("success");
      setNotice(
        "Validation passed. Connect your password API to update your account securely."
      );
      return;
    }

    setNoticeType("success");
    setNotice(
      "Settings validated in this session. Connect your backend API to persist these changes."
    );
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setNotice("");
  };

  const tabs = [
    { id: "general", label: "General Profile", icon: UserRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "commission", label: "Fare & Commission", icon: Wallet },
    { id: "rides", label: "Ride Settings", icon: CarFront },
  ];

  const toggle = (key, label, description) => (
    <div className="setting-toggle-row" key={key}>
      <div className="setting-toggle-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={settings[key]}
        aria-label={label}
        className={`setting-switch ${settings[key] ? "setting-switch-on" : ""}`}
        onClick={() => updateSetting(key, !settings[key])}
      >
        <span />
      </button>
    </div>
  );

  const field = (label, key, options = {}) => (
    <label className="setting-field" key={key}>
      <span>{label}</span>
      <input
        type={options.type || "text"}
        value={settings[key]}
        onChange={(event) => updateSetting(key, event.target.value)}
        placeholder={options.placeholder || ""}
        min={options.min}
        step={options.step}
        autoComplete={options.autoComplete}
        required={options.required}
      />
      {options.hint && <small>{options.hint}</small>}
    </label>
  );

  return (
    <div className="settings-page">
      <header className="settings-page-header">
        <div>
          <span className="settings-eyebrow">ADMINISTRATION</span>
          <h1>Settings</h1>
          <p>Manage your account, platform rules and preferences.</p>
        </div>
        <div className="settings-header-icon">
          <SettingsIcon size={23} />
        </div>
      </header>

      {notice && (
        <div
          className={`settings-notice ${
            noticeType === "error" ? "settings-notice-error" : ""
          }`}
          role="status"
        >
          {noticeType === "error" ? (
            <ShieldCheck size={17} />
          ) : (
            <CheckCircle size={17} />
          )}
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-nav-card">
          <div className="settings-nav-title">SETTINGS MENU</div>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`settings-nav-item ${
                activeTab === id ? "settings-nav-active" : ""
              }`}
              onClick={() => {
                setActiveTab(id);
                setNotice("");
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
          <div className="settings-nav-help">
            <ShieldCheck size={19} />
            <strong>Admin workspace</strong>
            <span>Review changes before applying them to your live platform.</span>
          </div>
        </aside>

        <form className="settings-content-card" onSubmit={saveSettings}>
          {activeTab === "general" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <UserRound size={19} />
                </div>
                <div>
                  <h2>General Profile</h2>
                  <p>Update the contact details for your administrator account.</p>
                </div>
              </div>

              <div className="settings-profile-banner">
                <div className="settings-profile-avatar">
                  <UserRound size={29} />
                </div>
                <div>
                  <strong>{settings.name || "Admin User"}</strong>
                  <span>Platform Administrator</span>
                </div>
                <span className="settings-role-badge">ADMIN</span>
              </div>

              <div className="settings-form-grid">
                {field("Administrator Name", "name", {
                  required: true,
                  autoComplete: "name",
                })}
                {field("Email Address", "email", {
                  type: "email",
                  required: true,
                  autoComplete: "email",
                })}
                {field("Phone Number", "phone", {
                  type: "tel",
                  required: true,
                  autoComplete: "tel",
                })}
              </div>

              <div className="settings-info-strip">
                <Mail size={17} />
                <span>Use an email address you can access for important account alerts.</span>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <h2>Security & Password</h2>
                  <p>Keep your administrator account protected.</p>
                </div>
              </div>

              <div className="settings-security-banner">
                <LockKeyhole size={24} />
                <div>
                  <strong>Protect your admin account</strong>
                  <span>Use a unique password with at least 8 characters.</span>
                </div>
              </div>

              <div className="settings-form-grid settings-single-column">
                {field("Current Password", "currentPassword", {
                  type: "password",
                  required: true,
                  autoComplete: "current-password",
                })}
                {field("New Password", "newPassword", {
                  type: "password",
                  required: true,
                  autoComplete: "new-password",
                  hint: "Minimum 8 characters.",
                })}
                {field("Confirm New Password", "confirmPassword", {
                  type: "password",
                  required: true,
                  autoComplete: "new-password",
                })}
              </div>
              <p className="settings-security-note">
                This demo only validates the form. A secure backend endpoint is required
                to verify and change your actual password.
              </p>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <Bell size={19} />
                </div>
                <div>
                  <h2>Notification Preferences</h2>
                  <p>Choose which categories of alerts you want to receive.</p>
                </div>
              </div>

              <div className="settings-toggle-list">
                {toggle(
                  "emailNotifications",
                  "Email notifications",
                  "Receive important platform updates by email."
                )}
                {toggle(
                  "rideNotifications",
                  "Ride activity",
                  "Get alerts for new bookings, active rides and cancellations."
                )}
                {toggle(
                  "paymentNotifications",
                  "Payment alerts",
                  "Receive payment success, failure and pending alerts."
                )}
                {toggle(
                  "kycNotifications",
                  "Driver KYC updates",
                  "Get notified when drivers submit documents for review."
                )}
              </div>
            </>
          )}

          {activeTab === "commission" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <Wallet size={19} />
                </div>
                <div>
                  <h2>Fare & Commission</h2>
                  <p>Configure the default fare rules for the platform.</p>
                </div>
              </div>

              <div className="settings-commission-highlight">
                <div className="settings-commission-icon">
                  <Percent size={22} />
                </div>
                <div>
                  <span>Current demo commission</span>
                  <strong>₹{settings.commission || "0"} <small>/ completed ride</small></strong>
                </div>
              </div>

              <div className="settings-form-grid">
                {field("Platform Commission (₹)", "commission", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  required: true,
                  hint: "Commission charged for each completed ride.",
                })}
                {field("Minimum Ride Fare (₹)", "minimumFare", {
                  type: "number",
                  min: "0",
                  step: "1",
                  required: true,
                  hint: "Minimum fare allowed for a booking.",
                })}
                {field("Cancellation Window (minutes)", "cancellationWindow", {
                  type: "number",
                  min: "0",
                  step: "1",
                  required: true,
                  hint: "Demo cancellation setting, in minutes.",
                })}
              </div>

              <div className="settings-info-strip">
                <Wallet size={17} />
                <span>Changes here are only local until the backend commission and fare rules are connected.</span>
              </div>
            </>
          )}

          {activeTab === "rides" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-section-icon">
                  <CarFront size={19} />
                </div>
                <div>
                  <h2>Ride Settings</h2>
                  <p>Configure demo booking and payment preferences.</p>
                </div>
              </div>

              <div className="settings-toggle-list">
                {toggle(
                  "autoAssign",
                  "Automatic driver assignment",
                  "Allow the platform to assign an available driver automatically."
                )}
                {toggle(
                  "allowCash",
                  "Cash payments",
                  "Allow customers to select cash as a payment method."
                )}
                {toggle(
                  "allowOnlinePayment",
                  "Online payments",
                  "Allow customers to pay through supported online methods."
                )}
              </div>

              <div className="settings-info-strip">
                <Clock size={17} />
                <span>These controls update the page state only. Connect the booking API before using them in production.</span>
              </div>
            </>
          )}

          <div className="settings-form-footer">
            <button
              type="button"
              className="settings-reset-button"
              onClick={resetSettings}
            >
              <RotateCcw size={15} />
              Reset Demo Values
            </button>
            <button type="submit" className="settings-save-button">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <p className="settings-demo-note">
        Demo mode: changes are held in page state and will reset when the page reloads.
      </p>
    </div>
  );
}

export default SettingsPage;
