import { Link,  useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faShoppingCart,
  faCalendar,
  faCarrot,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import "./Sidebar.css";
import { useLogin } from "../Context/loginContext";

export const Sidebar = () => {
    const {logout}=useLogin();
    const navigate=useNavigate();
  return (
    <div className="sidebar">
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faHome} />
        Dashboard
      </Link>
      <Link to="/dashboard/pantry">
        <FontAwesomeIcon icon={faCarrot} />
        Pantry
      </Link>
      <Link to="/dashboard/recipes">
        <FontAwesomeIcon icon={faBook} />
        Recipes
      </Link>
      <Link to="/dashboard/shopping-list">
        <FontAwesomeIcon icon={faShoppingCart} />
        Shopping List
      </Link>
      <Link to="/dashboard/meal-plan">
        <FontAwesomeIcon icon={faCalendar} />
        Meal Plan
      </Link>
      <Button text="Logout" onClick={()=>{logout(); navigate("/login")}}/>
    </div>
  );
};
