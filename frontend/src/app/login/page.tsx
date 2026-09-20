"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BusFront,
  ShieldCheck,
  MapPin,
  Clock3,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  Route,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Role = "student" | "driver" | "admin";
type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<Role>("student");

  const [fullName, setFullName] = useState("");
  const [boardingPoint, setBoardingPoint] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setError("");
  };

  const changeRole = (newRole: Role) => {
    setRole(newRole);
    setError("");

    if (newRole === "driver") {
      setBoardingPoint("");
    }

    if (newRole === "admin") {
      setBoardingPoint("");
      setBusNumber("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (
      mode === "signup" &&
      role === "student" &&
      !boardingPoint.trim()
    ) {
      setError("Please enter your boarding point.");
      return;
    }

    if (
      mode === "signup" &&
      role !== "admin" &&
      !busNumber.trim()
    ) {
      setError("Please enter your bus number.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Temporary frontend navigation.
    // Firebase authentication will be connected later.
    if (role === "student") {
      router.push("/dashboard/student");
    } else if (role === "driver") {
      router.push("/dashboard/driver");
    } else {
      router.push("/dashboard/admin");
    }
  };

  const roleData = {
    student: {
      title: "Student",
      description: "Track your bus & boarding",
      icon: Users,
    },
    driver: {
      title: "Driver",
      description: "Manage trips & passengers",
      icon: BusFront,
    },
    admin: {
      title: "Admin",
      description: "Monitor campus transport",
      icon: ShieldCheck,
    },
  };

  const selectedRole = roleData[role];

  return (
    <main className="login-page">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <section className="login-container">
        {/* LEFT BRANDING PANEL */}
        <div className="brand-panel">
          <div className="brand-content">
            {/* Logo */}
            <div className="brand-logo">
              <div className="logo-icon">
                <BusFront size={30} strokeWidth={2.2} />
              </div>

              <div>
                <h1>Smart Campus</h1>
                <p>TRANSPORT</p>
              </div>
            </div>

            {/* Main heading */}
            <div className="brand-heading">
              <div className="small-badge">
                <span className="live-dot" />
                SMART TRANSPORT SYSTEM
              </div>

              <h2>
                Move smarter.
                <br />
                <span>Travel safer.</span>
              </h2>

              <p>
                A connected campus transportation system designed
                to make every journey safer, smarter and easier.
              </p>
            </div>

            {/* Feature cards */}
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <strong>Live Bus Tracking</strong>
                  <span>Know where your bus is in real time</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>Verified Boarding</strong>
                  <span>Secure QR-based attendance</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Clock3 size={19} />
                </div>

                <div>
                  <strong>Smart Notifications</strong>
                  <span>Stay updated about your journey</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative route */}
          <div className="route-decoration">
            <div className="route-line" />

            <div className="route-stop stop-one">
              <span />
            </div>

            <div className="route-stop stop-two">
              <span />
            </div>

            <div className="route-stop stop-three">
              <span />
            </div>

            <div className="route-bus">
              <BusFront size={21} />
            </div>
          </div>

          <div className="brand-footer">
            <span>© 2026 Smart Campus Transport</span>
            <span className="footer-status">
              <CheckCircle2 size={13} />
              System Ready
            </span>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="form-panel">
          <div className="form-wrapper">
            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="mobile-logo">
                <BusFront size={24} />
              </div>

              <div>
                <strong>Smart Campus</strong>
                <span>Transport</span>
              </div>
            </div>

            {/* Heading */}
            <div className="form-header">
              <div className="welcome-icon">
                {mode === "signin" ? (
                  <Route size={23} />
                ) : (
                  <UserRound size={23} />
                )}
              </div>

              <div>
                <h2>
                  {mode === "signin"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>

                <p>
                  {mode === "signin"
                    ? "Sign in to continue to your dashboard."
                    : "Join the Smart Campus Transport system."}
                </p>
              </div>
            </div>

            {/* Mode switch */}
            <div className="mode-switch">
              <button
                type="button"
                className={mode === "signin" ? "active" : ""}
                onClick={() => changeMode("signin")}
              >
                Sign In
              </button>

              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => changeMode("signup")}
              >
                New User
              </button>
            </div>

            {/* Role selector */}
            <div className="role-section">
              <label className="field-label">Select your role</label>

              <div className="role-grid">
                {(Object.keys(roleData) as Role[]).map((item) => {
                  const RoleIcon = roleData[item].icon;

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`role-card ${
                        role === item ? "selected" : ""
                      }`}
                      onClick={() => changeRole(item)}
                    >
                      <div className="role-icon">
                        <RoleIcon size={20} />
                      </div>

                      <div className="role-text">
                        <strong>{roleData[item].title}</strong>
                        <span>{roleData[item].description}</span>
                      </div>

                      {role === item && (
                        <div className="role-check">
                          <CheckCircle2 size={17} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <>
                  <div className="field">
                    <label htmlFor="fullName">Full name</label>

                    <div className="input-wrapper">
                      <UserRound size={18} />

                      <input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  {role === "student" && (
                    <div className="field">
                      <label htmlFor="boardingPoint">
                        Boarding point
                      </label>

                      <div className="input-wrapper">
                        <MapPin size={18} />

                        <input
                          id="boardingPoint"
                          type="text"
                          placeholder="Enter your boarding point"
                          value={boardingPoint}
                          onChange={(e) =>
                            setBoardingPoint(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {role !== "admin" && (
                    <div className="field">
                      <label htmlFor="busNumber">Bus number</label>

                      <div className="input-wrapper">
                        <BusFront size={18} />

                        <input
                          id="busNumber"
                          type="text"
                          placeholder="Example: BUS-12"
                          value={busNumber}
                          onChange={(e) =>
                            setBusNumber(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="field">
                <label htmlFor="email">Email address</label>

                <div className="input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="password-label">
                  <label htmlFor="password">Password</label>

                  {mode === "signin" && (
                    <button
                      type="button"
                      className="forgot-button"
                      onClick={() =>
                        setError(
                          "Password recovery will be connected with Firebase."
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-box">
                  <AlertCircle size={18} />

                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="submit-button">
                <span>
                  {mode === "signin"
                    ? `Sign in as ${selectedRole.title}`
                    : `Create ${selectedRole.title} account`}
                </span>

                <ArrowRight size={19} />
              </button>
            </form>

            {/* Bottom note */}
            <div className="security-note">
              <ShieldCheck size={16} />

              <span>
                Your transport information is protected with
                secure authentication.
              </span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #f8f7fc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          position: relative;
          overflow: hidden;
          font-family: "Poppins", sans-serif;
        }

        .background-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .orb-one {
          width: 420px;
          height: 420px;
          background: rgba(108, 63, 197, 0.07);
          top: -190px;
          right: -130px;
        }

        .orb-two {
          width: 350px;
          height: 350px;
          background: rgba(108, 63, 197, 0.05);
          bottom: -170px;
          left: -150px;
        }

        .login-container {
          width: min(1120px, 100%);
          min-height: 700px;
          display: grid;
          grid-template-columns: 45% 55%;
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          z-index: 2;
          box-shadow:
            0 30px 80px rgba(45, 30, 80, 0.12),
            0 8px 24px rgba(45, 30, 80, 0.06);
          border: 1px solid rgba(108, 63, 197, 0.08);
        }

        /* LEFT */

        .brand-panel {
          position: relative;
          background: linear-gradient(
            145deg,
            #4b2a87 0%,
            #5d36a4 45%,
            #6c3fc5 100%
          );
          color: #ffffff;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .brand-panel::before {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          right: -210px;
          top: -100px;
        }

        .brand-panel::after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 50%;
          left: -180px;
          bottom: -100px;
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .logo-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
        }

        .brand-logo h1 {
          font-size: 17px;
          margin: 0;
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .brand-logo p {
          margin: 1px 0 0;
          font-size: 9px;
          letter-spacing: 2.5px;
          opacity: 0.7;
          font-weight: 600;
        }

        .brand-heading {
          margin-top: 105px;
          max-width: 410px;
        }

        .small-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.13);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.3px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          background: #86efac;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.12);
        }

        .brand-heading h2 {
          margin: 20px 0 16px;
          font-size: clamp(36px, 4vw, 48px);
          line-height: 1.1;
          letter-spacing: -1.8px;
          font-weight: 600;
        }

        .brand-heading h2 span {
          opacity: 0.72;
        }

        .brand-heading p {
          margin: 0;
          max-width: 370px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          line-height: 1.8;
        }

        .feature-list {
          margin-top: 42px;
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .feature-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.11);
        }

        .feature-item strong {
          display: block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .feature-item span {
          display: block;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
        }

        .route-decoration {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 90px;
          height: 100px;
          opacity: 0.65;
        }

        .route-line {
          position: absolute;
          left: 45px;
          right: 45px;
          top: 50px;
          height: 1px;
          border-top: 1px dashed rgba(255, 255, 255, 0.3);
        }

        .route-stop {
          position: absolute;
          top: 44px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 3px solid #a78bda;
          background: #4b2a87;
        }

        .stop-one {
          left: 45px;
        }

        .stop-two {
          left: 48%;
        }

        .stop-three {
          right: 45px;
        }

        .route-bus {
          position: absolute;
          top: 27px;
          left: 57%;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #6c3fc5;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .brand-footer {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.55);
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255, 255, 255, 0.72);
        }

        /* RIGHT */

        .form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 58px;
          background: #ffffff;
        }

        .form-wrapper {
          width: 100%;
          max-width: 480px;
        }

        .mobile-brand {
          display: none;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }

        .welcome-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: #f0e9ff;
          color: #6c3fc5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .form-header h2 {
          margin: 0;
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: -0.6px;
          font-weight: 600;
          color: #1f1f29;
        }

        .form-header p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #6b6b78;
        }

        .mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f4f2f8;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .mode-switch button {
          border: none;
          background: transparent;
          color: #777582;
          min-height: 42px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .mode-switch button.active {
          background: #ffffff;
          color: #6c3fc5;
          box-shadow: 0 3px 10px rgba(50, 35, 80, 0.08);
        }

        .role-section {
          margin-bottom: 23px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #4c4a55;
          margin-bottom: 9px;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .role-card {
          min-height: 76px;
          padding: 11px;
          border-radius: 12px;
          border: 1px solid #e5e1ef;
          background: #ffffff;
          text-align: left;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          transition: 0.2s ease;
        }

        .role-card:hover {
          border-color: #bca5e7;
          transform: translateY(-1px);
        }

        .role-card.selected {
          background: #f7f2ff;
          border-color: #6c3fc5;
          box-shadow: 0 0 0 2px rgba(108, 63, 197, 0.08);
        }

        .role-icon {
          color: #6c3fc5;
        }

        .role-text strong {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #282631;
        }

        .role-text span {
          display: block;
          font-size: 8px;
          color: #8a8793;
          line-height: 1.3;
        }

        .role-check {
          position: absolute;
          right: 8px;
          top: 8px;
          color: #6c3fc5;
        }

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #4c4a55;
          margin-bottom: 7px;
        }

        .input-wrapper {
          height: 47px;
          border: 1px solid #e2dfeb;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          gap: 10px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .input-wrapper > svg {
          color: #aaa6b4;
          flex-shrink: 0;
        }

        .input-wrapper:focus-within {
          border-color: #6c3fc5;
          box-shadow: 0 0 0 3px #f0e9ff;
        }

        .input-wrapper:focus-within > svg {
          color: #6c3fc5;
        }

        .input-wrapper input {
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          background: transparent;
          color: #1f1f29;
          font-size: 12px;
        }

        .input-wrapper input::placeholder {
          color: #aaa7b1;
        }

        .password-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 7px;
        }

        .password-label label {
          margin-bottom: 0;
        }

        .forgot-button {
          border: none;
          background: transparent;
          color: #6c3fc5;
          font-size: 10px;
          font-weight: 600;
          padding: 0;
        }

        .password-toggle {
          border: none;
          background: transparent;
          color: #9995a4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        .password-toggle:hover {
          color: #6c3fc5;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 12px;
          margin: 2px 0 15px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #b91c1c;
          border-radius: 9px;
          font-size: 10px;
          line-height: 1.4;
        }

        .error-box svg {
          flex-shrink: 0;
        }

        .submit-button {
          width: 100%;
          height: 49px;
          border: none;
          border-radius: 10px;
          background: #6c3fc5;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(108, 63, 197, 0.2);
          transition: 0.2s ease;
        }

        .submit-button:hover {
          background: #4b2a87;
          transform: translateY(-1px);
          box-shadow: 0 11px 25px rgba(108, 63, 197, 0.25);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .security-note {
          margin-top: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #918e9b;
          font-size: 9px;
          text-align: center;
          line-height: 1.5;
        }

        .security-note svg {
          color: #6c3fc5;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .login-page {
            padding: 18px;
          }

          .login-container {
            grid-template-columns: 1fr;
            max-width: 540px;
            min-height: auto;
          }

          .brand-panel {
            display: none;
          }

          .form-panel {
            padding: 36px 30px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
          }

          .mobile-logo {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #6c3fc5;
            color: #ffffff;
          }

          .mobile-brand strong {
            display: block;
            color: #2b2932;
            font-size: 14px;
          }

          .mobile-brand span {
            display: block;
            color: #6c3fc5;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }
        }

        @media (max-width: 500px) {
          .login-page {
            padding: 0;
            align-items: stretch;
          }

          .login-container {
            border-radius: 0;
            min-height: 100vh;
            box-shadow: none;
            border: none;
          }

          .form-panel {
            padding: 28px 20px;
            align-items: flex-start;
          }

          .form-wrapper {
            max-width: none;
          }

          .form-header h2 {
            font-size: 21px;
          }

          .role-grid {
            gap: 6px;
          }

          .role-card {
            padding: 9px;
          }

          .role-text span {
            display: none;
          }

          .role-card {
            min-height: 68px;
          }
        }
      `}</style>
    </main>
  );
}