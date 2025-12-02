import { useState, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
import { useLogin } from "../Context/loginContext";
import { registerAPI } from "../api/auth";
import { gethousehold_id } from "../api/pantry";
import { faX } from "@fortawesome/free-solid-svg-icons";

export const Sign_up = () => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { login, isAuthenticated } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    if (password !== cpassword) {
      setError("Passwords do not match!");
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      const user_type_id = 1;
      const response = await registerAPI(email, password, name, user_type_id);

      if (response.status === "success" && response.payload) {
        // Extract user data (without token) and token separately
        const { token, ...userData } = response.payload;
        login(userData, token);
        try {
          await gethousehold_id(String(userData.id));
        } catch (householdErr) {
          // Log error but don't block registration if household_id fetch fails
          console.warn("Failed to fetch household_id:", householdErr);
        }
        // Redirect to home or dashboard
        navigate("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      // Handle error from API
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {error && (
        <div className="Alerts">
          {error}
          <button onClick={() => setError("")}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <p className="title">Sign Up</p>
          <input
            ref={nameRef}
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setemail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setpassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            value={cpassword}
            placeholder="Confirm your password"
            onChange={(e) => setcpassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button
          text={loading ? "Signing up..." : "Sign Up"}
          onClick={() => {}}
          disabled={loading}
          type="submit"
        />
        <span className="last">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </>
  );
};
