
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   Mail,
//   LockKeyhole,
//   MapPin,
//   ShieldCheck,
//   CarFront,
// } from "lucide-react";

// import "../styles/AdminLogin.css";

// export default function AdminLogin({ onLogin }) {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!email.trim() || !password) {
//       setError("Please enter your email address and password.");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (onLogin) {
//         // Use the provided login handler, if connected.
//         await onLogin({
//           email: email.trim(),
//           password,
//           rememberMe,
//         });
//       } else {
//         // Temporary navigation until the real login API is connected.
//         sessionStorage.setItem("adminAuthenticated", "true");
//       }

//       // Navigate to the admin dashboard after successful handler completion.
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       setError(
//         err?.message || "Login failed. Please check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="admin-login">
//       <section className="admin-login-card">
//         <div className="admin-login-brand">
//           <div className="login-brand-logo">
//             <span className="login-logo-icon">
//               <MapPin size={38} fill="currentColor" />
//               <CarFront size={19} className="login-car-icon" />
//             </span>

//             <span className="login-brand-name">
//               Ride<span>Buddy</span>
//             </span>
//           </div>

//           <div className="login-welcome">
//             <h1>
//               Welcome back,
//               <span>Admin</span>
//             </h1>

//             <p>
//               Sign in to manage rides, drivers
//               <br className="desktop-break" /> and customers.
//             </p>
//           </div>

//           <div className="login-city-art" aria-hidden="true">
//             <div className="city-glow" />

//             <div className="city-buildings">
//               <span className="building building-one" />
//               <span className="building building-two" />
//               <span className="building building-three" />
//               <span className="building building-four" />
//               <span className="building building-five" />
//               <span className="building building-six" />
//               <span className="building building-seven" />
//             </div>

//             <svg
//               className="login-route"
//               viewBox="0 0 520 260"
//               preserveAspectRatio="none"
//             >
//               <path
//                 d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
//                 fill="none"
//                 stroke="#ffbd00"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//               />

//               <path
//                 d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
//                 fill="none"
//                 stroke="#fff0a6"
//                 strokeWidth="1.5"
//                 strokeDasharray="7 9"
//               />
//             </svg>

//             <MapPin
//               className="route-pin pin-one"
//               size={30}
//               fill="#ffc400"
//             />

//             <MapPin
//               className="route-pin pin-two"
//               size={26}
//               fill="#ffc400"
//             />

//             <MapPin
//               className="route-pin pin-three"
//               size={24}
//               fill="#ffc400"
//             />

//             <CarFront className="route-car" size={30} />
//           </div>

//           <div className="brand-footer">
//             <ShieldCheck size={19} />
//             <span>Your journey, managed securely.</span>
//           </div>
//         </div>

//         <div className="admin-login-form-panel">
//           <div className="login-form-heading">
//             <h2>Admin Login</h2>
//             <p>Enter your administrator credentials to continue.</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="login-field">
//               <label htmlFor="admin-email">Email Address</label>

//               <div className="login-input-wrap">
//                 <Mail size={20} />

//                 <input
//                   id="admin-email"
//                   type="email"
//                   autoComplete="username"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="login-field">
//               <label htmlFor="admin-password">Password</label>

//               <div className="login-input-wrap">
//                 <LockKeyhole size={20} />

//                 <input
//                   id="admin-password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="password-toggle"
//                   onClick={() =>
//                     setShowPassword((value) => !value)
//                   }
//                   aria-label={
//                     showPassword ? "Hide password" : "Show password"
//                   }
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} />
//                   ) : (
//                     <Eye size={20} />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="login-options">
//               <label className="remember-option">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(event) =>
//                     setRememberMe(event.target.checked)
//                   }
//                 />

//                 <span>Remember me</span>
//               </label>

