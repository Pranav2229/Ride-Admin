// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   CheckCircle2,
//   Clock3,
//   XCircle,
//   UserRound,
//   CarFront,
//   CreditCard,
//   RotateCcw,
//   ShieldCheck,
//   CalendarDays,
//   X,
//   Loader2,
//   AlertCircle,
//   FileText,
// } from "lucide-react";

// import { adminApi } from "../services/api";
// import "../styles/DriverDocumentsPage.css";

// // =====================================================
// // HELPERS
// // =====================================================
// function getAdminToken() {
//   return (
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("adminToken") ||
//     sessionStorage.getItem("accessToken") ||
//     sessionStorage.getItem("adminToken") ||
//     null
//   );
// }

// const TAB_TO_API = {
//   "All Drivers": "PENDING",
//   Verified: "APPROVED",
//   Pending: "PENDING",
//   Rejected: "REJECTED",
// };

// const STATUS_TO_DISPLAY = {
//   VERIFIED: "Verified",
//   APPROVED: "Verified",
//   PENDING: "Pending",
//   REJECTED: "Rejected",
// };

// function formatDate(dateStr) {
//   if (!dateStr) return "—";
//   try {
//     return new Date(dateStr).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return dateStr;
//   }
// }

// // Preset rejection reasons
// const VEHICLE_REJECT_REASONS = [
//   "Vehicle number plate is not visible",
//   "Vehicle RC does not match the vehicle",
//   "Fitness certificate is expired",
//   "Vehicle photos are unclear / blurry",
//   "Vehicle type is incorrect",
//   "Other (enter custom reason)",
// ];

// const BANK_REJECT_REASONS = [
//   "Account number does not match records",
//   "IFSC code is invalid",
//   "Beneficiary name mismatch",
//   "Cancelled cheque is not readable",
//   "Bank details appear to belong to a different person",
//   "Other (enter custom reason)",
// ];

// const DOCUMENT_REJECT_REASONS = {
//   driver_photo: [
//     "Photo is blurry",
//     "Face is not clearly visible",
//     "Photo does not match ID",
//     "Other (enter custom reason)",
//   ],
//   driving_license: [
//     "License number is not readable",
//     "License has expired",
//     "License does not match the driver",
//     "Other (enter custom reason)",
//   ],
//   address_proof: [
//     "Address is not clearly visible",
//     "Document has expired",
//     "Document is not an accepted type",
//     "Other (enter custom reason)",
//   ],
//   pan_card: [
//     "PAN number is blurry",
//     "PAN does not match name",
//     "Other (enter custom reason)",
//   ],
//   epic_card: [
//     "Voter ID is not readable",
//     "EPIC number does not match",
//     "Other (enter custom reason)",
//   ],
//   vehicle_rc: [
//     "RC number does not match",
//     "RC is expired",
//     "RC is blurry",
//     "Other (enter custom reason)",
//   ],
//   vehicle_fitness_certificate: [
//     "Fitness certificate is expired",
//     "Certificate is not readable",
//     "Other (enter custom reason)",
//   ],
//   taxi_permit: [
//     "Taxi permit is expired",
//     "Permit does not match the vehicle",
//     "Other (enter custom reason)",
//   ],
// };

// function DriverDocumentsPage() {
//   const [drivers, setDrivers] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedDetail, setSelectedDetail] = useState(null);

//   const [activeTab, setActiveTab] = useState("All Drivers");
//   const [search, setSearch] = useState("");

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Preview modal
//   const [previewDocument, setPreviewDocument] = useState(null);

//   // Reject modal
//   const [rejectModal, setRejectModal] = useState(null);
//   const [rejectPresetReason, setRejectPresetReason] = useState("");
//   const [rejectCustomReason, setRejectCustomReason] = useState("");

//   // ---------------------------------------------------
//   // LOAD LIST
//   // ---------------------------------------------------
//   const loadList = useCallback(async (tab) => {
//     const token = getAdminToken();
//     if (!token) {
//       setError("Not authenticated. Please login again.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     try {
//       const res = await adminApi.getKycList(token, {
//         status: TAB_TO_API[tab] || "PENDING",
//         limit: 100,
//       });

//       if (res?.success) {
//         setDrivers(res.data || []);
//         if (res.data?.length > 0) {
//           setSelectedId((prev) => prev || res.data[0].driver_id);
//         }
//       } else {
//         setError(res?.message || "Failed to load list");
//         setDrivers([]);
//       }
//     } catch (e) {
//       console.error("loadList error:", e.message);
//       setError(e.message || "Unable to load drivers");
//       setDrivers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ---------------------------------------------------
//   // LOAD DETAIL
//   // ---------------------------------------------------
//   const loadDetail = useCallback(async (driverId) => {
//     const token = getAdminToken();
//     if (!token || !driverId) return;

//     setLoadingDetail(true);
//     try {
//       // ✅ Use getKycDetail which includes the _status fields for documents
//       const res = await adminApi.getKycDetail(token, driverId);
//       if (res?.success) setSelectedDetail(res.data);
//       else setSelectedDetail(null);
//     } catch (e) {
//       console.error("loadDetail error:", e.message);
//       setSelectedDetail(null);
//     } finally {
//       setLoadingDetail(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadList(activeTab);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab]);

//   useEffect(() => {
//     if (selectedId) loadDetail(selectedId);
//   }, [selectedId, loadDetail]);

//   // ---------------------------------------------------
//   // COUNTS
//   // ---------------------------------------------------
//   const counts = {
//     "All Drivers": drivers.length,
//     Verified: drivers.filter(
//       (d) => d.status === "APPROVED" || d.status === "VERIFIED"
//     ).length,
//     Pending: drivers.filter((d) => d.status === "PENDING").length,
//     Rejected: drivers.filter((d) => d.status === "REJECTED").length,
//   };

