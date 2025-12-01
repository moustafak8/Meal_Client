import { Form } from "../Components/Form";
import { useState } from "react";
import { Button } from "../Components/Button";
import { membersAPI ,householdAPI } from "../api/pantry";
import { Sidebar } from "../Components/Sidebar";
import "./maindashboard.css";

export const Pantry = () => {
  const storedUser = localStorage.getItem("user");
  let userid: string | null = null;

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userid = (parsed?.id ?? parsed?.user?.id ?? parsed)?.toString() ?? null;
    } catch {
      userid = storedUser;
    }
  }

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [invite_code, setInvitecode] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
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

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1>Pantry</h1>
        <p>Manage all your Available item and discover recipe ideas</p>
        <Button
          text={showJoinForm ? "Cancel" : "Join a Household"}
          onClick={() => {
            setShowJoinForm((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        />
        {showJoinForm && (
          <Form onSubmit={handleJoinSubmit} className="dashboard-form">
            <input
              type="text"
              placeholder="Enter the invitation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading || !code.trim()}>
              {loading ? "Joining..." : "Join"}
            </button>
          </Form>
        )}
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        <Button
          text={showJoinForm ? "Cancel" : "Create a Household"}
          onClick={() => {
            setShowJoinForm((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        />
          {showJoinForm && (
          <Form onSubmit={handleAddSubmit} className="dashboard-form">
            <input
              type="text"
              placeholder="Enter Household's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
             <input
              type="text"
              placeholder="Enter Household's Code"
              value={invite_code}
              onChange={(e) => setInvitecode(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading || !code.trim()}>
              {loading ? "Adding..." : "Add"}
            </button>
          </Form>
        )}
      </main>
    </div>
  );
};
