
import React, { useMemo, useState } from "react";
import {
  Search,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  UserRound,
  CarFront,
  CreditCard,
  MapPin,
  IdCard,
  Eye,
  RotateCcw,
  ShieldCheck,
  CalendarDays,
  BriefcaseBusiness,
  X,
} from "lucide-react";

import "../styles/DriverDocumentsPage.css";

const initialDrivers = [
  {
    id: "RB1001",
    name: "Ramesh Patel",
    phone: "+91 91234 56789",
    city: "Bengaluru",
    appliedOn: "10 Oct 2026",
    experience: "3 years",
    status: "Verified",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Verified", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Verified", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Verified", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Verified", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Verified", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1002",
    name: "Suresh Kumar",
    phone: "+91 98765 12345",
    city: "Pune",
    appliedOn: "10 Oct 2026",
    experience: "3 years",
    status: "Pending",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Pending", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Verified", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Pending", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Pending", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Verified", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1003",
    name: "Vikram Singh",
    phone: "+91 87654 32109",
    city: "Mumbai",
    appliedOn: "09 Oct 2026",
    experience: "2 years",
    status: "Pending",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Pending", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Pending", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Verified", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Pending", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Pending", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1004",
    name: "Arun Kumar",
    phone: "+91 99887 65432",
    city: "Pune",
    appliedOn: "08 Oct 2026",
    experience: "5 years",
    status: "Verified",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Verified", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Verified", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Verified", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Verified", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Verified", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1005",
    name: "Santosh Yadav",
    phone: "+91 90123 45678",
    city: "Bengaluru",
    appliedOn: "07 Oct 2026",
    experience: "1 year",
    status: "Pending",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Verified", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Pending", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Pending", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Pending", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Pending", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1006",
    name: "Mahesh Pawar",
    phone: "+91 97654 32108",
    city: "Pune",
    appliedOn: "06 Oct 2026",
    experience: "6 years",
    status: "Verified",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Verified", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Verified", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Verified", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Verified", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Verified", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Verified", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
  {
    id: "RB1007",
    name: "Amit Desai",
    phone: "+91 96543 21098",
    city: "Mumbai",
    appliedOn: "05 Oct 2026",
    experience: "2 years",
    status: "Rejected",
    documents: [
      { name: "Driving License", type: "Driving License", status: "Verified", icon: "license" },
      { name: "Aadhaar Card", type: "Address Proof", status: "Rejected", icon: "address" },
      { name: "PAN Card", type: "PAN Card", status: "Verified", icon: "pan" },
      { name: "Voter ID", type: "Identity Card", status: "Verified", icon: "identity" },
      { name: "Vehicle RC", type: "Vehicle RC", status: "Pending", icon: "vehicle" },
      { name: "Fitness Certificate", type: "Fitness Certificate", status: "Pending", icon: "fitness" },
      { name: "Taxi Permit", type: "Taxi Permit", status: "Pending", icon: "permit" },
      { name: "Driver Photo", type: "Driver Photo", status: "Verified", icon: "photo" },
    ],
  },
];

const documentIcon = (type) => {
  if (type === "Driving License") return <IdCard size={19} />;
  if (type === "Address Proof") return <MapPin size={19} />;
  if (type === "Vehicle RC" || type === "Fitness Certificate" || type === "Taxi Permit") {
    return <CarFront size={19} />;
  }
  if (type === "PAN Card" || type === "Identity Card") return <CreditCard size={19} />;
  return <UserRound size={19} />;
};

function DriverDocumentsPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [selectedId, setSelectedId] = useState("RB1001");
  const [activeTab, setActiveTab] = useState("All Drivers");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [previewDocument, setPreviewDocument] = useState(null);
  const [message, setMessage] = useState("");

  const selectedDriver =
    drivers.find((driver) => driver.id === selectedId) || drivers[0];

  const counts = {
    "All Drivers": drivers.length,
    Verified: drivers.filter((driver) => driver.status === "Verified").length,
    Pending: drivers.filter((driver) => driver.status === "Pending").length,
    Rejected: drivers.filter((driver) => driver.status === "Rejected").length,
  };

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.id.toLowerCase().includes(query);

      const matchesTab =
        activeTab === "All Drivers" || driver.status === activeTab;

      const matchesStatus =
        statusFilter === "All Status" || driver.status === statusFilter;

      return matchesSearch && matchesTab && matchesStatus;
    });
  }, [drivers, search, activeTab, statusFilter]);

  const allDocumentCount = drivers.reduce(
    (total, driver) => total + driver.documents.length,
    0
  );

  const verifiedDocumentCount = drivers.reduce(
    (total, driver) =>
      total +
      driver.documents.filter((document) => document.status === "Verified").length,
    0
  );

  const pendingDocumentCount = drivers.reduce(
    (total, driver) =>
      total +
      driver.documents.filter((document) => document.status === "Pending").length,
    0
  );

  const rejectedDocumentCount = drivers.reduce(
    (total, driver) =>
      total +
      driver.documents.filter((document) => document.status === "Rejected").length,
    0
  );

  const updateDocumentStatus = (driverId, documentName, nextStatus) => {
    setDrivers((previous) =>
      previous.map((driver) => {
        if (driver.id !== driverId) return driver;

        const updatedDocuments = driver.documents.map((document) =>
          document.name === documentName
            ? { ...document, status: nextStatus }
            : document
        );

        const requiredDocuments = updatedDocuments.filter(
          (document) => document.type !== "Driver Photo"
        );

        const hasRejected = requiredDocuments.some(
          (document) => document.status === "Rejected"
        );
        const hasPending = requiredDocuments.some(
          (document) => document.status === "Pending"
        );

        return {
          ...driver,
          documents: updatedDocuments,
          status: hasRejected ? "Rejected" : hasPending ? "Pending" : "Verified",
        };
      })
    );

    setMessage(`${documentName} marked as ${nextStatus.toLowerCase()}.`);
    setPreviewDocument(null);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setActiveTab("All Drivers");
    setMessage("");
  };

  const completedCount =
    selectedDriver?.documents.filter((document) => document.status === "Verified")
      .length || 0;

  return (
    <div className="driver-documents-page">
      <div className="documents-page-header">
        <div>
          <span className="documents-eyebrow">DOCUMENT VERIFICATION</span>
          <h1>Driver Documents</h1>
          <p>View and verify driver documents and credentials.</p>
        </div>
        <div className="documents-header-icon">
          <ShieldCheck size={23} />
        </div>
      </div>

      <div className="documents-stats">
        <article className="documents-stat-card">
          <div className="documents-stat-icon yellow">
            <FileText size={20} />
          </div>
          <div>
            <span>Total Documents</span>
            <strong>{allDocumentCount}</strong>
            <small>Across all listed drivers</small>
          </div>
        </article>

        <article className="documents-stat-card">
          <div className="documents-stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Verified Documents</span>
            <strong>{verifiedDocumentCount}</strong>
            <small>{allDocumentCount ? Math.round((verifiedDocumentCount / allDocumentCount) * 100) : 0}% of listed documents</small>
          </div>
        </article>

        <article className="documents-stat-card">
          <div className="documents-stat-icon amber">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Pending Documents</span>
            <strong>{pendingDocumentCount}</strong>
            <small>Waiting for review</small>
          </div>
        </article>

        <article className="documents-stat-card">
          <div className="documents-stat-icon red">
            <XCircle size={20} />
          </div>
          <div>
            <span>Rejected Documents</span>
            <strong>{rejectedDocumentCount}</strong>
            <small>Require attention</small>
          </div>
        </article>
      </div>

      <div className="documents-main-layout">
        <section className="documents-list-panel">
          <div className="documents-tabs">
            {[
              ["All Drivers", counts["All Drivers"]],
              ["Verified", counts.Verified],
              ["Pending", counts.Pending],
              ["Rejected", counts.Rejected],
            ].map(([tab, count]) => (
              <button
                key={tab}
                type="button"
                className={`documents-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} <span>{count}</span>
              </button>
            ))}
          </div>

          <div className="documents-toolbar">
            <label className="documents-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by driver name, phone or ID..."
              />
            </label>

            <select
              aria-label="Filter by verification status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>

            <button
              type="button"
              className="documents-reset-button"
              onClick={resetFilters}
              title="Reset filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>

          {message && (
            <div className="documents-message" role="status">
              <CheckCircle2 size={16} />
              {message}
              <button type="button" onClick={() => setMessage("")} aria-label="Dismiss">
                <X size={15} />
              </button>
            </div>
          )}

          <div className="documents-table-wrap">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver</th>
                  <th>Phone Number</th>
                  <th>Documents</th>
                  <th>Verification Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver, index) => {
                  const verified = driver.documents.filter(
                    (document) => document.status === "Verified"
                  ).length;

                  return (
                    <tr
                      key={driver.id}
                      className={selectedId === driver.id ? "selected" : ""}
                      onClick={() => setSelectedId(driver.id)}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <button
                          type="button"
                          className="documents-driver-cell"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(driver.id);
                          }}
                        >
                          <span className="documents-driver-avatar">
                            <UserRound size={18} />
                          </span>
                          <span>
                            <strong>{driver.name}</strong>
                            <small>{driver.id}</small>
                          </span>
                        </button>
                      </td>
                      <td>{driver.phone}</td>
                      <td>
                        <strong>{verified}/{driver.documents.length}</strong>
                      </td>
                      <td>
                        <span className={`documents-status ${driver.status.toLowerCase()}`}>
                          {driver.status === "Verified" && <CheckCircle2 size={13} />}
                          {driver.status === "Pending" && <Clock3 size={13} />}
                          {driver.status === "Rejected" && <XCircle size={13} />}
                          {driver.status}
                        </span>
                      </td>
                      <td>
                        <div className="documents-row-actions">
                          <button
                            type="button"
                            className="documents-view-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(driver.id);
                            }}
                          >
                            View
                          </button>
                          {driver.status === "Pending" && (
                            <button
                              type="button"
                              className="documents-review-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(driver.id);
                                const firstPending = driver.documents.find(
                                  (document) => document.status === "Pending"
                                );
                                if (firstPending) {
                                  setPreviewDocument({
                                    driverId: driver.id,
                                    document: firstPending,
                                  });
                                }
                              }}
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="documents-empty">
                        <FileText size={27} />
                        <strong>No matching drivers</strong>
                        <span>Try changing your search or filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="documents-table-footer">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </div>
        </section>

        {selectedDriver && (
          <aside className="documents-profile-panel">
            <div className="documents-profile-heading">
              <div>
                <h2>Driver Profile &amp; Documents</h2>
                <p>Review submitted credentials</p>
              </div>
            </div>

            <div className="documents-driver-summary">
              <div className="documents-profile-person">
                <div className="documents-large-avatar">
                  <UserRound size={30} />
                </div>
                <div className="documents-profile-name">
                  <h3>{selectedDriver.name}</h3>
                  <p>{selectedDriver.phone}</p>
                </div>
                <span className={`documents-status ${selectedDriver.status.toLowerCase()}`}>
                  {selectedDriver.status}
                </span>
              </div>

              <div className="documents-driver-details">
                <div>
                  <FileText size={15} />
                  <span>
                    <small>Driver ID</small>
                    <strong>#{selectedDriver.id}</strong>
                  </span>
                </div>
                <div>
                  <CalendarDays size={15} />
                  <span>
                    <small>Applied On</small>
                    <strong>{selectedDriver.appliedOn}</strong>
                  </span>
                </div>
                <div>
                  <BriefcaseBusiness size={15} />
                  <span>
                    <small>Experience</small>
                    <strong>{selectedDriver.experience}</strong>
                  </span>
                </div>
                <div>
                  <MapPin size={15} />
                  <span>
                    <small>City</small>
                    <strong>{selectedDriver.city}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="documents-section-title">
              <h3>Documents</h3>
              <span>
                {completedCount}/{selectedDriver.documents.length} Verified
              </span>
            </div>

            <div className="documents-card-grid">
              {selectedDriver.documents.map((document) => (
                <article className="individual-document-card" key={document.name}>
                  <div className="individual-document-heading">
                    <span className="individual-document-icon">
                      {documentIcon(document.type)}
                    </span>
                    <strong>{document.name}</strong>
                  </div>

                  <span className={`documents-status ${document.status.toLowerCase()}`}>
                    {document.status === "Verified" && <CheckCircle2 size={12} />}
                    {document.status === "Pending" && <Clock3 size={12} />}
                    {document.status === "Rejected" && <XCircle size={12} />}
                    {document.status}
                  </span>

                  <div className="document-placeholder">
                    <FileText size={29} />
                    <span>Document preview</span>
                  </div>

                  <button
                    type="button"
                    className="document-preview-button"
                    onClick={() =>
                      setPreviewDocument({
                        driverId: selectedDriver.id,
                        document,
                      })
                    }
                  >
                    <Eye size={13} />
                    Preview &amp; Review
                  </button>
                </article>
              ))}
            </div>

            <p className="documents-demo-note">
              Demo data only. Document previews are placeholders until real uploaded files are connected.
            </p>
          </aside>
        )}
      </div>

      {previewDocument && (
        <div
          className="documents-modal-backdrop"
          onClick={() => setPreviewDocument(null)}
          role="presentation"
        >
          <section
            className="documents-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="documents-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="documents-modal-header">
              <div>
                <span>DOCUMENT REVIEW</span>
                <h2 id="documents-modal-title">
                  {previewDocument.document.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                aria-label="Close document review"
              >
                <X size={19} />
              </button>
            </div>

            <div className="documents-modal-preview">
              <FileText size={52} />
              <strong>{previewDocument.document.name}</strong>
              <span>
                A real document preview will appear here when uploaded file URLs are connected.
              </span>
              <span className={`documents-status ${previewDocument.document.status.toLowerCase()}`}>
                Current status: {previewDocument.document.status}
              </span>
            </div>

            <div className="documents-modal-actions">
              <button
                type="button"
                className="documents-modal-secondary"
                onClick={() =>
                  updateDocumentStatus(
                    previewDocument.driverId,
                    previewDocument.document.name,
                    "Rejected"
                  )
                }
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                type="button"
                className="documents-modal-approve"
                onClick={() =>
                  updateDocumentStatus(
                    previewDocument.driverId,
                    previewDocument.document.name,
                    "Verified"
                  )
                }
              >
                <CheckCircle2 size={16} />
                Mark Verified
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default DriverDocumentsPage;