//   // ---------------------------------------------------
//   // SEARCH FILTER
//   // ---------------------------------------------------
//   const filteredDrivers = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return drivers;
//     return drivers.filter(
//       (d) =>
//         d.name?.toLowerCase().includes(q) ||
//         d.phone?.toLowerCase().includes(q) ||
//         String(d.driver_id).includes(q)
//     );
//   }, [drivers, search]);

//   // ---------------------------------------------------
//   // APPROVE VEHICLE OR BANK
//   // ---------------------------------------------------
//   const approveSection = async (driverId, section) => {
//     const token = getAdminToken();
//     if (!token) return setError("Not authenticated");

//     setActionLoading(true);
//     setError("");
//     try {
//       const res = await adminApi.updateKycSection(
//         token,
//         driverId,
//         section,
//         "VERIFIED",
//         null
//       );
//       if (res?.success) {
//         setMessage(
//           `${section === "vehicle" ? "Vehicle" : "Bank details"} approved.`
//         );
//         await Promise.all([loadList(activeTab), loadDetail(driverId)]);
//       } else {
//         setError(res?.message || "Approve failed");
//       }
//     } catch (e) {
//       console.error("approveSection error:", e.message);
//       setError(e.message || "Approve failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ---------------------------------------------------
//   // APPROVE DOCUMENT
//   // ---------------------------------------------------
//   const approveDocument = async (driverId, docKey) => {
//     const token = getAdminToken();
//     if (!token) return setError("Not authenticated");

//     setActionLoading(true);
//     setError("");
//     try {
//       const res = await adminApi.updateDocumentStatus(token, driverId, docKey, "VERIFIED", null);
//       if (res?.success) {
//         setMessage(`${docKey} approved.`);
//         await Promise.all([loadList(activeTab), loadDetail(driverId)]);
//       } else {
//         setError(res?.message || "Approve failed");
//       }
//     } catch (e) {
//       setError(e.message || "Approve failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ---------------------------------------------------
//   // OPEN REJECT MODALS
//   // ---------------------------------------------------
//   const openRejectModal = (driverId, section) => {
//     setRejectModal({
//       driverId,
//       section,
//       presets:
//         section === "vehicle" ? VEHICLE_REJECT_REASONS : BANK_REJECT_REASONS,
//     });
//     setRejectPresetReason("");
//     setRejectCustomReason("");
//   };

//   const openRejectDocumentModal = (driverId, docKey, docLabel) => {
//     setRejectModal({
//       driverId,
//       section: docKey,
//       documentLabel: docLabel,
//       isDocument: true,
//       presets: DOCUMENT_REJECT_REASONS[docKey] || ["Other (enter custom reason)"],
//     });
//     setRejectPresetReason("");
//     setRejectCustomReason("");
//   };

//   // ---------------------------------------------------
//   // SUBMIT REJECT
//   // ---------------------------------------------------
//   const submitReject = async () => {
//     if (!rejectModal) return;

//     const isCustom = rejectPresetReason === "Other (enter custom reason)";
//     const finalReason = isCustom
//       ? rejectCustomReason.trim()
//       : rejectPresetReason.trim();

//     if (!finalReason || finalReason.length < 5) {
//       setError("Please select or enter a reason (min 5 characters)");
//       return;
//     }

//     const token = getAdminToken();
//     if (!token) return setError("Not authenticated");

//     setActionLoading(true);
//     setError("");
//     try {
//       let res;
//       if (rejectModal.isDocument) {
//         res = await adminApi.updateDocumentStatus(token, rejectModal.driverId, rejectModal.section, "REJECTED", finalReason);
//       } else {
//         res = await adminApi.updateKycSection(token, rejectModal.driverId, rejectModal.section, "REJECTED", finalReason);
//       }

//       if (res?.success) {
//         const label = rejectModal.isDocument
//           ? rejectModal.documentLabel
//           : (rejectModal.section === "vehicle" ? "Vehicle" : "Bank details");

//         setMessage(`${label} rejected.`);
//         const driverId = rejectModal.driverId;
//         setRejectModal(null);
//         await Promise.all([loadList(activeTab), loadDetail(driverId)]);
//       } else {
//         setError(res?.message || "Reject failed");
//       }
//     } catch (e) {
//       console.error("submitReject error:", e.message);
//       setError(e.message || "Reject failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setActiveTab("All Drivers");
//     setMessage("");
//     setError("");
//   };

//   // ---------------------------------------------------
//   // DERIVED DATA
//   // ---------------------------------------------------
//   const driver = selectedDetail?.driver || null;
//   const vehicle = selectedDetail?.vehicle || null;
//   const bank = selectedDetail?.bank || null;

//   const documents = selectedDetail?.documents || {};
  
//   // ✅ documentList reads status and reason directly from the SP response
//   const documentList = [
//     { key: "driver_photo", label: "Driver Photo", url: documents.driver_photo, status: documents.driver_photo_status, reason: documents.driver_photo_rejection_reason },
//     { key: "driving_license", label: "Driving License", url: documents.driving_license, status: documents.driving_license_status, reason: documents.driving_license_rejection_reason },
//     { key: "address_proof", label: "Address Proof", url: documents.address_proof, status: documents.address_proof_status, reason: documents.address_proof_rejection_reason },
//     { key: "pan_card", label: "PAN Card", url: documents.pan_card, status: documents.pan_card_status, reason: documents.pan_card_rejection_reason },
//     { key: "epic_card", label: "Voter ID (EPIC)", url: documents.epic_card, status: documents.epic_card_status, reason: documents.epic_card_rejection_reason },
//     { key: "vehicle_rc", label: "Vehicle RC", url: documents.vehicle_rc, status: documents.vehicle_rc_status, reason: documents.vehicle_rc_rejection_reason },
//     { key: "vehicle_fitness_certificate", label: "Fitness Cert", url: documents.vehicle_fitness_certificate, status: documents.vehicle_fitness_certificate_status, reason: documents.vehicle_fitness_certificate_rejection_reason },
//     { key: "taxi_permit", label: "Taxi Permit", url: documents.taxi_permit, status: documents.taxi_permit_status, reason: documents.taxi_permit_rejection_reason },
//   ];