//               <button
//                 type="button"
//                 className="forgot-password"
//                 onClick={() =>
//                   setError(
//                     "Please contact your administrator to reset your password."
//                   )
//                 }
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {error && (
//               <div className="login-error" role="alert">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="login-submit"
//               disabled={loading}
//             >
//               <span>
//                 {loading ? "Signing in..." : "Sign In"}
//               </span>

//               {!loading && <ArrowRight size={21} />}
//             </button>

//             <div className="secure-login-note">
//               <ShieldCheck size={23} />
//               <span>Secure administrator access</span>
//             </div>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// }
















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   Mail,
//   LockKeyhole,
//   MapPin,
//   ShieldCheck,
//   CarFront,
// } from "lucide-react";

// import { userApi, driverApi } from "../services/api";
// import "../styles/AdminLogin.css";

// export default function AdminLogin({ onLogin }) {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("driver");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!email.trim() || !password) {
//       setError("Please enter your email address and password.");
//       return;
//     }

//     try {
//       setLoading(true);

//       let response;

//       if (onLogin) {
//         response = await onLogin({
//           email: email.trim(),
//           password,
//           rememberMe,
//           role,
//         });
//       } else {
//         const credentials = {
//           email: email.trim(),
//           password,
//         };

//         response =
//           role === "driver"
//             ? await driverApi.login(credentials)
//             : await userApi.login(credentials);
//       }

//       // Check common token fields returned by login APIs.
//       // const token =
//       //   response?.accessToken ??
//       //   response?.access_token ??
//       //   response?.token ??
//       //   response?.data?.accessToken ??
//       //   response?.data?.access_token ??
//       //   response?.data?.token;

//   //       const token =
//   // response?.accessToken ??
//   // response?.access_token ??
//   // response?.token ??
//   // response?.data?.accessToken ??
//   // response?.data?.access_token ??
//   // response?.data?.token;

//   //     if (!token) {
//   //       console.error("Login API response (check token field):", response);
//   //       throw new Error(
//   //         "Login response did not contain a recognised access token. Check the API response."
//   //       );
//   //     }

//   //     const storage = rememberMe ? localStorage : sessionStorage;

//   //     storage.setItem("accessToken", token);
//   //     storage.setItem("loginRole", role);

//   //     // Keep the current role's token available to the earnings/profile code.
//   //     // Clear any token left over from a previous role.
//   //     const otherStorage = rememberMe ? sessionStorage : localStorage;
//   //     otherStorage.removeItem("accessToken");
//   //     otherStorage.removeItem("loginRole");

//   //     navigate("/dashboard", { replace: true });

// //   const token =
// //   response?.accessToken ??
// //   response?.data?.accessToken ??
// //   response?.access_token ??
// //   response?.data?.access_token ??
// //   response?.token ??
// //   response?.data?.token;

// // if (!token) {
// //   console.error("Login response is missing an access token");
// //   throw new Error("Login successful, but access token was not found.");
// // }

// // const storage = rememberMe ? localStorage : sessionStorage;

// // storage.setItem("accessToken", token);
// // storage.setItem("loginRole", role);

// // // sessionStorage.setItem("adminAuthenticated", "true");

// // const otherStorage = rememberMe ? sessionStorage : localStorage;
// // otherStorage.removeItem("accessToken");
// // otherStorage.removeItem("loginRole");

// // console.log("Login response:", response);
// // console.log("Token received:", Boolean(token));
// // console.log("Navigating to dashboard...");

// // navigate("/dashboard", { replace: true });


// const token = response?.data?.accessToken ?? response?.accessToken;

// if (response?.success === false) {
//   throw new Error(response?.message || "Login failed.");
// }

// if (!token) {
//   console.error("Login response structure:", response);
//   throw new Error("Login response received, but access token is missing.");
// }

// const storage = rememberMe ? localStorage : sessionStorage;
// const otherStorage = rememberMe ? sessionStorage : localStorage;

// // Remove any old login information first.
// otherStorage.removeItem("accessToken");
// otherStorage.removeItem("loginRole");

// // Save the new login information.
// storage.setItem("accessToken", token);
// storage.setItem("loginRole", role);

// sessionStorage.setItem("adminAuthenticated", "true");

// console.log("Login successful:", response.success);
// console.log("Token saved:", Boolean(storage.getItem("accessToken")));
// console.log("Login role:", role);

// navigate("/dashboard", { replace: true });

//     } catch (err) {
//       setError(
//         err?.message || "Login failed. Please check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="admin-login">
//       <section className="admin-login-card">
//         <div className="admin-login-brand">
//           <div className="login-brand-logo">
//             <span className="login-logo-icon">
//               <MapPin size={38} fill="currentColor" />
//               <CarFront size={19} className="login-car-icon" />
//             </span>

//             <span className="login-brand-name">
//               Ride<span>Buddy</span>
//             </span>
//           </div>

//           <div className="login-welcome">
//             <h1>
//               Welcome back,
//               <span>{role === "driver" ? "Driver" : "User"}</span>
//             </h1>

//             <p>
//               Sign in to view your account details,
//               <br className="desktop-break" /> rides and activity.
//             </p>
//           </div>

//           <div className="login-city-art" aria-hidden="true">
//             <div className="city-glow" />

//             <div className="city-buildings">
//               <span className="building building-one" />
//               <span className="building building-two" />
//               <span className="building building-three" />
//               <span className="building building-four" />
//               <span className="building building-five" />
//               <span className="building building-six" />
//               <span className="building building-seven" />
//             </div>

//             <svg
//               className="login-route"
//               viewBox="0 0 520 260"
//               preserveAspectRatio="none"
//             >
//               <path
//                 d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
//                 fill="none"
//                 stroke="#ffbd00"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//               />

//               <path
//                 d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
//                 fill="none"
//                 stroke="#fff0a6"
//                 strokeWidth="1.5"
//                 strokeDasharray="7 9"
//               />
//             </svg>

//             <MapPin
//               className="route-pin pin-one"
//               size={30}
//               fill="#ffc400"
//             />

//             <MapPin
//               className="route-pin pin-two"
//               size={26}
//               fill="#ffc400"
//             />

//             <MapPin
//               className="route-pin pin-three"
//               size={24}
//               fill="#ffc400"
//             />

//             <CarFront className="route-car" size={30} />
//           </div>

//           <div className="brand-footer">
//             <ShieldCheck size={19} />
//             <span>Your journey, managed securely.</span>
//           </div>
//         </div>

//         <div className="admin-login-form-panel">
//           <div className="login-form-heading">
//             <h2>Ride Buddy Login</h2>
//             <p>Select your account type and enter your credentials.</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="login-field">
//               <label htmlFor="login-role">Login As</label>
//               <div className="login-input-wrap">
//                 <select
//                   id="login-role"
//                   value={role}
//                   onChange={(event) => setRole(event.target.value)}
//                   disabled={loading}
//                   style={{
//                     width: "100%",
//                     border: "none",
//                     outline: "none",
//                     background: "transparent",
//                     padding: "4px",
//                     font: "inherit",
//                   }}
//                 >
//                   <option value="driver">Driver</option>
//                   <option value="user">User</option>
//                 </select>
//               </div>
//             </div>

//             <div className="login-field">
//               <label htmlFor="admin-email">Email Address</label>

//               <div className="login-input-wrap">
//                 <Mail size={20} />

//                 <input
//                   id="admin-email"
//                   type="email"
//                   autoComplete="username"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="login-field">
//               <label htmlFor="admin-password">Password</label>

//               <div className="login-input-wrap">
//                 <LockKeyhole size={20} />

//                 <input
//                   id="admin-password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="password-toggle"
//                   onClick={() => setShowPassword((value) => !value)}
//                   aria-label={
//                     showPassword ? "Hide password" : "Show password"
//                   }
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} />
//                   ) : (
//                     <Eye size={20} />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="login-options">
//               <label className="remember-option">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(event) => setRememberMe(event.target.checked)}
//                 />

//                 <span>Remember me</span>
//               </label>

//               <button
//                 type="button"
//                 className="forgot-password"
//                 onClick={() =>
//                   setError(
//                     "Please contact your administrator to reset your password."
//                   )
//                 }
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {error && (
//               <div className="login-error" role="alert">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="login-submit"
//               disabled={loading}
//             >
//               <span>{loading ? "Signing in..." : "Sign In"}</span>
//               {!loading && <ArrowRight size={21} />}
//             </button>

//             <div className="secure-login-note">
//               <ShieldCheck size={23} />
//               <span>Secure account access</span>
//             </div>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// }






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  CarFront,
} from "lucide-react";

import { adminApi } from "../services/api";
import "../styles/AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await adminApi.login({
        email: email.trim(),
        password,
      });

      const admin = response?.data?.admin;
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;

      if (!response?.success || !accessToken) {
        throw new Error(
          response?.message || "Admin login failed."
        );
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      // Clear previous authentication information.
      otherStorage.removeItem("accessToken");
      otherStorage.removeItem("refreshToken");
      otherStorage.removeItem("adminAuthenticated");
      otherStorage.removeItem("loginRole");
      otherStorage.removeItem("adminProfile");

      // Save the current admin authentication information.
      storage.setItem("accessToken", accessToken);
      storage.setItem("adminAuthenticated", "true");
      storage.setItem("loginRole", "admin");

      if (refreshToken) {
        storage.setItem("refreshToken", refreshToken);
      }

      if (admin) {
        storage.setItem("adminProfile", JSON.stringify(admin));
      }

      console.log("Admin login successful.");
      console.log("Admin token saved:", Boolean(accessToken));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <div className="login-brand-logo">
            <span className="login-logo-icon">
              <MapPin size={38} fill="currentColor" />
              <CarFront size={19} className="login-car-icon" />
            </span>

            <span className="login-brand-name">
              Ride<span>Buddy</span>
            </span>
          </div>

          <div className="login-welcome">
            <h1>
              Welcome back,
              <span>Admin</span>
            </h1>

            <p>
              Sign in to manage rides, drivers, customers and activity.
            </p>
          </div>

          <div className="login-city-art" aria-hidden="true">
            <div className="city-glow" />

            <div className="city-buildings">
              <span className="building building-one" />
              <span className="building building-two" />
              <span className="building building-three" />
              <span className="building building-four" />
              <span className="building building-five" />
              <span className="building building-six" />
              <span className="building building-seven" />
            </div>

            <svg
              className="login-route"
              viewBox="0 0 520 260"
              preserveAspectRatio="none"
            >
              <path
                d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
                fill="none"
                stroke="#ffbd00"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <path
                d="M55 105 C120 120 55 175 135 175 S210 145 260 195 S350 185 325 145 S390 105 465 48"
                fill="none"
                stroke="#fff0a6"
                strokeWidth="1.5"
                strokeDasharray="7 9"
              />
            </svg>

            <MapPin
              className="route-pin pin-one"
              size={30}
              fill="#ffc400"
            />

            <MapPin
              className="route-pin pin-two"
              size={26}
              fill="#ffc400"
            />

            <MapPin
              className="route-pin pin-three"
              size={24}
              fill="#ffc400"
            />

            <CarFront className="route-car" size={30} />
          </div>

          <div className="brand-footer">
            <ShieldCheck size={19} />
            <span>Your journey, managed securely.</span>
          </div>
        </div>

        <div className="admin-login-form-panel">
          <div className="login-form-heading">
            <h2>Ride Buddy Login</h2>
            <p>Enter your admin credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="admin-email">Email Address</label>

              <div className="login-input-wrap">
                <Mail size={20} />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="admin-password">Password</label>

              <div className="login-input-wrap">
                <LockKeyhole size={20} />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  disabled={loading}
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setError(
                    "Please contact your administrator to reset your password."
                  )
                }
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <ArrowRight size={21} />}
            </button>

            <div className="secure-login-note">
              <ShieldCheck size={23} />
              <span>Secure account access</span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
