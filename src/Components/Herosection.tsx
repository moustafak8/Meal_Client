import "./Herosection.css";
import { Button } from "./Button";
import { Link } from "react-router-dom";
export const Herosection = ()=> {
    return(
    <div className="Hero-wrapper">
        <h1>Recipes That Start <span>With You</span></h1>
        <p>Save all your favourite recipes, and discover new ones tailored to you.</p>
        <Link to ="/sign-up"><Button text="Get Started" onClick={()=>{}} /></Link>
    </div>
    )

}