import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faShoppingCart,
  faCalendar,
  faHouse,
  faCarrot,
} from "@fortawesome/free-solid-svg-icons";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faHome} />
        Dashboard
      </Link>
      <Link to="dashboard/household">
        <FontAwesomeIcon icon={faHouse} />
        Household
      </Link>
      <Link to="dashboard/pantry">
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
    </div>
  );
};
