import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
import { faCancel } from "@fortawesome/free-solid-svg-icons/faCancel";
export const Sign_up = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (email.trim() && password.trim() && cpassword.trim()) {
      console.log("Sign-up details:", { email, password, cpassword });
      setemail("");
      setpassword("");
      setcpassword("");
    }
  };
  return (
    <>
      {error && (
        <div className="Alerts">
          {error}
          <button onClick={() => setError("")}>
            <FontAwesomeIcon icon={faCancel} />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            ref={emailRef}
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={cpassword}
            onChange={(e) => setcpassword(e.target.value)}
            required
          />
        </div>
        <Button text="Sign Up" onClick={() => {}} />
        <span className="last">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </>
  );
};
