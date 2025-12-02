import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { getrecipes, type Recipe } from "../api/recipes";
import "./maindashboard.css";
import "./pantry.css";
import "./recipes.css";

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getrecipes();
        setRecipes(response.payload || []);
      } catch (err: any) {
        console.error("Failed to fetch recipes:", err);
        const backendMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.status ||
          JSON.stringify(err?.response?.data || {});
        setError(`Failed to load recipes. ${backendMessage || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="pantry-title">Recipes</h1>
        <p className="pantry-subtitle">Your collection of favorite recipes</p>

        {error && <p className="form-error">{error}</p>}

        {/* Recipes List */}
        <div className="pantry-items-container">
          {loading ? (
            <p>Loading recipes...</p>
          ) : recipes.length === 0 ? (
            <p className="no-items">
              No recipes saved yet. Save some recipes from AI suggestions to get started!
            </p>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id} className="pantry-item-row">
                <div className="recipe-content">
                  <h3>
                    {recipe.title}
                  </h3>
                  <p>
                    {recipe.instruction}
                  </p>
                  {recipe.tags && (
                    <div className="recipe-tags">
                      {recipe.tags.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="recipe-tag"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