//   // ---------------------------------------------------
//   // STATUS HELPERS
//   // ---------------------------------------------------
//   const StatusPill = ({ status }) => {
//     const display = STATUS_TO_DISPLAY[status] || "Pending";
//     return (
//       <span className={`documents-status ${display.toLowerCase()}`}>
//         {display === "Verified" && <CheckCircle2 size={12} />}
//         {display === "Pending" && <Clock3 size={12} />}
//         {display === "Rejected" && <XCircle size={12} />}
//         {display}
//       </span>
//     );
//   };

//   const getVehicleStatus = () => {
//     if (!vehicle) return "PENDING";
//     if (vehicle.rejection_reason) return "REJECTED";
//     if (vehicle.is_verified === true) return "VERIFIED";
//     return "PENDING";
//   };

//   const getBankStatus = () => {
//     if (!bank) return "PENDING";
//     return bank.verification_status || "PENDING";
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <div className="driver-documents-page">
//       <div className="documents-page-header">
//         <div>
//           <span className="documents-eyebrow">VEHICLE & BANK VERIFICATION</span>
//           <h1>Driver Verification</h1>
//           <p>Approve or reject driver's vehicle, bank, and documents.</p>
//         </div>
//         <div className="documents-header-icon">
//           <ShieldCheck size={23} />
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="documents-stats">
//         <article className="documents-stat-card">
//           <div className="documents-stat-icon yellow">
//             <UserRound size={20} />
//           </div>
//           <div>
//             <span>Total Drivers</span>
//             <strong>{counts["All Drivers"]}</strong>
//             <small>Under review</small>
//           </div>
//         </article>
//         <article className="documents-stat-card">
//           <div className="documents-stat-icon green">
//             <CheckCircle2 size={20} />
//           </div>
//           <div>
//             <span>Fully Verified</span>
//             <strong>{counts.Verified}</strong>
//             <small>All sections approved</small>
//           </div>
//         </article>
//         <article className="documents-stat-card">
//           <div className="documents-stat-icon amber">
//             <Clock3 size={20} />
//           </div>
//           <div>
//             <span>Pending</span>
//             <strong>{counts.Pending}</strong>
//             <small>Waiting for review</small>
//           </div>
//         </article>
//         <article className="documents-stat-card">
//           <div className="documents-stat-icon red">
//             <XCircle size={20} />
//           </div>
//           <div>
//             <span>Rejected</span>
//             <strong>{counts.Rejected}</strong>
//             <small>Require attention</small>
//           </div>
//         </article>
//       </div>

//       <div className="documents-main-layout">
//         {/* LEFT LIST */}
//         <section className="documents-list-panel">
//           <div className="documents-tabs">
//             {[
//               ["All Drivers", counts["All Drivers"]],
//               ["Verified", counts.Verified],
//               ["Pending", counts.Pending],
//               ["Rejected", counts.Rejected],
//             ].map(([tab, count]) => (
//               <button
//                 key={tab}
//                 type="button"
//                 className={`documents-tab ${activeTab === tab ? "active" : ""}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab} <span>{count}</span>
//               </button>
//             ))}
//           </div>

//           <div className="documents-toolbar">
//             <label className="documents-search">
//               <Search size={16} />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by driver name, phone or ID..."
//               />
//             </label>
//             <button
//               type="button"
//               className="documents-reset-button"
//               onClick={resetFilters}
//               title="Reset filters"
//             >
//               <RotateCcw size={15} /> <span>Reset</span>
//             </button>
//           </div>

//           {message && (
//             <div className="documents-message" role="status">
//               <CheckCircle2 size={16} /> {message}
//               <button onClick={() => setMessage("")}>
//                 <X size={15} />
//               </button>
//             </div>
//           )}

//           {error && (
//             <div
//               className="documents-message"
//               style={{ background: "#FEE2E2", color: "#991B1B" }}
//             >
//               <AlertCircle size={16} /> {error}
//               <button onClick={() => setError("")}>
//                 <X size={15} />
//               </button>
//             </div>
//           )}

//           <div className="documents-table-wrap">
//             <table className="documents-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Driver</th>
//                   <th>Phone</th>
//                   <th>Vehicle</th>
//                   <th>Bank</th>
//                   <th>Overall</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: "center", padding: 30 }}>
//                       <Loader2 size={27} className="documents-spin" />
//                       <div style={{ marginTop: 8, color: "#6B7280" }}>Loading…</div>
//                     </td>
//                   </tr>
//                 ) : filteredDrivers.length === 0 ? (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="documents-empty">
//                         <UserRound size={27} />
//                         <strong>No matching drivers</strong>
//                         <span>Try changing your search or filters.</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredDrivers.map((d, i) => (
//                     <tr
//                       key={d.driver_id}
//                       className={selectedId === d.driver_id ? "selected" : ""}
//                       onClick={() => setSelectedId(d.driver_id)}
//                     >
//                       <td>{i + 1}</td>
//                       <td>
//                         <button
//                           type="button"
//                           className="documents-driver-cell"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedId(d.driver_id);
//                           }}
//                         >
//                           <span className="documents-driver-avatar">
//                             <UserRound size={18} />
//                           </span>
//                           <span>
//                             <strong>{d.name}</strong>
//                             <small>#{d.driver_id}</small>
//                           </span>
//                         </button>
//                       </td>
//                       <td>{d.phone}</td>
//                       <td>
//                         {d.vehicle_number ? (
//                           <StatusPill
//                             status={d.vehicle_verified ? "VERIFIED" : "PENDING"}
//                           />
//                         ) : (
//                           <span style={{ color: "#9CA3AF" }}>—</span>
//                         )}
//                       </td>
//                       <td>
//                         {d.bank_name ? (
//                           <StatusPill status={d.bank_status} />
//                         ) : (
//                           <span style={{ color: "#9CA3AF" }}>—</span>
//                         )}
//                       </td>
//                       <td>
//                         <StatusPill status={d.status} />
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="documents-table-footer">
//             Showing {filteredDrivers.length} of {drivers.length} drivers
//           </div>
//         </section>

