import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { getUnit, addItem, getPantryItems, type unit, type item } from "../api/pantry";
import { Sidebar } from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUtensils, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
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

  const handleConsume = async (itemId: number) => {
    // TODO: Implement consume functionality
    console.log("Consume item:", itemId);
    alert(`Consume functionality for item ${itemId} - to be implemented`);
  };

  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : "";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="pantry-title">Pantry</h1>
        <p className="pantry-subtitle">Manage your available ingredients and discover recipe ideas</p>

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
            <button className="discover-recipes-btn">
              <FontAwesomeIcon icon={faUtensils} />
              Discover Recipes with {selectedItems.size || pantryItems.length} Item{selectedItems.size !== 1 ? "s" : ""}
            </button>
            <span className="select-all-link" onClick={handleSelectAll}>
              Select All
            </span>
          </div>
        )}

        {/* Pantry Items List */}
        <div className="pantry-items-container">
          {loadingItems ? (
            <p>Loading pantry items...</p>
          ) : pantryItems.length === 0 ? (
            <p className="no-items">No items in pantry yet. Add some ingredients to get started!</p>
          ) : (
            pantryItems.map((item) => {
              const unitName = getUnitName(item.unit_id);
              return (
                <div key={item.id} className="pantry-item-row">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleToggleSelect(item.id)}
                    className="item-checkbox"
                  />
                  <span className="item-name">
                    {item.quantity} {unitName} {item.name}
                  </span>
                  <div className="item-actions">
                    <button className="consume-btn" onClick={() => handleConsume(item.id)}>
                      Consume
                    </button>
                    <button className="edit-btn" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="delete-btn" title="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
