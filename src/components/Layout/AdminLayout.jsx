
// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// import Sidebar from "../Sidebar/Sidebar";
// import Topbar from "../Topbar/Topbar";

// import "../../styles/AdminLayout.css";

// function AdminLayout() {
//   const isAuthenticated =
//     sessionStorage.getItem("adminAuthenticated") === "true";

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <Sidebar />

//       <div className="admin-main">
//         <Topbar />

//         <main className="admin-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;




import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

import "../../styles/AdminLayout.css";

function AdminLayout() {
  const isAuthenticated =
    sessionStorage.getItem("adminAuthenticated") === "true" ||
    localStorage.getItem("adminAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
