import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarrot } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";
export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">
          <FontAwesomeIcon icon={faCarrot} />
          Meal<span>Planner</span>
        </h1>
        <Link to="/auth">
          <Button text="Login/SignUp" onClick={() => {}} />
        </Link>
      </div>
    </nav>
  );
};
