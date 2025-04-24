
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Link, Navigate, useLocation as useReactRouterLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3001";

function Header() {
  const location = useReactRouterLocation();
  if (location.pathname === "/") return null;
  return (
    <div className="header">
      <Link to="/" className="home-button">Home</Link>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function Registration({ role }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(`${API_URL}/register`, { ...formData, role });
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <Header />
      <form className="form" onSubmit={handleSubmit}>
        <h2>{role === "admin" ? "Admin" : "Customer"} Registration</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </>
  );
}

function EmailVerification() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/verify`, { email, code });
      alert("Email verified successfully");
      navigate("/");
    } catch (err) {
      setError("Invalid verification code");
    }
  };

  return (
    <>
      <Header />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Email Verification</h2>
        <input placeholder="Verification Code" onChange={(e) => setCode(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </>
  );
}

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin-login`, formData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      alert("Admin login successful");
      navigate("/admin-welcome");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

function CustomerLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/customer-login`, formData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "customer");
      alert("Customer login successful");
      navigate("/customer-welcome");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

function CustomerWelcome() {
  const role = localStorage.getItem("userRole");
  return role === "customer" ? (
    <ProtectedRoute>
      <Header />
      <div className="dashboard">
        <h2>Customer Welcome Page</h2>
        <p>Hello Customer! You've successfully logged in.</p>
      </div>
    </ProtectedRoute>
  ) : <Navigate to="/" replace />;
}

function AdminWelcome() {
  const role = localStorage.getItem("userRole");
  return role === "admin" ? (
    <ProtectedRoute>
      <Header />
      <div className="dashboard">
        <h2>Admin Welcome Page</h2>
        <p>Hello Admin! You've successfully logged in.</p>
      </div>
    </ProtectedRoute>
  ) : <Navigate to="/" replace />;
}

function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to the Auth System</h1>
      <div className="home-buttons">
        <Link to="/register-customer" className="home-button">Customer Registration</Link>
        <Link to="/register-admin" className="home-button">Admin Registration</Link>
        <Link to="/admin-login" className="home-button">Admin Login</Link>
        <Link to="/customer-login" className="home-button">Customer Login</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-customer" element={<Registration role="customer" />} />
        <Route path="/register-admin" element={<Registration role="admin" />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-welcome" element={<CustomerWelcome />} />
        <Route path="/admin-welcome" element={<AdminWelcome />} />
      </Routes>
    </Router>
  );
}
