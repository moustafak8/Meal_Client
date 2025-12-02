import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import {
  getUnit,
  addItem,
  getPantryItems,
  consumeItem,
  getAISuggestions,
  saveRecipeFromAI,
  type unit,
  type item,
  type Recipe,
} from "../api/pantry";
import { Sidebar } from "../Components/Sidebar";
import { PantryItemsList } from "../Components/PantryItemsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUtensils } from "@fortawesome/free-solid-svg-icons";
import "./maindashboard.css";
import "./pantry.css";

export const Pantry = () => {
  const storedUser = localStorage.getItem("user");
  let userid: string;

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userid = (parsed?.id ?? parsed?.user?.id ?? parsed)?.toString() ?? null;
    } catch {
      userid = storedUser;
    }
  }
  const [name, setName] = useState("");
  const [unitId, setUnitId] = useState<number | null>(null);
  const [units, setUnits] = useState<unit[]>([]);
  const [qty, setQty] = useState<number>(0);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pantryItems, setPantryItems] = useState<item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showConsumeForm, setShowConsumeForm] = useState(false);
  const [consumeItemId, setConsumeItemId] = useState<number | null>(null);
  const [consumeQty, setConsumeQty] = useState<number>(0);
  const [consumeReason, setConsumeReason] = useState("");
  const [showRecipePopup, setShowRecipePopup] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set());

  // Fetch units on component mount
  useEffect(() => {
    const fetchUnits = async () => {
      setLoadingUnits(true);
      try {
        const response = await getUnit();
        setUnits(response.payload || []);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError("Failed to load units. Please refresh the page.");
      } finally {
        setLoadingUnits(false);
      }
    };
    fetchUnits();
  }, []);
  useEffect(() => {
    const storedHouseholdId = localStorage.getItem("household_id");
    if (storedHouseholdId) {
      setHouseholdId(storedHouseholdId);
    }
  }, []);

  // Fetch pantry items when householdId is available
  useEffect(() => {
    const fetchPantryItems = async () => {
      if (!householdId) return;

      setLoadingItems(true);
      try {
        const response = await getPantryItems(householdId);
        setPantryItems(response.payload || []);
      } catch (err) {
        console.error("Failed to fetch pantry items:", err);
        setError("Failed to load pantry items. Please refresh the page.");
      } finally {
        setLoadingItems(false);
      }
    };
    fetchPantryItems();
  }, [householdId]);

  // Refetch items after successful addition
  useEffect(() => {
    if (success && success.includes("added")) {
      const fetchPantryItems = async () => {
        if (!householdId) return;
        try {
          const response = await getPantryItems(householdId);
          setPantryItems(response.payload || []);
        } catch (err) {
          console.error("Failed to refresh pantry items:", err);
        }
      };
      fetchPantryItems();
    }
  }, [success, householdId]);
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!householdId || householdId.trim() === "") {
      setError("Please enter a household ID.");
      return;
    }

    if (!unitId) {
      setError("Please select a unit.");
      return;
    }

    if (!userid) {
      setError("Please log in again.");
      return;
    }

    if (qty <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const response = await addItem(
        householdId,
        userid,
        unitId!,
        name.trim(),
        qty,
        date,
        location.trim()
      );
      console.log("Add item response:", response);
      setSuccess("Item added to pantry successfully!");
      setShowAddForm(false);
      // Reset form
      setName("");
      setQty(0);
      setUnitId(null);
      setDate("");
      setLocation("");
    } catch (err: any) {
      console.error("Add item error:", err?.response ?? err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to add item. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (itemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === pantryItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(pantryItems.map((item) => item.id)));
    }
  };

  const handleConsume = (itemId: number) => {
    const item = pantryItems.find((i) => i.id === itemId);
    if (!item) return;

    setConsumeItemId(itemId);
    setConsumeQty(item.quantity > 0 ? item.quantity : 1);
    setConsumeReason("");
    setError("");
    setSuccess("");
    setShowConsumeForm(true);
  };

  const handleConsumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userid) {
      setError("Please log in again.");
      return;
    }

    if (!consumeItemId) {
      setError("No item selected to consume.");
      return;
    }

    if (consumeQty <= 0) {
      setError("Consumed quantity must be greater than 0.");
      return;
    }

    const originalItem = pantryItems.find((i) => i.id === consumeItemId);
    if (originalItem && consumeQty > originalItem.quantity) {
      setError("Consumed quantity cannot exceed available quantity.");
      return;
    }

    setLoading(true);
    try {
      const response = await consumeItem(
        consumeItemId,
        userid,
        consumeQty,
        consumeReason.trim()
      );
      console.log("Consume item response:", response);
      setSuccess("Item consumption saved successfully!");

      // Refresh pantry items to reflect updated quantities
      if (householdId) {
        const refreshed = await getPantryItems(householdId);
        setPantryItems(refreshed.payload || []);
      }

      // Reset consume form state
      setShowConsumeForm(false);
      setConsumeItemId(null);
      setConsumeQty(0);
      setConsumeReason("");
    } catch (err: any) {
      console.error("Consume item error:", err?.response ?? err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(
        `Failed to save consumption. ${backendMessage || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };


  const handleDiscoverRecipes = async () => {
    setError("");
    setSuccess("");
    setLoadingRecipes(true);
    setShowRecipePopup(true);

    try {
      // Determine if all items are selected or some items
      const allSelected =
        selectedItems.size === pantryItems.length && pantryItems.length > 0;

      let itemIds: number[] | undefined;
      if (!allSelected && selectedItems.size > 0) {
        // Some items selected - send IDs
        itemIds = Array.from(selectedItems);
      }
      // If allSelected, itemIds remains undefined (no query params)

      const response = await getAISuggestions(itemIds);
      setRecipes(response.payload?.recipes || []);
      setSavedRecipes(new Set()); // Reset saved recipes
    } catch (err: any) {
      console.error("Failed to fetch recipe suggestions:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(
        `Failed to fetch recipe suggestions. ${
          backendMessage || "Unknown error"
        }`
      );
      setShowRecipePopup(false);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSaveRecipe = async (recipeIndex: number) => {
    const recipe = recipes[recipeIndex];
    if (!recipe) return;

    // Prevent duplicate saves
    if (savedRecipes.has(recipeIndex)) return;

    if (!userid) {
      setError("Please log in again.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await saveRecipeFromAI(recipe, userid);
      console.log("Save recipe response:", response);

      // Mark as saved only on success
      setSavedRecipes((prev) => {
        const newSet = new Set(prev);
        newSet.add(recipeIndex);
        return newSet;
      });

      setSuccess(`Recipe "${recipe.name}" saved successfully!`);
    } catch (err: any) {
      console.error("Failed to save recipe:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to save recipe. ${backendMessage || "Unknown error"}`);
    }
  };

  const handleCloseRecipePopup = () => {
    setShowRecipePopup(false);
    setRecipes([]);
    setSavedRecipes(new Set());
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="pantry-title">Pantry</h1>
        <p className="pantry-subtitle">
          Manage your available ingredients and discover recipe ideas
        </p>

        <div className="pantry-actions">
          <button
            className="pantry-btn-add"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setError("");
              setSuccess("");
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add an item(s)
          </button>
        </div>
        {showAddForm && (
          <Form onSubmit={handleAddSubmit} className="dashboard-form">
            <input
              type="text"
              placeholder="Enter Item's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.valueAsNumber)}
              required
              disabled={loading}
            />
            <select
              value={unitId || ""}
              onChange={(e) => setUnitId(Number(e.target.value))}
              required
              disabled={loading || loadingUnits}
            >
              <option value="">Select a unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Expiration date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="item's Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Adding..." : "Add"}
            </button>
          </Form>
        )}
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {/* Recipe Discovery Panel */}
        {pantryItems.length > 0 && (
          <div className="recipe-discovery-panel">
            <button
              className="discover-recipes-btn"
              onClick={handleDiscoverRecipes}
              disabled={loadingRecipes}
            >
              <FontAwesomeIcon icon={faUtensils} />
              {loadingRecipes
                ? "Loading..."
                : `Discover Recipes with ${
                    selectedItems.size || pantryItems.length
                  } Item${selectedItems.size !== 1 ? "s" : ""}`}
            </button>
            <span className="select-all-link" onClick={handleSelectAll}>
              Select All
            </span>
          </div>
        )}

        {/* Pantry Items List */}
        <PantryItemsList
          items={pantryItems}
          units={units}
          loading={loadingItems}
          selectedItems={selectedItems}
          onToggleSelect={handleToggleSelect}
          onConsume={handleConsume}
          showCheckboxes={true}
          showActions={true}
        />

        {/* Consume Item Form */}
        {showConsumeForm && (
          <Form
            onSubmit={handleConsumeSubmit}
            className="dashboard-form consume-form"
          >
            <h2>Consume Item</h2>
            {consumeItemId && (
              <p>
                Consuming:{" "}
                {pantryItems.find((i) => i.id === consumeItemId)?.name}{" "}
                (Available:{" "}
                {pantryItems.find((i) => i.id === consumeItemId)?.quantity})
              </p>
            )}
            <input
              type="number"
              placeholder="Quantity consumed"
              onChange={(e) => setConsumeQty(e.target.valueAsNumber)}
              min={1}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Reason (e.g. Breakfast , Lunch , etc..)"
              value={consumeReason}
              onChange={(e) => setConsumeReason(e.target.value)}
              required
              disabled={loading}
            />
            <div className="consume-form-actions">
              <button type="submit" disabled={loading || consumeQty <= 0}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConsumeForm(false);
                  setConsumeItemId(null);
                  setConsumeQty(0);
                  setConsumeReason("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}

        {/* Recipe Suggestions Popup */}
        {showRecipePopup && (
          <div
            className="recipe-popup-overlay"
            onClick={handleCloseRecipePopup}
          >
            <div
              className="recipe-popup-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="recipe-popup-header">
                <h2>Recipe Suggestions</h2>
                <button
                  className="recipe-popup-close"
                  onClick={handleCloseRecipePopup}
                >
                  ×
                </button>
              </div>
              <div className="recipe-popup-body">
                {loadingRecipes ? (
                  <div className="recipe-loading">
                    <p>Generating recipe suggestions...</p>
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="recipe-empty">
                    <p>No recipes found. Try selecting different items.</p>
                  </div>
                ) : (
                  <div className="recipes-list">
                    {recipes.map((recipe, index) => (
                      <div key={index} className="recipe-card">
                        <div className="recipe-header">
                          <h3 className="recipe-name">{recipe.name}</h3>
                          <button
                            className={`recipe-save-btn ${
                              savedRecipes.has(index) ? "saved" : ""
                            }`}
                            onClick={() => handleSaveRecipe(index)}
                            disabled={savedRecipes.has(index)}
                          >
                            {savedRecipes.has(index) ? "✓ Saved" : "Save"}
                          </button>
                        </div>
                        <div className="recipe-section">
                          <h4>Ingredients:</h4>
                          <ul className="recipe-ingredients">
                            {recipe.ingredients.map((ingredient, idx) => (
                              <li key={idx}>
                                {ingredient.quantity} {ingredient.unit}{" "}
                                {ingredient.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="recipe-section">
                          <h4>Instructions:</h4>
                          <p className="recipe-instructions">
                            {recipe.instructions}
                          </p>
                        </div>
                        {recipe.tags && (
                          <div className="recipe-tags">
                            {recipe.tags.split(",").map((tag, idx) => (
                              <span key={idx} className="recipe-tag">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="recipe-popup-footer">
                <button
                  className="recipe-popup-cancel"
                  onClick={handleCloseRecipePopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
