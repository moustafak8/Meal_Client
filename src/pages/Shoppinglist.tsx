import { Form } from "../Components/Form";
import { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { getShoppingList, addShoppingList, type ShoppingListItems, type ShoppingList } from "../api/shopping";
import { getShoppingListItems, addShoppingListItems, updateShoppingListItems } from "../api/shopping";
import "./maindashboard.css";
import "./pantry.css";
import "./meal.css";

export const Shoppinglist = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItems[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");         
    const [showAddShoppingListModal, setShowAddShoppingListModal] = useState(false);
    const [showAddShoppingListItemsModal, setShowAddShoppingListItemsModal] = useState(false);
    const [selectedShoppingListId, setSelectedShoppingListId] = useState<number | null>(null);
    const [selectedShoppingListItemsId, setSelectedShoppingListItemsId] = useState<number | null>(null);
    const [selectedShoppingListItems, setSelectedShoppingListItems] = useState<ShoppingListItems | null>(null);
    const [selectedShoppingList, setSelectedShoppingList] = useState<ShoppingList | null>(null);
    const [newShoppingListName, setNewShoppingListName] = useState("");
    const [newShoppingListItemsName, setNewShoppingListItemsName] = useState("");
    const [newShoppingListItemsRequiredAmount, setNewShoppingListItemsRequiredAmount] = useState(0);
    const [newShoppingListItemsUnitId, setNewShoppingListItemsUnitId] = useState<number | null>(null);
    const [newShoppingListItemsIspurchased, setNewShoppingListItemsIspurchased] = useState(false);
    useEffect(() => {
        const fetchShoppingLists = async () => {
            setLoading(true);
            try {
                const response = await getShoppingList();
                setShoppingLists(response.payload || []);
            } catch (err: any) {
                console.error("Failed to fetch shopping lists:", err);
                const backendMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.response?.data?.status ||  JSON.stringify(err?.response?.data || {});
                console.log(`Failed to load shopping lists. ${backendMessage || "Unknown error"}`);
            } finally {
                setLoading(false);
            }
        };
        fetchShoppingLists();
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
                    const backendMessage =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        err?.response?.data?.status ||  JSON.stringify(err?.response?.data || {});
                    console.log(`Failed to load shopping list items. ${backendMessage || "Unknown error"}`);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchShoppingListItems();
    }, [selectedShoppingListId]);
    useEffect(() => {
        const fetchShoppingList = async () => {
            if (selectedShoppingListId) {
                setLoading(true);
                try {
                    const response = await getShoppingList();
                    setShoppingLists(response.payload || []);
                } catch (err: any) {
                    console.error("Failed to fetch shopping list:", err);
                    const backendMessage =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        err?.response?.data?.status ||  JSON.stringify(err?.response?.data || {});
                    console.log(`Failed to load shopping list. ${backendMessage || "Unknown error"}`);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchShoppingList();
    }, [selectedShoppingListId]);
    const handleAddShoppingList = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newShoppingListName) {
            setError("Please fill in all required fields");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await addShoppingList({
                name: newShoppingListName,
                household_id: householdId,
                user_id: user_id,
                meal_plan_id: null,
            });
        }
        } catch (err: any) {
            console.error("Failed to add shopping list:", err);
            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.response?.data?.status ||  JSON.stringify(err?.response?.data || {});
            console.log(`Failed to add shopping list. ${backendMessage || "Unknown error"}`);
        }
    }
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="shopping-list-container">
                    <h1 className="shopping-list-title">Shopping List</h1>
                    <Form onSubmit={handleAddShoppingList}>
                        <div className="shopping-list-form-group">
                            <label className="shopping-list-form-label">Name</label>
                            <input type="text" className="shopping-list-form-input" value={newShoppingListName} onChange={(e) => setNewShoppingListName(e.target.value)} />
                        </div>
                        <button type="submit" className="shopping-list-form-button">Add Shopping List</button>
                    </Form>
                    <div className="shopping-list-items-container">
                        <h2 className="shopping-list-items-title">Shopping List Items</h2>
                        <ul className="shopping-list-items-list">
                            {shoppingListItems.map((item) => (
                                <li key={item.id} className="shopping-list-items-list-item">
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Form onSubmit={handleAddShoppingListItems}>
                        <div className="shopping-list-items-form-group">
                            <label className="shopping-list-items-form-label">Name</label>
                            <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                        </div>
                        <button type="submit" className="shopping-list-items-form-button">Add Shopping List Items</button>
                    </Form>
                    <div className="shopping-list-items-container">
                        <h2 className="shopping-list-items-title">Shopping List Items</h2>
                        <ul className="shopping-list-items-list">
                            {shoppingListItems.map((item) => (
                                <li key={item.id} className="shopping-list-items-list-item">
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Form onSubmit={handleUpdateShoppingListItems}>
                        <div className="shopping-list-items-form-group">
                            <label className="shopping-list-items-form-label">Name</label>
                            <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                        </div>
                        <button type="submit" className="shopping-list-items-form-button">Update Shopping List Items</button>
                    </Form> 
                    <Form onSubmit={handleAddShoppingListItems}>
                        <div className="shopping-list-items-form-group">
                            <label className="shopping-list-items-form-label">Name</label>
                            <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                        </div>
                        <button type="submit" className="shopping-list-items-form-button">Add Shopping List Items</button>
                    </Form>
                </div>
                <Form onSubmit={handleUpdateShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Update Shopping List Items</button>
                </Form>
                <Form onSubmit={handleAddShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Add Shopping List Items</button>
                </Form>
                <Form onSubmit={handleUpdateShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Update Shopping List Items</button>
                </Form>
                <Form onSubmit={handleAddShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Add Shopping List Items</button>
                </Form>
                <Form onSubmit={handleUpdateShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Update Shopping List Items</button>
                </Form>
                <Form onSubmit={handleAddShoppingListItems}>
                    <div className="shopping-list-items-form-group">
                        <label className="shopping-list-items-form-label">Name</label>
                        <input type="text" className="shopping-list-items-form-input" value={newShoppingListItemsName} onChange={(e) => setNewShoppingListItemsName(e.target.value)} />
                    </div>
                    <button type="submit" className="shopping-list-items-form-button">Add Shopping List Items</button>
                </Form>
            </main>
        </div>
    );
}