//         {/* RIGHT DETAIL */}
//         {driver && (
//           <aside className="documents-profile-panel">
//             <div className="documents-profile-heading">
//               <div>
//                 <h2>Driver Details</h2>
//                 <p>Approve each section individually</p>
//               </div>
//             </div>

//             <div className="documents-driver-summary">
//               <div className="documents-profile-person">
//                 <div className="documents-large-avatar">
//                   <UserRound size={30} />
//                 </div>
//                 <div className="documents-profile-name">
//                   <h3>{driver.full_name || driver.name}</h3>
//                   <p>{driver.phone}</p>
//                 </div>
//               </div>
//               <div className="documents-driver-details">
//                 <div>
//                   <UserRound size={15} />
//                   <span>
//                     <small>Driver ID</small>
//                     <strong>#{driver.driver_id}</strong>
//                   </span>
//                 </div>
//                 <div>
//                   <CalendarDays size={15} />
//                   <span>
//                     <small>Applied On</small>
//                     <strong>{formatDate(driver.created_at)}</strong>
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {loadingDetail ? (
//               <div style={{ padding: 30, textAlign: "center" }}>
//                 <Loader2 size={27} className="documents-spin" />
//               </div>
//             ) : (
//               <>
//                 {/* VEHICLE */}
//                 <div className="documents-section-title" style={{ marginTop: 20 }}>
//                   <h3>
//                     <CarFront size={18} style={{ display: "inline", marginRight: 6 }} />
//                     Vehicle Details
//                   </h3>
//                   <StatusPill status={getVehicleStatus()} />
//                 </div>

//                 {vehicle ? (
//                   <div
//                     style={{
//                       border: "1px solid #E5E7EB",
//                       borderRadius: 12,
//                       padding: 14,
//                       marginBottom: 16,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: 10,
//                         fontSize: 13,
//                       }}
//                     >
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Type:</small>{" "}
//                         <strong>{vehicle.vehicle_type || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Number:</small>{" "}
//                         <strong>{vehicle.vehicle_number || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Model:</small>{" "}
//                         <strong>{vehicle.vehicle_model || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Color:</small>{" "}
//                         <strong>{vehicle.vehicle_color || "—"}</strong>
//                       </div>
//                     </div>

//                     {vehicle.rejection_reason && (
//                       <div
//                         style={{
//                           background: "#FEE2E2",
//                           color: "#991B1B",
//                           padding: 8,
//                           borderRadius: 6,
//                           fontSize: 12,
//                           marginTop: 10,
//                         }}
//                       >
//                         <strong>Rejection reason:</strong>{" "}
//                         {vehicle.rejection_reason}
//                       </div>
//                     )}

//                     <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//                       <button
//                         onClick={() => openRejectModal(driver.driver_id, "vehicle")}
//                         disabled={actionLoading}
//                         style={{
//                           flex: 1,
//                           height: 38,
//                           borderRadius: 8,
//                           border: "1.5px solid #EF4444",
//                           background: "#FFF",
//                           color: "#EF4444",
//                           fontWeight: "600",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Reject
//                       </button>
//                       <button
//                         onClick={() => approveSection(driver.driver_id, "vehicle")}
//                         disabled={actionLoading || vehicle.is_verified}
//                         style={{
//                           flex: 1,
//                           height: 38,
//                           borderRadius: 8,
//                           border: "none",
//                           background: vehicle.is_verified ? "#D1D5DB" : "#22C55E",
//                           color: "#FFF",
//                           fontWeight: "600",
//                           cursor: vehicle.is_verified ? "not-allowed" : "pointer",
//                         }}
//                       >
//                         {vehicle.is_verified ? "Already Verified" : "Approve"}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={{ color: "#9CA3AF", fontSize: 13 }}>
//                     No vehicle details submitted
//                   </p>
//                 )}

//                 {/* BANK */}
//                 <div className="documents-section-title" style={{ marginTop: 20 }}>
//                   <h3>
//                     <CreditCard size={18} style={{ display: "inline", marginRight: 6 }} />
//                     Bank Account
//                   </h3>
//                   <StatusPill status={getBankStatus()} />
//                 </div>

//                 {bank ? (
//                   <div
//                     style={{
//                       border: "1px solid #E5E7EB",
//                       borderRadius: 12,
//                       padding: 14,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: 10,
//                         fontSize: 13,
//                       }}
//                     >
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Holder:</small>{" "}
//                         <strong>{bank.account_holder_name || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Bank:</small>{" "}
//                         <strong>{bank.bank_name || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>Account:</small>{" "}
//                         <strong>{bank.account_number || "—"}</strong>
//                       </div>
//                       <div>
//                         <small style={{ color: "#6B7280" }}>IFSC:</small>{" "}
//                         <strong>{bank.ifsc_code || "—"}</strong>
//                       </div>
//                     </div>

//                     {bank.rejection_reason && (
//                       <div
//                         style={{
//                           background: "#FEE2E2",
//                           color: "#991B1B",
//                           padding: 8,
//                           borderRadius: 6,
//                           fontSize: 12,
//                           marginTop: 10,
//                         }}
//                       >
//                         <strong>Rejection reason:</strong>{" "}
//                         {bank.rejection_reason}
//                       </div>
//                     )}

//                     <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//                       <button
//                         onClick={() => openRejectModal(driver.driver_id, "bank")}
//                         disabled={actionLoading}
//                         style={{
//                           flex: 1,
//                           height: 38,
//                           borderRadius: 8,
//                           border: "1.5px solid #EF4444",
//                           background: "#FFF",
//                           color: "#EF4444",
//                           fontWeight: "600",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Reject
//                       </button>
//                       <button
//                         onClick={() => approveSection(driver.driver_id, "bank")}
//                         disabled={
//                           actionLoading || bank.verification_status === "APPROVED"
//                         }
//                         style={{
//                           flex: 1,
//                           height: 38,
//                           borderRadius: 8,
//                           border: "none",
//                           background:
//                             bank.verification_status === "APPROVED"
//                               ? "#D1D5DB"
//                               : "#22C55E",
//                           color: "#FFF",
//                           fontWeight: "600",
//                           cursor:
//                             bank.verification_status === "APPROVED"
//                               ? "not-allowed"
//                               : "pointer",
//                         }}
//                       >
//                         {bank.verification_status === "APPROVED"
//                           ? "Already Verified"
//                           : "Approve"}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={{ color: "#9CA3AF", fontSize: 13 }}>
//                     No bank details submitted
//                   </p>
//                 )}

//                 {/* DOCUMENTS */}
//                 <div className="documents-section-title" style={{ marginTop: 20 }}>
//                   <h3>
//                     <FileText size={18} style={{ display: "inline", marginRight: 6 }} />
//                     Uploaded Documents ({documentList.filter((d) => d.url).length}/{documentList.length})
//                   </h3>
//                 </div>

//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 10,
//                     marginBottom: 20,
//                   }}
//                 >
//                   {documentList.map((doc) => {
//                     const docStatus = doc.status || (doc.url ? "PENDING" : "PENDING");
                    
//                     return (
//                       <div
//                         key={doc.key}
//                         style={{
//                           border: "1px solid #E5E7EB",
//                           borderRadius: 10,
//                           padding: 10,
//                           background: "#FFF",
//                         }}
//                       >
//                         <div style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: 8,
//                         }}>
//                           <p style={{ fontSize: 12, fontWeight: "700", color: "#374151", margin: 0 }}>
//                             {doc.label}
//                           </p>
//                           <StatusPill status={docStatus} />
//                         </div>

//                         {doc.url ? (
//                           doc.url.toLowerCase().endsWith(".pdf") ? (
//                             <a
//                               href={doc.url} target="_blank" rel="noopener noreferrer"
//                               style={{
//                                 display: "flex", alignItems: "center", justifyContent: "center",
//                                 height: 100, background: "#EFF6FF", color: "#2563EB",
//                                 borderRadius: 6, fontSize: 12, fontWeight: "600", textDecoration: "none",
//                               }}
//                             >
//                               📄 Open PDF
//                             </a>
//                           ) : (
//                             <img
//                               src={doc.url} alt={doc.label}
//                               style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
//                               onClick={() => setPreviewDocument({ driverId: driver.driver_id, document: doc })}
//                             />
//                           )
//                         ) : (
//                           <div style={{
//                             height: 100, background: "#F3F4F6", borderRadius: 6,
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             color: "#9CA3AF", fontSize: 11,
//                           }}>
//                             Not uploaded
//                           </div>
//                         )}

//                         {doc.reason && (
//                           <div style={{
//                             background: "#FEE2E2", color: "#991B1B", padding: 6,
//                             borderRadius: 6, fontSize: 11, marginTop: 6,
//                           }}>
//                             <strong>Reason:</strong> {doc.reason}
//                           </div>
//                         )}

//                         {doc.url && (
//                           <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
//                             <button
//                               onClick={() => openRejectDocumentModal(driver.driver_id, doc.key, doc.label)}
//                               disabled={actionLoading}
//                               style={{
//                                 flex: 1, height: 30, borderRadius: 6, border: "1.5px solid #EF4444",
//                                 background: "#FFF", color: "#EF4444", fontWeight: "600", fontSize: 11, cursor: "pointer",
//                               }}
//                             >
//                               Reject
//                             </button>
//                             <button
//                               onClick={() => approveDocument(driver.driver_id, doc.key)}
//                               disabled={actionLoading || docStatus === "VERIFIED"}
//                               style={{
//                                 flex: 1, height: 30, borderRadius: 6, border: "none",
//                                 background: docStatus === "VERIFIED" ? "#D1D5DB" : "#22C55E",
//                                 color: "#FFF", fontWeight: "600", fontSize: 11,
//                                 cursor: docStatus === "VERIFIED" ? "not-allowed" : "pointer",
//                               }}
//                             >
//                               {docStatus === "VERIFIED" ? "Approved" : "Approve"}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </aside>
//         )}
//       </div>

//       {/* DOCUMENT PREVIEW MODAL */}
//       {previewDocument && (
//         <div
//           className="documents-modal-backdrop"
//           onClick={() => setPreviewDocument(null)}
//         >
//           <section
//             className="documents-review-modal"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 700 }}
//           >
//             <div className="documents-modal-header">
//               <div>
//                 <span>DOCUMENT PREVIEW</span>
//                 <h2>{previewDocument.document.label}</h2>
//               </div>
//               <button onClick={() => setPreviewDocument(null)}>
//                 <X size={19} />
//               </button>
//             </div>

//             <div style={{ padding: 16 }}>
//               {previewDocument.document.url ? (
//                 previewDocument.document.url.toLowerCase().endsWith(".pdf") ? (
//                   <a
//                     href={previewDocument.document.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ display: "block", textAlign: "center", padding: 20, color: "#2563EB" }}
//                   >
//                     📄 Open PDF in new tab
//                   </a>
//                 ) : (
//                   <img
//                     src={previewDocument.document.url}
//                     alt={previewDocument.document.label}
//                     style={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain", display: "block", margin: "0 auto" }}
//                   />
//                 )
//               ) : (
//                 <div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>
//                   <FileText size={52} style={{ margin: "0 auto 12px" }} />
//                   <p>No file uploaded</p>
//                 </div>
//               )}
//             </div>

//             <div className="documents-modal-actions">
//               <button
//                 type="button"
//                 className="documents-modal-secondary"
//                 onClick={() => setPreviewDocument(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </section>
//         </div>
//       )}

//       {/* REJECT MODAL */}
//       {rejectModal && (
//         <div
//           className="documents-modal-backdrop"
//           onClick={() => !actionLoading && setRejectModal(null)}
//         >
//           <section
//             className="documents-review-modal"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 500 }}
//           >
//             <div className="documents-modal-header">
//               <div>
//                 <span>REJECT REASON</span>
//                 <h2>
//                   Reject{" "}
//                   {rejectModal.isDocument
//                     ? rejectModal.documentLabel
//                     : rejectModal.section === "vehicle"
//                     ? "Vehicle"
//                     : "Bank"}
//                 </h2>
//               </div>
//               <button
//                 onClick={() => !actionLoading && setRejectModal(null)}
//                 disabled={actionLoading}
//               >
//                 <X size={19} />
//               </button>
//             </div>

//             <div style={{ padding: "0 0 16px 0" }}>
//               <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
//                 Select a reason. The driver will see this reason in their app.
//               </p>

//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {rejectModal.presets.map((preset) => (
//                   <label
//                     key={preset}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       padding: 10,
//                       border: "1px solid #E5E7EB",
//                       borderRadius: 8,
//                       cursor: "pointer",
//                       fontSize: 13,
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       name="rejectReason"
//                       value={preset}
//                       checked={rejectPresetReason === preset}
//                       onChange={(e) => setRejectPresetReason(e.target.value)}
//                     />
//                     <span>{preset}</span>
//                   </label>
//                 ))}

//                 {rejectPresetReason === "Other (enter custom reason)" && (
//                   <textarea
//                     value={rejectCustomReason}
//                     onChange={(e) => setRejectCustomReason(e.target.value)}
//                     placeholder="Enter custom rejection reason (min 5 characters)"
//                     rows={3}
//                     style={{
//                       padding: 10,
//                       border: "1px solid #E5E7EB",
//                       borderRadius: 8,
//                       fontSize: 13,
//                       resize: "vertical",
//                     }}
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="documents-modal-actions">
//               <button
//                 type="button"
//                 className="documents-modal-secondary"
//                 disabled={actionLoading}
//                 onClick={() => !actionLoading && setRejectModal(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="documents-modal-approve"
//                 disabled={
//                   actionLoading ||
//                   !rejectPresetReason ||
//                   (rejectPresetReason === "Other (enter custom reason)" &&
//                     rejectCustomReason.trim().length < 5)
//                 }
//                 onClick={submitReject}
//                 style={{ background: "#EF4444" }}
//               >
//                 {actionLoading ? "Rejecting…" : "Confirm Reject"}
//               </button>
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DriverDocumentsPage;










































import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, FileText, CheckCircle2, Clock3, XCircle, UserRound, CarFront,
  CreditCard, MapPin, IdCard, Eye, RotateCcw, ShieldCheck, CalendarDays,
  X, Loader2, AlertCircle,
} from "lucide-react";

import { adminApi } from "../services/api";
import "../styles/DriverDocumentsPage.css";

// =====================================================
// TOKEN HELPER
// =====================================================
function getAdminToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("adminToken") ||
    null
  );
}

