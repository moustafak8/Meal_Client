import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Button } from "../Components/Button";
import { getUnit, addItem, type unit } from "../api/pantry";
import { Sidebar } from "../Components/Sidebar";
import "./maindashboard.css";

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
      setError(
        `Failed to add item. ${backendMessage || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1>Pantry</h1>
        <p>Manage all your Available item and discover recipe ideas</p>

        <Button
          text={showAddForm ? "Cancel" : "Add an item"}
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        />
        {showAddForm && (
          <Form onSubmit={handleAddSubmit} className="dashboard-form">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter Item's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <label>quantity:</label>
            <input
              type="number"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.valueAsNumber)}
              required
              disabled={loading}
            />
            <label>Unit</label>
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
            <label>Expiry_date:</label>
            <input
              type="date"
              placeholder="Expiration date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
            />
            <label>Location</label>
            <input
              type="text"
              placeholder="itesm's Location"
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
      </main>
    </div>
  );
};
