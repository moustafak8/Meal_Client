import "./Button.css"
export const Button = ({text, onClick, disabled, type = "button"}: {text: string, onClick: ()=>void, disabled?: boolean, type?: "button" | "submit" | "reset"})=>{
    return(
        <button type={type} className="custom-button" onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}
