import { useState, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
import { useLogin } from "../Context/loginContext";
import { loginAPI } from "../api/auth";

export const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { login, isAuthenticated } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginAPI(email, password);
      
      if (response.status === "success" && response.payload) {
        // Extract user data (without token) and token separately
        const { token, ...userData } = response.payload;
        
        // Call login from context to store token and user data
        login(userData, token);
        
        // Redirect to home or dashboard
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      // Handle error from API
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="Alerts" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            disabled={loading}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button 
          text={loading ? "Logging in..." : "Login"} 
          onClick={() => {}} 
          disabled={loading}
        />
        <span className="last">
          Dont have an account ? <Link to="/sign-up">Sign-Up</Link>
        </span>
      </form>
    </>
    
  );
};
