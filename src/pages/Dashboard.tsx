import { Sidebar } from "../Components/Sidebar";
import "./maindashboard.css";
import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Button } from "../Components/Button";
import { membersAPI, householdAPI, getPantryItems, getUnit, type item, type unit } from "../api/pantry";
const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  let userid: string | null = null;
  let user_name: string | null = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userid = (parsed?.id ?? parsed?.user?.id ?? parsed)?.toString() ?? null;
      user_name = (parsed?.name ?? parsed?.user?.name ?? parsed)?.toString() ?? null;
    } catch {
      userid = storedUser;
    }
  }

  const storedHouseholdId = localStorage.getItem("household_id");
  const householdId = storedHouseholdId ? storedHouseholdId : null;

  // Fetch pantry items and units
  useEffect(() => {
    const fetchData = async () => {
      if (!householdId) return;

      setLoadingItems(true);
      try {
        const [itemsResponse, unitsResponse] = await Promise.all([
          getPantryItems(householdId),
          getUnit(),
        ]);
        setPantryItems(itemsResponse.payload || []);
        setUnits(unitsResponse.payload || []);
      } catch (err) {
        console.error("Failed to fetch pantry data:", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchData();
  }, [householdId]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [invite_code, setInvitecode] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pantryItems, setPantryItems] = useState<item[]>([]);
  const [units, setUnits] = useState<unit[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [expiringDays, setExpiringDays] = useState(7); 
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userid) {
      setError("Please log in again before joining a household.");
      return;
    }

    setLoading(true);
    try {
      const response = await householdAPI(name.trim(), invite_code.trim(), userid);
      console.log("Add household response:", response);
      setSuccess("Household Created successfully.");
      setShowAddForm(false);
      setName("");
      setInvitecode("");
    } catch (err: any) {
      //  backend error if available
      console.error("Join household error:", err?.response ?? err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        JSON.stringify(err?.response?.data || {});
      setError(
        `Failed to join household. Server said: ${
          backendMessage || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userid) {
      setError("Please log in again before joining a household.");
      return;
    }

    setLoading(true);
    try {
      const response = await membersAPI(code.trim(), userid);
      console.log("Join household response:", response);
      setSuccess("Household joined successfully.");
      setShowJoinForm(false);
      setCode("");
    } catch (err: any) {
      //  backend error if available
      console.error("Join household error:", err?.response ?? err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        JSON.stringify(err?.response?.data || {});
      setError(
        `Failed to join household. Server said: ${
          backendMessage || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expirationDate: string): number | null => {
    if (!expirationDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expirationDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  const getUnitName = (unitId: number): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : "";
  };

  // Filter items expiring within specified days
  const getExpiringItems = (days: number): item[] => {
    return pantryItems.filter((item) => {
      const daysUntil = getDaysUntilExpiration(item.expiration_date);
      return daysUntil !== null && daysUntil >= 0 && daysUntil <= days;
    }).sort((a, b) => {
      const daysA = getDaysUntilExpiration(a.expiration_date) ?? Infinity;
      const daysB = getDaysUntilExpiration(b.expiration_date) ?? Infinity;
      return daysA - daysB;
    });
  };

  const useFirstItems = getExpiringItems(3); 
  const expiringItems = getExpiringItems(expiringDays).filter((item) => {
    const daysUntil = getDaysUntilExpiration(item.expiration_date);
    return daysUntil === null || daysUntil > 3; // Exclude items expiring in 3 days or less
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-header-section">
          <div>
            <h1>Welcome {user_name}</h1>
            <p>Manage all your Available item and discover recipe ideas</p>
          </div>
          <div className="dashboard-household-buttons">
            <Button
              text={showJoinForm ? "Cancel" : "Join a Household"}
              onClick={() => {
                setShowJoinForm((prev) => !prev);
                setShowAddForm(false);
                setError("");
                setSuccess("");
              }}
            />
            <Button
              text={showAddForm ? "Cancel" : "Create a Household"}
              onClick={() => {
                setShowAddForm((prev) => !prev);
                setShowJoinForm(false);
                setError("");
                setSuccess("");
              }}
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {/* Join Household Modal */}
        {showJoinForm && (
          <div className="overlay" onClick={() => {
            setShowJoinForm(false);
            setError("");
            setSuccess("");
          }}>
            <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
              <div className="dashboard-modal-header">
                <h2 className="dashboard-modal-title">Join a Household</h2>
                <button
                  type="button"
                  className="dashboard-modal-close"
                  onClick={() => {
                    setShowJoinForm(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  ×
                </button>
              </div>
              <Form onSubmit={handleJoinSubmit} className="dashboard-form">
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Invitation Code</label>
                  <input
                    type="text"
                    placeholder="Enter the invitation code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="dashboard-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowJoinForm(false);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button" disabled={loading || !code.trim()}>
                    {loading ? "Joining..." : "Join"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Create Household Modal */}
        {showAddForm && (
          <div className="overlay" onClick={() => {
            setShowAddForm(false);
            setError("");
            setSuccess("");
          }}>
            <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
              <div className="dashboard-modal-header">
                <h2 className="dashboard-modal-title">Create a Household</h2>
                <button
                  type="button"
                  className="dashboard-modal-close"
                  onClick={() => {
                    setShowAddForm(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  ×
                </button>
              </div>
              <Form onSubmit={handleAddSubmit} className="dashboard-form">
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Household Name</label>
                  <input
                    type="text"
                    placeholder="Enter Household's name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-label">Household Code</label>
                  <input
                    type="text"
                    placeholder="Enter Household's Code"
                    value={invite_code}
                    onChange={(e) => setInvitecode(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="dashboard-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowAddForm(false);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button" disabled={loading || !name.trim()}>
                    {loading ? "Adding..." : "Create"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Expiring Items Section */}
        {householdId && (
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Items Expiring Soon</h2>
              <div className="dashboard-filter">
                <label htmlFor="expiring-days">Show items expiring in:</label>
                <select
                  id="expiring-days"
                  className="dashboard-select"
                  value={expiringDays}
                  onChange={(e) => setExpiringDays(Number(e.target.value))}
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>

            {loadingItems ? (
              <p className="dashboard-loading">Loading items...</p>
            ) : expiringItems.length === 0 ? (
              <p className="dashboard-empty">No items expiring in the next {expiringDays} days! 🎉</p>
            ) : (
              <div className="dashboard-items-grid">
                {expiringItems.map((item) => {
                  const daysUntil = getDaysUntilExpiration(item.expiration_date);
                  const isUseFirst = daysUntil !== null && daysUntil <= 3;
                  const isExpired = daysUntil !== null && daysUntil < 0;
                  
                  return (
                    <div
                      key={item.id}
                      className={`dashboard-item-card ${isExpired ? "expired" : ""} ${isUseFirst ? "use-first" : ""}`}
                    >
                      {isUseFirst && (
                        <div className="use-first-badge">Use First</div>
                      )}
                      {isExpired && (
                        <div className="expired-badge">Expired</div>
                      )}
                      <div className="dashboard-item-header">
                        <h3 className="dashboard-item-name">{item.name}</h3>
                        {daysUntil !== null && (
                          <span className={`dashboard-item-days ${isExpired ? "expired-text" : isUseFirst ? "urgent-text" : ""}`}>
                            {isExpired
                              ? `Expired ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} ago`
                              : daysUntil === 0
                              ? "Expires today"
                              : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`}
                          </span>
                        )}
                      </div>
                      <div className="dashboard-item-details">
                        <span className="dashboard-item-quantity">
                          {item.quantity} {getUnitName(item.unit_id)}
                        </span>
                        {item.location && (
                          <span className="dashboard-item-location">📍 {item.location}</span>
                        )}
                      </div>
                      <div className="dashboard-item-date">
                        Expires: {new Date(item.expiration_date).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Use First Section (Items expiring in 3 days or less) */}
        {householdId && useFirstItems.length > 0 && (
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">⚠️ Use First - Expiring Soon!</h2>
            <div className="dashboard-items-grid">
              {useFirstItems.map((item) => {
                const daysUntil = getDaysUntilExpiration(item.expiration_date);
                const isExpired = daysUntil !== null && daysUntil < 0;
                
                return (
                  <div
                    key={item.id}
                    className={`dashboard-item-card use-first ${isExpired ? "expired" : ""}`}
                  >
                    <div className="use-first-badge">Use First</div>
                    {isExpired && (
                      <div className="expired-badge">Expired</div>
                    )}
                    <div className="dashboard-item-header">
                      <h3 className="dashboard-item-name">{item.name}</h3>
                      {daysUntil !== null && (
                        <span className={`dashboard-item-days ${isExpired ? "expired-text" : "urgent-text"}`}>
                          {isExpired
                            ? `Expired ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} ago`
                            : daysUntil === 0
                            ? "Expires today"
                            : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`}
                        </span>
                      )}
                    </div>
                    <div className="dashboard-item-details">
                      <span className="dashboard-item-quantity">
                        {item.quantity} {getUnitName(item.unit_id)}
                      </span>
                      {item.location && (
                        <span className="dashboard-item-location">📍 {item.location}</span>
                      )}
                    </div>
                    <div className="dashboard-item-date">
                      Expires: {new Date(item.expiration_date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      
      </main>
    </div>
  );
};
export default Dashboard;
