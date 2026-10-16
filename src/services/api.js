
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/general"
).replace(/\/+$/, "");

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
