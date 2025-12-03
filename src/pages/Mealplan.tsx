import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import {
  getmeals,
  getrecipes,
  type MealPlan,
  type Recipe,
} from "../api/recipes";
import {
  getMealPlanEntries,
  addMealPlan,
  type MealPlanEntries,
} from "../api/meal";
import {
  addMealPlanEntry,
  type MealPlanEntryRequest,
} from "../api/recipes";
import "./maindashboard.css";
import "./pantry.css";
import "./meal.css";

export const Mealplan = () => {
  const [mealplans, setMealplans] = useState<MealPlan[]>([]);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<number | null>(
    null
  );
  const [entries, setEntries] = useState<MealPlanEntries[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(today.setDate(diff));
  });
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showAddMealPlanModal, setShowAddMealPlanModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Form states for adding meal
  const [mealRecipeId, setMealRecipeId] = useState<string>("");
  const [mealType, setMealType] = useState<string>("Dinner");
  const [mealDescription, setMealDescription] = useState<string>("");

  // Form states for adding meal plan
  const [newMealPlanName, setNewMealPlanName] = useState<string>("");
  const [newMealPlanStartDate, setNewMealPlanStartDate] = useState<string>("");

  useEffect(() => {
    const fetchMealplans = async () => {
      setLoading(true);
      try {
        const response = await getmeals();
        setMealplans(response.payload || []);
        if (response.payload && response.payload.length > 0) {
          setSelectedMealPlanId(response.payload[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch meal plans:", err);
        setError("Failed to load meal plans");
      } finally {
        setLoading(false);
      }
    };
    fetchMealplans();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getrecipes();
        setRecipes(response.payload || []);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (selectedMealPlanId) {
      const fetchEntries = async () => {
        try {
          const response = await getMealPlanEntries(selectedMealPlanId);
          setEntries(response.payload || []);
        } catch (err) {
          console.error("Failed to fetch meal plan entries:", err);
          setError("Failed to load meal plan entries");
        }
      };
      fetchEntries();
    } else {
      setEntries([]);
    }
  }, [selectedMealPlanId]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDateRange = (): string => {
    const start = currentWeekStart;
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    const year = start.getFullYear();
    return `${startStr} - ${endStr}, ${year}`;
  };

  const getFullDateString = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const getDaysInWeek = (): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEntriesForDate = (dateString: string): MealPlanEntries[] => {
    return entries.filter((entry) => entry.date === dateString);
  };

  const handleAddMeal = (date: Date) => {
    setSelectedDate(getDateString(date));
    setMealRecipeId("");
    setMealType("Breakfast");
    setMealDescription("");
    setShowAddMealModal(true);
  };

  const handleSubmitAddMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMealPlanId || !selectedDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const entryData: MealPlanEntryRequest = {
        meal_plan_id: selectedMealPlanId,
        recipe_id: mealRecipeId ? Number(mealRecipeId) : null,
        date: selectedDate,
        meal_type: mealType,
        description: mealDescription.trim() || null,
      };
      await addMealPlanEntry(entryData);
      setSuccess("Meal added successfully!");
      setShowAddMealModal(false);
      // Refresh entries
      if (selectedMealPlanId) {
        const response = await getMealPlanEntries(selectedMealPlanId);
        setEntries(response.payload || []);
      }
      setMealRecipeId("");
      setMealType("Dinner");
      setMealDescription("");
    } catch (err: any) {
      console.error("Failed to add meal:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to add meal. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddMealPlan = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!newMealPlanName || !newMealPlanStartDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const storedUser = localStorage.getItem("user");
      let user_id: number | null = null;
      
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          user_id = parsed?.id ?? parsed?.user?.id ?? parsed?.user_id ?? parsed;
          if (typeof user_id !== 'number') {
            user_id = Number(user_id);
          }
        } catch {
          user_id = Number(storedUser);
          if (isNaN(user_id)) {
            user_id = null;
          }
        }
      }
          
      const storedHouseholdId = localStorage.getItem("household_id");
      const householdId = storedHouseholdId
        ? Number(storedHouseholdId)
        : null;

      if (!user_id || isNaN(user_id) || !householdId || isNaN(householdId)) {
        setError("Please log in again. User or household information is missing.");
        setLoading(false);
        return;
      }

      await addMealPlan({
        household_id: householdId,
        user_id: user_id,
        name: newMealPlanName.trim(),
        start_date: newMealPlanStartDate,
        created_at: "",
        updated_at: "",
      });

      setSuccess("Meal plan created successfully!");
      setShowAddMealPlanModal(false);
      setNewMealPlanName("");
      setNewMealPlanStartDate("");

      // Refresh meal plans
      const response = await getmeals();
      setMealplans(response.payload || []);
      if (response.payload && response.payload.length > 0) {
        setSelectedMealPlanId(response.payload[response.payload.length - 1].id);
      }
    } catch (err: any) {
      console.error("Failed to add meal plan:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to create meal plan. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInWeek();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="calendar-header">
          <div className="calendar-header-left">
            <h1 className="calendar-title">Calendar</h1>
            <p className="calendar-subtitle">
              View and manage your planned meals
            </p>
          </div>
          <div className="calendar-header-right">
            <div className="calendar-date-navigation">
              <button
                className="calendar-nav-button"
                onClick={() => navigateWeek("prev")}
              >
                &lt;
              </button>
              <span className="calendar-date-range">{formatDateRange()}</span>
              <button
                className="calendar-nav-button"
                onClick={() => navigateWeek("next")}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="calendar-meal-plan-selector">
          <label className="calendar-select-label">Select Meal Plan:</label>
          <select
            className="calendar-select"
            value={selectedMealPlanId || ""}
            onChange={(e) => setSelectedMealPlanId(Number(e.target.value))}
          >
            <option value="">Select a meal plan</option>
            {mealplans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
          <button
            className="calendar-add-plan-button"
            onClick={() => setShowAddMealPlanModal(true)}
          >
            + Add New Meal Plan
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="calendar-days-container">
          {days.length === 0 ? (
            <p className="calendar-no-days">
              No days to display. Adjust your date range.
            </p>
          ) : (
            days.map((day, idx) => {
              const dateString = getDateString(day);
              const dayEntries = getEntriesForDate(dateString);

              return (
                <div key={idx} className="calendar-day-card">
                  <div className="calendar-day-header">
                    <h3 className="calendar-day-title">
                      {getFullDateString(day)}
                    </h3>
                    <button
                      className="calendar-add-meal-button"
                      onClick={() => handleAddMeal(day)}
                      disabled={!selectedMealPlanId}
                    >
                      + Add Meal
                    </button>
                  </div>
                  {dayEntries.length === 0 ? (
                    <p className="calendar-no-meals">
                      No meals planned for this day
                    </p>
                  ) : (
                    <div className="calendar-meals-list">
                      {dayEntries.map((entry) => {
                        const recipe = entry.recipe_id
                          ? recipes.find((r) => r.id === entry.recipe_id)
                          : null;
                        return (
                          <div key={entry.id} className="calendar-meal-entry">
                            <div className="calendar-meal-info">
                              <span className="calendar-meal-type">
                                {entry.meal_type}
                              </span>
                              {recipe ? (
                                <>
                                  <span className="calendar-meal-recipe">
                                    {recipe.title}
                                  </span>
                                  {entry.description && (
                                    <span className="calendar-meal-description">
                                      {entry.description}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="calendar-meal-recipe">
                                    {entry.description || "Custom Meal"}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {showAddMealModal && (
          <div className="overlay" onClick={() => setShowAddMealModal(false)}>
            <div
              className="calendar-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Add Meal</h2>
                  <p className="calendar-modal-subtitle">
                    Add a meal to your plan
                  </p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={() => setShowAddMealModal(false)}
                >
                  ×
                </button>
              </div>

              <Form
                className="calendar-form"
                onSubmit={handleSubmitAddMeal}
              >
                <div className="calendar-form-group">
                  <label className="calendar-label">Date</label>
                  <input
                    type="date"
                    className="calendar-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Recipe (Optional)</label>
                  <select
                    className="calendar-input"
                    value={mealRecipeId}
                    onChange={(e) => setMealRecipeId(e.target.value)}
                  >
                    <option value="">No recipe (optional)</option>
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.title}
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
                    required
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
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                  />
                </div>

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowAddMealModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Meal"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
        {showAddMealPlanModal && (
          <div
            className="overlay"
            onClick={() => setShowAddMealPlanModal(false)}
          >
            <div
              className="calendar-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Add New Meal Plan</h2>
                  <p className="calendar-modal-subtitle">
                    Create a new meal plan
                  </p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={() => setShowAddMealPlanModal(false)}
                >
                  ×
                </button>
              </div>

              <Form
                className="calendar-form"
                onSubmit={handleSubmitAddMealPlan}
              >
                <div className="calendar-form-group">
                  <label className="calendar-label">Meal Plan Name</label>
                  <input
                    type="text"
                    className="calendar-input"
                    value={newMealPlanName}
                    onChange={(e) => setNewMealPlanName(e.target.value)}
                    placeholder="Enter meal plan name"
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Start Date</label>
                  <input
                    type="date"
                    className="calendar-input"
                    value={newMealPlanStartDate}
                    onChange={(e) => setNewMealPlanStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowAddMealPlanModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Meal Plan"}
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

export default Mealplan;
