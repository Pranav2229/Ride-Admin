
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://ride-api-jgh7.onrender.com/api/general"
).replace(/\/+$/, "");

// const API_BASE_URL = (
//   import.meta.env.VITE_API_BASE_URL ||
//   "/api/general"
// ).replace(/\/+$/, "");

export async function apiRequest(
  endpoint,
  { method = "GET", body, token, headers = {} } = {}
) {
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  const response = await fetch(`${API_BASE_URL}/${cleanEndpoint}`, {
    method,
    headers: {
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.message || data.error
        : data;

    throw new Error(message || `API request failed (${response.status})`);
  }

  return data;
}


export const userApi = {
  login: (credentials) =>
    apiRequest("user/login_user", {
      method: "POST",
      body: credentials,
    }),

  register: (userData) =>
    apiRequest("user/register_user", {
      method: "POST",
      body: userData,
    }),

  updateProfile: (profile, token) =>
    apiRequest("user/update_user_profile", {
      method: "PUT",
      body: profile,
      token,
    }),

  getMyRides: (token) =>
    apiRequest("user/get_user_rides", { token }),
};

export const driverApi = {
  login: (credentials) =>
    apiRequest("driver/login_driver", {
      method: "POST",
      body: credentials,
    }),

  getOnboardingStatus: (token) =>
    apiRequest("driver/onboarding_status", { token }),

  getStatus: (token) =>
    apiRequest("driver/status", { token }),

  getDocuments: (token) =>
    apiRequest("driver/document_status", { token }),

  getVehicleDetails: (token) =>
    apiRequest("driver/vehicle_details", { token }),

  getEarnings: (token) =>
    apiRequest("driver/get_driver_arnings", { token }),

  getRides: (token) =>
    apiRequest("driver/get_driver_rides", { token }),

  getWallet: (token) =>
    apiRequest("driver/get_driver_wallet", { token }),
};


export const liveRideApi = {
  getNearbyDrivers: (latitude, longitude, radius_km) =>
    apiRequest("user/nearby_drivers", {
      method: "POST",
      body: {
        latitude: String(latitude),
        longitude: String(longitude),
        radius_km: String(radius_km),
      },
    }),
};

// // ✅ Admin API added for Admin Panel pages
// export const adminApi = {
//   getAllUsers: (token) =>
//     apiRequest("admin/get_all_users", { token }),

//   getAllDrivers: (token) =>
//     apiRequest("admin/get_all_drivers", { token }),

//   getDriverDocuments: (token) =>
//     apiRequest("admin/driver_documents", { token }),

//   getDriverStatus: (token) =>
//     apiRequest("admin/drivers_status", { token }),
// };



// export const adminApi = {
//   // Admin Login
//   login: (credentials) =>
//     apiRequest("admin/login", {
//       method: "POST",
//       body: credentials,
//     }),

//   // Admin Dashboard Overview
//   getDashboardOverview: (token) =>
//     apiRequest("admin/dashboard/overview", {
//       method: "GET",
//       token,
//     }),
// };

export const adminApi = {
  // =====================================================
  // AUTH
  // =====================================================
  login: (credentials) =>
    apiRequest("admin/login", {
      method: "POST",
      body: credentials,
    }),

  // =====================================================
  // DASHBOARD
  // =====================================================
  getDashboardOverview: (token, days = 7) =>
    apiRequest(`admin/dashboard/overview?days=${days}`, {
      method: "GET",
      token,
    }),

  // =====================================================
  // DRIVER KYC
  // =====================================================
  getKycStats: (token) =>
    apiRequest("admin/drivers/kyc-stats", {
      method: "GET",
      token,
    }),

  getKycList: (token, { status = "PENDING", search = "", limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams({
      status,
      limit: String(limit),
      offset: String(offset),
    });
    if (search) params.set("search", search);
    return apiRequest(`admin/drivers/kyc-list?${params.toString()}`, {
      method: "GET",
      token,
    });
  },

  getKycDetail: (token, driverId) =>
    apiRequest(`admin/drivers/${driverId}/kyc`, {
      method: "GET",
      token,
    }),

  approveKyc: (token, driverId) =>
    apiRequest(`admin/drivers/${driverId}/kyc/approve`, {
      method: "POST",
      token,
    }),

  rejectKyc: (token, driverId, reason) =>
    apiRequest(`admin/drivers/${driverId}/kyc/reject`, {
      method: "POST",
      token,
      body: { reason },
    }),

  updateKycSection: (token, driverId, section, status, reason) =>
    apiRequest(`admin/drivers/${driverId}/kyc/section/${section}/status`, {
      method: "POST",
      token,
      body: { status, reason },
    }),

  // Inside adminApi, after the KYC block:

  getDocumentsList: (token, { filter = "ALL", search = "" } = {}) => {
    const params = new URLSearchParams({ filter });
    if (search) params.set("search", search);
    return apiRequest(`admin/drivers/documents-list?${params.toString()}`, { token });
  },

  getDriverDocuments: (token, driverId) =>
    apiRequest(`admin/drivers/${driverId}/documents`, { token }),

  updateDocumentStatus: (token, driverId, documentKey, status, reason) =>
    apiRequest(`admin/drivers/${driverId}/documents/${documentKey}/status`, {
      method: "POST",
      token,
      body: { status, reason },
    }),

  getCustomers: (token, { search = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    return apiRequest(`admin/customers?${params.toString()}`, { token });
  },

  toggleCustomerBlock: (token, customerId, isBlocked) =>
    apiRequest(`admin/customers/${customerId}/block`, {
      method: "POST",
      token,
      body: { is_blocked: isBlocked },
    }),
    getDrivers: (token, { search = "" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  return apiRequest(`admin/drivers?${params.toString()}`, { token });
},
};

