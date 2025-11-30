import "./Button.css"
export const Button = ({text, onClick, disabled}: {text: string, onClick: ()=>void, disabled?: boolean})=>{
    return(
        <button className="custom-button" onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}
