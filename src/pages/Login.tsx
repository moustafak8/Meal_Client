import { useState, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useLogin } from "../Context/loginContext";
import { loginAPI } from "../api/auth";
import { gethousehold_id } from "../api/pantry";
import { faX } from "@fortawesome/free-solid-svg-icons";
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
    return <Navigate to="/dashboard" replace />;
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
        login(userData, token);
        
        // Fetch and store household_id after successful authentication
        try {
          await gethousehold_id(String(userData.id));
        } catch (householdErr) {
          console.warn("Failed to fetch household_id:", householdErr);
        }
        
        // Redirect to home or dashboard
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      // Handle error from API
      const errorMessage =  "Login failed. Please check your credentials.";
      setError(errorMessage);
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
          <p className="title">Welcome back</p>
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email"
            value={email}
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
