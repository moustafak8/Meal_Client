import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getmeals, type MealPlan } from "../api/recipes";
import "./maindashboard.css";
import "./pantry.css";
export const Mealplan = () => {
    const [mealplans, setMealplans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    useEffect(() => {
        const fetchMealplans = async () => {
            setLoading(true);
            try {
                const response = await getmeals();
                setMealplans(response.payload || []);
            } catch (err) {
                console.error("Failed to fetch meal plans:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMealplans();
    }, []);
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <h1 className="pantry-title">Meal Plans</h1>
                <p className="pantry-subtitle">Your meal plans</p>
                </main>
            </div>
        );
    };
    export default Mealplan;