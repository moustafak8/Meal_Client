import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getShoppingList,
  addShoppingList,
  getShoppingListItems,
  addShoppingListItems,
  updateShoppingListItems,
  deleteShoppingListItems,
  generateShoppingList,
  type ShoppingListItems,
  type ShoppingList,
  type GeneratedShoppingListItem,
} from "../api/shopping";
import { getUnit, type unit } from "../api/pantry";
import "./maindashboard.css";
import "./pantry.css";
import "./shopping.css";

export const Shoppinglist = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItems[]>([]);
  const [units, setUnits] = useState<unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedShoppingListId, setSelectedShoppingListId] = useState<number | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedShoppingListItem[]>([]);
  // Form states for adding item
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [newItemUnitId, setNewItemUnitId] = useState<number | null>(null);
  const [newShoppingListName, setNewShoppingListName] = useState("");
  const storedUser = localStorage.getItem("user");
  let user_id: number | null = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      user_id = parsed?.id ?? parsed?.user?.id ?? parsed?.user_id ?? parsed;
      if (typeof user_id !== "number") {
        user_id = Number(user_id);
        if (isNaN(user_id)) {
          user_id = null;
        }
      }
    } catch {
      user_id = Number(storedUser);
      if (isNaN(user_id)) {
        user_id = null;
      }
    }
  }

  const storedHouseholdId = localStorage.getItem("household_id");
  const householdId = storedHouseholdId ? Number(storedHouseholdId) : null;

  useEffect(() => {
    const fetchShoppingLists = async () => {
      setLoading(true);
      try {
        const response = await getShoppingList();
        setShoppingLists(response.payload || []);
        if (response.payload && response.payload.length > 0 && !selectedShoppingListId) {
          setSelectedShoppingListId(response.payload[0].id);
        }
      } catch (err: any) {
        console.error("Failed to fetch shopping lists:", err);
        setError("Failed to load shopping lists");
      } finally {
        setLoading(false);
      }
    };
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await getUnit();
        setUnits(response.payload || []);
      } catch (err) {
        console.error("Failed to fetch units:", err);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchShoppingListItems = async () => {
      if (selectedShoppingListId) {
        setLoading(true);
        try {
          const response = await getShoppingListItems(selectedShoppingListId);
          setShoppingListItems(response.payload || []);
        } catch (err: any) {
          console.error("Failed to fetch shopping list items:", err);
          setError("Failed to load shopping list items");
        } finally {
          setLoading(false);
        }
      } else {
        setShoppingListItems([]);
      }
    };
    fetchShoppingListItems();
  }, [selectedShoppingListId]);

  const handleToggleItem = async (item: ShoppingListItems) => {
    if (!selectedShoppingListId) return;

    setLoading(true);
    try {
      await updateShoppingListItems({
        ...item,
        isbought: !item.isbought,
      });
      // Refresh items
      const response = await getShoppingListItems(selectedShoppingListId);
      setShoppingListItems(response.payload || []);
    } catch (err: any) {
      console.error("Failed to update item:", err);
      setError("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShoppingListId || !newItemName || !newItemUnitId || newItemAmount <= 0) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addShoppingListItems({
        id: 0,
        shopping_list_id: selectedShoppingListId,
        name: newItemName.trim(),
        unit_id: newItemUnitId,
        required_amount: newItemAmount,
        isbought: false,
        created_at: "",
        updated_at: "",
      });
      setSuccess("Item added successfully!");
      setShowAddItemModal(false);
      setNewItemName("");
      setNewItemAmount(0);
      setNewItemUnitId(null);
      // Refresh items
      const response = await getShoppingListItems(selectedShoppingListId);
      setShoppingListItems(response.payload || []);
    } catch (err: any) {
      console.error("Failed to add item:", err);
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

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedShoppingListId) return;
    setLoading(true);
    try {
      await deleteShoppingListItems(itemId);
      setSuccess("Item deleted successfully!");
      // Refresh items
      const response = await getShoppingListItems(selectedShoppingListId);
      setShoppingListItems(response.payload || []);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to delete item. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newShoppingListName || !user_id || !householdId) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addShoppingList({
        id: 0,
        household_id: householdId,
        user_id: user_id,
        meal_plan_id: null,
        name: newShoppingListName.trim(),
        cost: 0,
        status: "active",
        created_at: "",
        updated_at: "",
      });
      setSuccess("Shopping list created successfully!");
      setShowAddListModal(false);
      setNewShoppingListName("");
      // Refresh lists
      const response = await getShoppingList();
      setShoppingLists(response.payload || []);
      if (response.payload && response.payload.length > 0) {
        setSelectedShoppingListId(response.payload[response.payload.length - 1].id);
      }
    } catch (err: any) {
      console.error("Failed to add shopping list:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to create shopping list. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const getUnitName = (unitId: number): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : "";
  };

  const getUnitIdByName = (unitName: string): number | null => {
    const unit = units.find((u) => u.name.toLowerCase() === unitName.toLowerCase());
    return unit ? unit.id : null;
  };

  const handleGenerateFromMealPlan = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setGeneratedItems([]);
    setShowGenerateModal(true);

    try {
      const response = await generateShoppingList();
      if (response.payload && response.payload.shopping_list) {
        setGeneratedItems(response.payload.shopping_list);
      } else {
        setError("No items generated from meal plan");
      }
    } catch (err: any) {
      console.error("Failed to generate shopping list:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to generate shopping list. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneratedItems = async () => {
    if (!selectedShoppingListId || generatedItems.length === 0) {
      setError("Please select a shopping list and ensure there are items to save");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Save all generated items
      for (const item of generatedItems) {
        const unitId = getUnitIdByName(item.unit);
        if (!unitId) {
          console.warn(`Unit "${item.unit}" not found, skipping item "${item.name}"`);
          continue;
        }

        await addShoppingListItems({
          id: 0,
          shopping_list_id: selectedShoppingListId,
          name: item.name,
          unit_id: unitId,
          required_amount: parseFloat(item.quantity) || 0,
          isbought: false,
          created_at: "",
          updated_at: "",
        });
      }

      setSuccess("Items saved to shopping list successfully!");
      setShowGenerateModal(false);
      setGeneratedItems([]);
      
      // Refresh shopping list items
      if (selectedShoppingListId) {
        const response = await getShoppingListItems(selectedShoppingListId);
        setShoppingListItems(response.payload || []);
      }
    } catch (err: any) {
      console.error("Failed to save generated items:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.status ||
        JSON.stringify(err?.response?.data || {});
      setError(`Failed to save items. ${backendMessage || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = shoppingListItems.filter((item) => item.isbought).length;
  const totalCount = shoppingListItems.length;
  const progressText = `${completedCount} of ${totalCount} items completed`;
  const groupedItems: { [key: string]: ShoppingListItems[] } = {};
  shoppingListItems.forEach((item) => {
    const category = "Items"; // Default category
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="shopping-title">Shopping List</h1>
        <p className="shopping-progress">{progressText}</p>

        <div className="shopping-controls">
          <select
            className="shopping-list-select"
            value={selectedShoppingListId || ""}
            onChange={(e) => setSelectedShoppingListId(Number(e.target.value))}
          >
            <option value="">Select a shopping list</option>
            {shoppingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
          <button
            className="shopping-add-button"
            onClick={() => setShowAddItemModal(true)}
            disabled={!selectedShoppingListId}
          >
            + Add Item(s)
          </button>
          <button
            className="shopping-add-list-button"
            onClick={() => setShowAddListModal(true)}
          >
            + New List
          </button>
          <button
            className="shopping-generate-button"
            onClick={handleGenerateFromMealPlan}
            disabled={loading}
          >
            Generate from Meal Plan
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="shopping-items-container">
          {!selectedShoppingListId ? (
            <p className="shopping-empty">Please select a shopping list to view items</p>
          ) : shoppingListItems.length === 0 ? (
            <p className="shopping-empty">No items in this shopping list yet</p>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="shopping-category">
                <h2 className="shopping-category-title">{category}</h2>
                <div className="shopping-items-list">
                  {items.map((item) => {
                    const unitName = getUnitName(item.unit_id);
                    return (
                      <div key={item.id} className="shopping-item-card">
                        <input
                          type="checkbox"
                          className="shopping-item-checkbox"
                          checked={item.isbought}
                          onChange={() => handleToggleItem(item)}
                          disabled={loading}
                        />
                        <div className="shopping-item-info">
                          <span className="shopping-item-name">{item.name}</span>
                          <span className="shopping-item-amount">
                            {item.required_amount} {unitName}
                          </span>
                        </div>
                        <div className="shopping-item-actions">
                         <button
                            className="shopping-item-icon-button"
                            title="Delete"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="overlay" onClick={() => setShowAddItemModal(false)}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Add Item</h2>
                  <p className="calendar-modal-subtitle">Add a new item to your shopping list</p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={() => setShowAddItemModal(false)}
                >
                  ×
                </button>
              </div>

              <Form className="calendar-form" onSubmit={handleAddItem}>
                <div className="calendar-form-group">
                  <label className="calendar-label">Item Name</label>
                  <input
                    type="text"
                    className="calendar-input"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Amount</label>
                  <input
                    type="number"
                    className="calendar-input"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(Number(e.target.value))}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label className="calendar-label">Unit</label>
                  <select
                    className="calendar-input"
                    value={newItemUnitId || ""}
                    onChange={(e) => setNewItemUnitId(Number(e.target.value))}
                    required
                  >
                    <option value="">Select a unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowAddItemModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Add List Modal */}
        {showAddListModal && (
          <div className="overlay" onClick={() => setShowAddListModal(false)}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Add New Shopping List</h2>
                  <p className="calendar-modal-subtitle">Create a new shopping list</p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={() => setShowAddListModal(false)}
                >
                  ×
                </button>
              </div>

              <Form className="calendar-form" onSubmit={handleAddList}>
                <div className="calendar-form-group">
                  <label className="calendar-label">List Name</label>
                  <input
                    type="text"
                    className="calendar-input"
                    value={newShoppingListName}
                    onChange={(e) => setNewShoppingListName(e.target.value)}
                    placeholder="Enter list name"
                    required
                  />
                </div>

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowAddListModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? "Creating..." : "Create List"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Generate from Meal Plan Modal */}
        {showGenerateModal && (
          <div className="overlay" onClick={() => {
            setShowGenerateModal(false);
            setGeneratedItems([]);
          }}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
              <div className="calendar-modal-header">
                <div>
                  <h2 className="calendar-modal-title">Generated Shopping List</h2>
                  <p className="calendar-modal-subtitle">Items generated from your meal plan</p>
                </div>
                <button
                  type="button"
                  className="calendar-modal-close"
                  onClick={() => {
                    setShowGenerateModal(false);
                    setGeneratedItems([]);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="calendar-form">
                {loading && !generatedItems.length ? (
                  <p>Generating shopping list...</p>
                ) : generatedItems.length === 0 ? (
                  <p className="shopping-empty">No items generated</p>
                ) : (
                  <div className="shopping-items-list">
                    {generatedItems.map((item, index) => (
                      <div key={index} className="shopping-item-card">
                        <div className="shopping-item-info">
                          <span className="shopping-item-name">{item.name}</span>
                          <span className="shopping-item-amount">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="calendar-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowGenerateModal(false);
                      setGeneratedItems([]);
                    }}
                  >
                    Close
                  </button>
                  {generatedItems.length > 0 && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleSaveGeneratedItems}
                      disabled={loading || !selectedShoppingListId}
                    >
                      {loading ? "Saving..." : "Save to Shopping List"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
