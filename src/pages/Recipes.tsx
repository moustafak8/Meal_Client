import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Form } from "../Components/Form";
import {
  getrecipes,
  getmeals,
  addMealPlanEntry,
  type Recipe,
  type MealPlan,
} from "../api/recipes";
import "./maindashboard.css";
import "./pantry.css";
import "./recipes.css";
export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [mealDate, setMealDate] = useState<string>("");
  const [mealType, setMealType] = useState<string>("Dinner");
  const [mealNotes, setMealNotes] = useState<string>("");
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<string>("");
  const [savingEntry, setSavingEntry] = useState(false);

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
        console.log(`Failed to load recipes. ${backendMessage || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await getmeals();
        setMealPlans(response.payload || []);
      } catch (err) {
        console.error("Failed to fetch meal plans:", err);
      }
    };

    fetchMealPlans();
  }, []);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRecipe(null);
    setShowMealPlanModal(false);
  };

  const openMealPlanModal = () => {
    setShowMealPlanModal(true);
  };

  const closeMealPlanModal = () => {
    setShowMealPlanModal(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="pantry-title">Recipes</h1>
        <p className="pantry-subtitle">Your collection of favorite recipes</p>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

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
                <div className="recipe-actions">
                  <button
                    type="button"
                    className="recipe-action-button"
                    onClick={() => handleViewDetails(recipe)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recipe Details Popup */}
        {showDetails && selectedRecipe && (
          <div className="overlay" onClick={closeDetails}>
            <div
              className="recipe-view-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="recipe-details-header">
                <div>
                  <h2 className="recipe-details-title">{selectedRecipe.title}</h2>
                  <p className="recipe-details-subtitle">
                    Schedule this recipe in your meal plan.
                  </p>
                </div>
                <button
                  type="button"
                  className="recipe-details-close"
                  onClick={closeDetails}
                >
                  ×
                </button>
              </div>

              <p className="recipe-details-instruction">
                {selectedRecipe.instruction}
              </p>

              {selectedRecipe.tags && (
                <div className="recipe-tags">
                  {selectedRecipe.tags.split(",").map((tag, idx) => (
                    <span key={idx} className="recipe-tag">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="recipe-details-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={openMealPlanModal}
                >
                  Add to Meal Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add to Meal Plan Modal */}
        {showMealPlanModal && selectedRecipe && (
          <div className="overlay">
            <div className="calendar-modal">
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Add to Calendar</h2>
                  <p className="calendar-modal-subtitle">
                    Schedule {selectedRecipe.title} in your meal plan
                  </p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={closeMealPlanModal}
                >
                  ×
                </button>
              </div>

              <Form
                className="calendar-form"
                onSubmit={async () => {
                  if (!selectedRecipe || !selectedMealPlanId || !mealDate) {
                    return;
                  }
                  setSavingEntry(true);
                  setError("");
                  setSuccess("");
                  try {
                    await addMealPlanEntry({
                      meal_plan_id: Number(selectedMealPlanId),
                      recipe_id: selectedRecipe.id,
                      date: mealDate,
                      meal_type: mealType,
                      description: mealNotes.trim() || null,
                    });
                    closeMealPlanModal();
                    setMealDate("");
                    setMealType("Dinner");
                    setMealNotes("");
                    setSelectedMealPlanId("");
                    setSuccess("Recipe added to meal plan successfully.");
                  } catch (err: any) {
                    console.error("Failed to add meal plan entry:", err);
                    const backendMessage =
                      err?.response?.data?.message ||
                      err?.response?.data?.error ||
                      err?.response?.data?.status ||
                      JSON.stringify(err?.response?.data || {});
                    setError(
                      `Failed to add recipe to meal plan. ${
                        backendMessage || "Unknown error"
                      }`
                    );
                  } finally {
                    setSavingEntry(false);
                  }
                }}
              >
                <div className="calendar-form-group">
                  <label className="calendar-label">Date</label>
                  <input
                    type="date"
                    className="calendar-input"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Meal Plan</label>
                  <select
                    className="calendar-input"
                    value={selectedMealPlanId}
                    onChange={(e) => setSelectedMealPlanId(e.target.value)}
                    required
                  >
                    <option value="">Select a meal plan</option>
                    {mealPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Meal Type</label>
                  <select
                    className="calendar-input"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div className="calendar-form-group">
                  <label className="calendar-label">Description</label>
                  <textarea
                    className="calendar-textarea"
                    placeholder="Add any notes or reminders..."
                    value={mealNotes}
                    onChange={(e) => setMealNotes(e.target.value)}
                  />
                </div>

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeMealPlanModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={savingEntry}
                  >
                    {savingEntry ? "Adding..." : "Add to Meal Plan"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
