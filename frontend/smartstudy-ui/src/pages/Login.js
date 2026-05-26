//import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
//import { login } from "../services/authService";
//
//const Login = () => {
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [message, setMessage] = useState("");
//
//  const navigate = useNavigate();
//
//  const handleLogin = async (e) => {
//    e.preventDefault();
//    try {
//      await login(email, password);
//      navigate("/dashboard");
//    } catch (err) {
//      setMessage("Invalid credentials ❌");
//    }
//  };
//
//  return (
//    <div style={{ width: "300px", margin: "100px auto" }}>
//      <h2>Login</h2>
//
//      <form onSubmit={handleLogin}>
//        <input
//          type="email"
//          placeholder="Email"
//          value={email}
//          onChange={(e) => setEmail(e.target.value)}
//          required
//        />
//        <br /><br />
//
//        <input
//          type="password"
//          placeholder="Password"
//          value={password}
//          onChange={(e) => setPassword(e.target.value)}
//          required
//        />
//        <br /><br />
//
//        <button type="submit">Login</button>
//      </form>
//
//      <p style={{ color: "red" }}>{message}</p>
//
//      <hr />
//
//      {/* 🔥 THIS WAS MISSING */}
//      <button onClick={() => navigate("/register")}>
//        New user? Register
//      </button>
//    </div>
//  );
//};
//
//export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      setMessage("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>

        <h2 style={title}>Welcome Back 👋</h2>
        <p style={subtitle}>Login to continue</p>

        <form onSubmit={handleLogin} style={form}>

          {/* Email */}
          <div style={inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={input}
            />
            <label style={label}>Email</label>
          </div>

          {/* Password */}
          <div style={inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={input}
            />
            <label style={label}>Password</label>

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={eye}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Error */}
          {message && <p style={error}>{message}</p>}

          {/* Button */}
          <button
            type="submit"
            style={{
              ...btn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div style={footer}>
          <span>New user?</span>
          <button onClick={() => navigate("/register")} style={linkBtn}>
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;



// ================= STYLES =================

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "15px",
  width: "320px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "center"
};

const title = {
  marginBottom: "5px"
};

const subtitle = {
  marginBottom: "20px",
  color: "#555"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const inputGroup = {
  position: "relative"
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none"
};

const label = {
  position: "absolute",
  top: "-8px",
  left: "10px",
  fontSize: "12px",
  background: "white",
  padding: "0 5px",
  color: "#666"
};

const eye = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer"
};

const btn = {
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold"
};

const error = {
  color: "red",
  fontSize: "14px"
};

const footer = {
  marginTop: "15px",
  display: "flex",
  justifyContent: "center",
  gap: "5px"
};

const linkBtn = {
  border: "none",
  background: "none",
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: "bold"
};