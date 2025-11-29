import { useState, useRef, useEffect } from "react";
import "./sign_page.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
export const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
        </div>
        <Button text="Sign Up" onClick={() => {}} />
        <span className="last">
          Dont have an account ? <Link to="/sign-up">Sign-Up</Link>
        </span>
      </form>
    </>
  );
};
