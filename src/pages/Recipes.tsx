import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { PantryItemsList } from "../Components/PantryItemsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./maindashboard.css";
import "./pantry.css";
export const Recipes = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="pantry-title">Recipes</h1>
        <p className="pantry-subtitle">Your collection of favorite recipes</p>
        <div className="pantry-actions">
            
        </div>
      </main>
    </div>
  );
};
