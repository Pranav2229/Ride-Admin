
import React, { useMemo, useState } from "react";
import {
  Search,
  UserRound,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  RotateCcw,
} from "lucide-react";

import "../styles/DriverKYCPage.css";

const initialApplications = [
  {
    id: 1,
    name: "Suresh Kumar",
    phone: "+91 98765 12345",
    documents: "7/7",
    status: "Pending",
    appliedOn: "10 Oct 2026",
    experience: "3 years",
    city: "Bengaluru",
  },
  {
    id: 2,
    name: "Vikram Singh",
    phone: "+91 87654 32109",
    documents: "6/7",
    status: "Pending",
    appliedOn: "09 Oct 2026",
    experience: "2 years",
    city: "Pune",
  },
  {
    id: 3,
    name: "Ramesh Patel",
    phone: "+91 91234 56789",
    documents: "5/7",
    status: "Pending",
    appliedOn: "08 Oct 2026",
    experience: "4 years",
    city: "Mumbai",
  },
  {
    id: 4,
    name: "Arun Kumar",
    phone: "+91 99887 65432",
    documents: "7/7",
    status: "Approved",
    appliedOn: "07 Oct 2026",
    experience: "5 years",
    city: "Pune",
  },
  {
    id: 5,
    name: "Santosh Yadav",
    phone: "+91 90123 45678",
    documents: "6/7",
    status: "Rejected",
    appliedOn: "06 Oct 2026",
    experience: "1 year",
    city: "Bengaluru",
  },
  {
    id: 6,
    name: "Mahesh Pawar",
    phone: "+91 97654 32108",
    documents: "7/7",
    status: "Approved",
    appliedOn: "05 Oct 2026",
    experience: "6 years",
    city: "Pune",
  },
];

function DriverKYCPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [notice, setNotice] = useState("");

  const counts = {
    Pending: applications.filter((item) => item.status === "Pending").length,
    Approved: applications.filter((item) => item.status === "Approved").length,
    Rejected: applications.filter((item) => item.status === "Rejected").length,
  };

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesTab = application.status === activeTab;
      const matchesSearch =
        application.name.toLowerCase().includes(search) ||
        application.phone.toLowerCase().includes(search);

      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchTerm]);

  const selectedDriver =
    applications.find((item) => item.id === selectedId) ||
    filteredApplications[0] ||
    applications[0];

  const updateStatus = (id, nextStatus) => {
    const driver = applications.find((item) => item.id === id);
    if (!driver) return;

    setApplications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedId(id);
    setNotice(`${driver.name}'s demo application was ${nextStatus.toLowerCase()}.`);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setNotice("");

    const firstMatch = applications.find((item) => item.status === tab);
    if (firstMatch) setSelectedId(firstMatch.id);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setNotice("");
  };

  return (
    <div className="driver-kyc-page">
      <header className="driver-kyc-header">
        <div>
          <span className="driver-kyc-eyebrow">VERIFICATION CENTER</span>
          <h1>Driver KYC Review</h1>
          <p>Review and verify driver applications.</p>
        </div>

        <div className="driver-kyc-header-icon">
          <FileText size={23} />
        </div>
      </header>

      <div className="driver-kyc-summary">
        <div className="kyc-summary-card">
          <span>Pending Review</span>
          <strong>{counts.Pending}</strong>
          <Clock size={19} />
        </div>
        <div className="kyc-summary-card">
          <span>Approved Applications</span>
          <strong>{counts.Approved}</strong>
          <CheckCircle size={19} />
        </div>
        <div className="kyc-summary-card">
          <span>Rejected Applications</span>
          <strong>{counts.Rejected}</strong>
          <XCircle size={19} />
        </div>
      </div>

      <div className="driver-kyc-layout">
        <section className="driver-kyc-card">
          <div className="driver-kyc-tabs">
            {["Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`driver-kyc-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => changeTab(tab)}
              >
                {tab}
                <span>{counts[tab]}</span>
              </button>
            ))}
          </div>

          <div className="driver-kyc-toolbar">
            <label className="driver-kyc-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search driver name or phone..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="driver-kyc-reset"
              onClick={resetSearch}
              aria-label="Reset search"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {notice && (
            <div className="driver-kyc-notice" role="status">
              <CheckCircle size={15} />
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")}>
                ×
              </button>
            </div>
          )}

          <div className="driver-kyc-table-wrap">
            <table className="driver-kyc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((driver, index) => (
                  <tr
                    key={driver.id}
                    className={
                      selectedDriver?.id === driver.id
                        ? "kyc-selected-row"
                        : ""
                    }
                    onClick={() => setSelectedId(driver.id)}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <button
                        type="button"
                        className="kyc-driver-name"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedId(driver.id);
                        }}
                      >
                        <span className="kyc-mini-avatar">
                          <UserRound size={15} />
                        </span>
                        {driver.name}
                      </button>
                    </td>
                    <td>{driver.phone}</td>
                    <td>
                      <span className="kyc-document-count">
                        <FileText size={13} />
                        {driver.documents}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`kyc-status kyc-status-${driver.status.toLowerCase()}`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td>
                      {driver.status === "Pending" ? (
                        <div className="kyc-row-actions">
                          <button
                            type="button"
                            className="kyc-approve-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              updateStatus(driver.id, "Approved");
                            }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="kyc-reject-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              updateStatus(driver.id, "Rejected");
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="kyc-reviewed-label">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="kyc-empty-state">
                        <FileText size={27} />
                        <strong>No {activeTab.toLowerCase()} applications</strong>
                        <span>
                          Try another tab or change your search.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="driver-kyc-table-footer">
            Showing {filteredApplications.length} {activeTab.toLowerCase()} applications
          </div>
        </section>

        <aside className="driver-kyc-profile">
          <div className="kyc-profile-heading">
            <h2>Driver Profile Summary</h2>
            <span>Selected applicant</span>
          </div>

          {selectedDriver && (
            <>
              <div className="kyc-profile-person">
                <div className="kyc-profile-avatar">
                  <UserRound size={30} />
                </div>
                <div>
                  <h3>{selectedDriver.name}</h3>
                  <p>
                    <Phone size={12} />
                    {selectedDriver.phone}
                  </p>
                </div>
              </div>

              <div className="kyc-profile-status-row">
                <span>Verification Status</span>
                <span
                  className={`kyc-status kyc-status-${selectedDriver.status.toLowerCase()}`}
                >
                  {selectedDriver.status}
                </span>
              </div>

              <div className="kyc-profile-detail">
                <CalendarDays size={15} />
                <div>
                  <span>Applied On</span>
                  <strong>{selectedDriver.appliedOn}</strong>
                </div>
              </div>

              <div className="kyc-profile-detail">
                <FileText size={15} />
                <div>
                  <span>Documents Submitted</span>
                  <strong>{selectedDriver.documents}</strong>
                </div>
              </div>

              <div className="kyc-profile-detail">
                <BriefcaseBusiness size={15} />
                <div>
                  <span>Driving Experience</span>
                  <strong>{selectedDriver.experience}</strong>
                </div>
              </div>

              <div className="kyc-profile-detail">
                <MapPin size={15} />
                <div>
                  <span>City</span>
                  <strong>{selectedDriver.city}</strong>
                </div>
              </div>

              {selectedDriver.status === "Pending" && (
                <div className="kyc-profile-actions">
                  <button
                    type="button"
                    className="kyc-approve-button"
                    onClick={() => updateStatus(selectedDriver.id, "Approved")}
                  >
                    <CheckCircle size={15} />
                    Approve Application
                  </button>
                  <button
                    type="button"
                    className="kyc-reject-button"
                    onClick={() => updateStatus(selectedDriver.id, "Rejected")}
                  >
                    <XCircle size={15} />
                    Reject Application
                  </button>
                </div>
              )}

              <p className="kyc-demo-note">
                Demo applicant information. No real identity documents are
                loaded or verified by this page.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default DriverKYCPage;