const TAB_TO_API = {
  "All Drivers": "ALL",
  Verified: "VERIFIED",
  Pending: "PENDING",
  Rejected: "REJECTED",
};

const STATUS_TO_DISPLAY = {
  VERIFIED: "Verified",
  PENDING: "Pending",
  REJECTED: "Rejected",
  APPROVED: "Verified",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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
  const [drivers, setDrivers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [activeTab, setActiveTab] = useState("All Drivers");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [previewDocument, setPreviewDocument] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---------------------------------------------------
  // LOAD LIST
  // ---------------------------------------------------
  const loadList = useCallback(async (tab) => {
    const token = getAdminToken();
    if (!token) {
      setError("Not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getDocumentsList(token, {
        filter: TAB_TO_API[tab] || "ALL",
      });

      if (res?.success) {
        setDrivers(res.data || []);
        if (res.data?.length > 0 && !selectedId) {
          setSelectedId(res.data[0].driver_id);
        }
      } else {
        setError(res?.message || "Failed to load list");
        setDrivers([]);
      }
    } catch (e) {
      console.error("loadList error:", e.message);
      setError(e.message || "Unable to load drivers");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  // ---------------------------------------------------
  // LOAD DETAIL
  // ---------------------------------------------------
  const loadDetail = useCallback(async (driverId) => {
    const token = getAdminToken();
    if (!token || !driverId) return;

    setLoadingDetail(true);
    try {
      const res = await adminApi.getDriverDocuments(token, driverId);
      if (res?.success) {
        setSelectedDetail(res.data);
      } else {
        setSelectedDetail(null);
      }
    } catch (e) {
      console.error("loadDetail error:", e.message);
      setSelectedDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // ---------------------------------------------------
  // INITIAL + TAB CHANGE
  // ---------------------------------------------------
  useEffect(() => {
    loadList(activeTab);
  }, [activeTab, loadList]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  // ---------------------------------------------------
  // COUNTS
  // ---------------------------------------------------
  const counts = {
    "All Drivers": drivers.length,
    Verified: drivers.filter((d) => d.status === "VERIFIED").length,
    Pending: drivers.filter((d) => d.status === "PENDING").length,
    Rejected: drivers.filter((d) => d.status === "REJECTED").length,
  };

  // ---------------------------------------------------
  // FILTER (client-side within loaded tab)
  // ---------------------------------------------------
  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return drivers;
    return drivers.filter(
      (d) =>
        d.name?.toLowerCase().includes(query) ||
        d.phone?.toLowerCase().includes(query) ||
        String(d.driver_id).includes(query)
    );
  }, [drivers, search]);

  // ---------------------------------------------------
  // UPDATE DOCUMENT STATUS
  // ---------------------------------------------------
  const updateDocumentStatus = async (driverId, documentKey, newStatus, reason) => {
    const token = getAdminToken();
    if (!token) return setError("Not authenticated");

    setActionLoading(true);
    try {
      const res = await adminApi.updateDocumentStatus(
        token, driverId, documentKey, newStatus, reason
      );
      if (res?.success) {
        setMessage(`${documentKey} marked as ${newStatus.toLowerCase()}.`);
        setPreviewDocument(null);
        await Promise.all([loadList(activeTab), loadDetail(driverId)]);
      } else {
        setMessage(res?.message || "Update failed");
      }
    } catch (e) {
      console.error("updateDocumentStatus error:", e.message);
      setMessage(e.message || "Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (driverId, documentKey) => {
    const reason = window.prompt("Enter rejection reason (min 5 characters):");
    if (!reason || reason.trim().length < 5) {
      setMessage("Rejection reason must be at least 5 characters.");
      return;
    }
    updateDocumentStatus(driverId, documentKey, "REJECTED", reason.trim());
  };

  const handleApprove = (driverId, documentKey) => {
    updateDocumentStatus(driverId, documentKey, "VERIFIED", null);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setActiveTab("All Drivers");
    setMessage("");
    setError("");
  };

  const selectedDriver = selectedDetail?.driver || null;
  const documents = selectedDetail?.documents || [];
  const docCounts = selectedDetail?.counts || { total: 0, verified: 0, pending: 0, rejected: 0 };

  // =====================================================
  // RENDER
  // =====================================================
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

      {/* STATS */}
      <div className="documents-stats">
        <article className="documents-stat-card">
          <div className="documents-stat-icon yellow"><FileText size={20} /></div>
          <div>
            <span>Total Documents</span>
            <strong>{drivers.length * 8}</strong>
            <small>Across all listed drivers</small>
          </div>
        </article>
        <article className="documents-stat-card">
          <div className="documents-stat-icon green"><CheckCircle2 size={20} /></div>
          <div>
            <span>Verified Documents</span>
            <strong>{counts.Verified * 8}</strong>
            <small>Approved drivers</small>
          </div>
        </article>
        <article className="documents-stat-card">
          <div className="documents-stat-icon amber"><Clock3 size={20} /></div>
          <div>
            <span>Pending Documents</span>
            <strong>{counts.Pending * 8}</strong>
            <small>Waiting for review</small>
          </div>
        </article>
        <article className="documents-stat-card">
          <div className="documents-stat-icon red"><XCircle size={20} /></div>
          <div>
            <span>Rejected Documents</span>
            <strong>{counts.Rejected * 8}</strong>
            <small>Require attention</small>
          </div>
        </article>
      </div>

      <div className="documents-main-layout">
        {/* LEFT — LIST */}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by driver name, phone or ID..."
              />
            </label>
            <button
              type="button"
              className="documents-reset-button"
              onClick={resetFilters}
              title="Reset filters"
            >
              <RotateCcw size={15} /> <span>Reset</span>
            </button>
          </div>

          {message && (
            <div className="documents-message" role="status">
              <CheckCircle2 size={16} /> {message}
              <button onClick={() => setMessage("")}><X size={15} /></button>
            </div>
          )}

          {error && (
            <div className="documents-message" style={{ background: "#FEE2E2", color: "#991B1B" }}>
              <AlertCircle size={16} /> {error}
              <button onClick={() => setError("")}><X size={15} /></button>
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
                {loading ? (
                  <>
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 30 }}>
                        <Loader2 size={27} className="documents-spin" />
                        <strong>Loading…</strong>
                      </td>
                    </tr>
                  </>
                ) : filteredDrivers.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="documents-empty">
                      <FileText size={27} />
                      <strong>No matching drivers</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td></tr>
                ) : (
                  filteredDrivers.map((driver, index) => {
                    const displayStatus = STATUS_TO_DISPLAY[driver.status] || driver.status;
                    return (
                      <tr
                        key={driver.driver_id}
                        className={selectedId === driver.driver_id ? "selected" : ""}
                        onClick={() => setSelectedId(driver.driver_id)}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <button
                            type="button"
                            className="documents-driver-cell"
                            onClick={(e) => { e.stopPropagation(); setSelectedId(driver.driver_id); }}
                          >
                            <span className="documents-driver-avatar"><UserRound size={18} /></span>
                            <span>
                              <strong>{driver.name}</strong>
                              <small>#{driver.driver_id}</small>
                            </span>
                          </button>
                        </td>
                        <td>{driver.phone}</td>
                        <td>
                          <strong>{driver.documents_submitted || "0/8"}</strong>
                        </td>
                        <td>
                          <span className={`documents-status ${displayStatus.toLowerCase()}`}>
                            {displayStatus === "Verified" && <CheckCircle2 size={13} />}
                            {displayStatus === "Pending" && <Clock3 size={13} />}
                            {displayStatus === "Rejected" && <XCircle size={13} />}
                            {displayStatus}
                          </span>
                        </td>
                        <td>
                          <div className="documents-row-actions">
                            <button
                              type="button"
                              className="documents-view-button"
                              onClick={(e) => { e.stopPropagation(); setSelectedId(driver.driver_id); }}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="documents-table-footer">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </div>
        </section>

        {/* RIGHT — PROFILE + DOCUMENTS */}
        {selectedDriver && (
          <aside className="documents-profile-panel">
            <div className="documents-profile-heading">
              <div>
                <h2>Driver Profile & Documents</h2>
                <p>Review submitted credentials</p>
              </div>
            </div>

            <div className="documents-driver-summary">
              <div className="documents-profile-person">
                <div className="documents-large-avatar"><UserRound size={30} /></div>
                <div className="documents-profile-name">
                  <h3>{selectedDriver.name}</h3>
                  <p>{selectedDriver.phone}</p>
                </div>
                <span className={`documents-status ${(STATUS_TO_DISPLAY[selectedDriver.overall_status] || "Pending").toLowerCase()}`}>
                  {STATUS_TO_DISPLAY[selectedDriver.overall_status] || "Pending"}
                </span>
              </div>

              <div className="documents-driver-details">
                <div><FileText size={15} /><span><small>Driver ID</small><strong>#{selectedDriver.driver_id}</strong></span></div>
                <div><CalendarDays size={15} /><span><small>Applied On</small><strong>{formatDate(selectedDriver.applied_on)}</strong></span></div>
              </div>
            </div>

            <div className="documents-section-title">
              <h3>Documents</h3>
              <span>{docCounts.verified}/{docCounts.total} Verified</span>
            </div>

            <div className="documents-card-grid">
              {loadingDetail ? (
                <div style={{ padding: 30, textAlign: "center" }}>
                  <Loader2 size={27} className="documents-spin" />
                </div>
              ) : (
                documents.map((doc) => {
                  console.log("docdocdocdocdoc",doc);
                  
                  const displayStatus = STATUS_TO_DISPLAY[doc.status] || "Pending";
                  return (
                    <article className="individual-document-card" key={doc.key}>
                      <div className="individual-document-heading">
                        <span className="individual-document-icon">{documentIcon(doc.type)}</span>
                        <strong>{doc.name}</strong>
                      </div>

                      <span className={`documents-status ${displayStatus.toLowerCase()}`}>
                        {displayStatus === "Verified" && <CheckCircle2 size={12} />}
                        {displayStatus === "Pending" && <Clock3 size={12} />}
                        {displayStatus === "Rejected" && <XCircle size={12} />}
                        {displayStatus}
                      </span>

                      <div className="document-placeholder">
                        {doc.url ? (
                          doc.url.toLowerCase().endsWith(".pdf") ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB" }}>
                              📄 Open PDF
                            </a>
                          ) : (
                            <img src={doc.url} alt={doc.name} style={{ maxWidth: "100%", maxHeight: 140, objectFit: "contain" }} />
                          )
                        ) : (
                          <>
                            <FileText size={29} />
                            <span>Not uploaded</span>
                          </>
                        )}
                      </div>

                      {doc.reason && (
                        <div style={{ background: "#FEE2E2", color: "#991B1B", padding: 6, borderRadius: 6, fontSize: 12, marginBottom: 6 }}>
                          Reason: {doc.reason}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="document-preview-button"
                          onClick={() => setPreviewDocument({ driverId: selectedDetail.driver.driver_id, document: doc })}
                        >
                          <Eye size={13} /> Preview
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </aside>
        )}
      </div>

      {/* MODAL */}
      {previewDocument && (
        <div className="documents-modal-backdrop" onClick={() => setPreviewDocument(null)}>
          <section className="documents-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="documents-modal-header">
              <div>
                <span>DOCUMENT REVIEW</span>
                <h2>{previewDocument.document.name}</h2>
              </div>
              <button onClick={() => setPreviewDocument(null)}><X size={19} /></button>
            </div>

            <div className="documents-modal-preview">
              {previewDocument.document.url ? (
                previewDocument.document.url.toLowerCase().endsWith(".pdf") ? (
                  <a href={previewDocument.document.url} target="_blank" rel="noopener noreferrer">
                    📄 Open PDF in new tab
                  </a>
                ) : (
                  <img
                    src={previewDocument.document.url}
                    alt={previewDocument.document.name}
                    style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}
                  />
                )
              ) : (
                <>
                  <FileText size={52} />
                  <strong>{previewDocument.document.name}</strong>
                  <span>No file uploaded</span>
                </>
              )}
            </div>

            <div className="documents-modal-actions">
              <button
                type="button"
                className="documents-modal-secondary"
                disabled={actionLoading}
                onClick={() => handleReject(previewDocument.driverId, previewDocument.document.key)}
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                type="button"
                className="documents-modal-approve"
                disabled={actionLoading}
                onClick={() => handleApprove(previewDocument.driverId, previewDocument.document.key)}
              >
                <CheckCircle2 size={16} /> Mark Verified
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default DriverDocumentsPage;
