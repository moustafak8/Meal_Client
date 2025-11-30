import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarrot } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../Context/loginContext";
import "./Navbar.css";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useLogin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="navbar-logo">
            <FontAwesomeIcon icon={faCarrot} />
            Meal<span>Planner</span>
          </h1>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: "10px" }}>Welcome, {user?.name}</span>
              <Button text="Logout" onClick={handleLogout} />
            </>
          ) : (
            <Link to="/login">
              <Button text="Login" onClick={() => {}} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
