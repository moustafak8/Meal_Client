import { faCarrot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.css";
export const Custom_footer = () => {
  return(
     <div>
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">
          <FontAwesomeIcon icon={faCarrot} />
          Meal<span>Planner</span>
        </h2>
        <p>© 2024 Meal Planner. All rights reserved.</p>
      </div>
    </footer>
  </div>
  )
}
