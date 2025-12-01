import { Form } from "../Components/Form"
import {useState} from "react";
import { useNavigate } from "react-router-dom"
import { Button } from "../Components/Button";
export const Pantry = () =>{
    /*
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState("")
    const [category, setCategory] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const response = await addPantryItem(name, quantity, unit, category)
        }
        catch (error) {
            setError("Failed to add pantry item")
        }
        finally {
            setLoading(false)
        }
    }
        */

    const handleSubmit1 = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
    }
    const handlejoinhousehold = ()=>{
        <Form onSubmit={handleSubmit1}>
            <input type="text" placeholder="Enter the invitation code" />
            <button type="submit">Join</button>
        </Form>
    }
    return (
        <div>
            <Button text="Join a Houshold" onClick={handlejoinhousehold} />
        </div>
    );
};