import { useState, useRef, useEffect } from "react";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
export const Sign_up = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    if (email.trim() && password.trim() && cpassword.trim()) {
      console.log("Sign-up details:", { email, password, cpassword });
      setemail("");
      setpassword("");
      setcpassword("");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
          <label>Confirm Password:</label>
          <input
            ref={inputRef}
            type="password"
            value={cpassword}
            onChange={(e) => setcpassword(e.target.value)}
            required
          />
        </div>
        <Button text="Sign Up" onClick={() => {}} />
        <span className="last">
          Alread have an account ? <Link to="/login">Login</Link>
        </span>
      </form>
    </>
  );
};
