import "./Button.css"
export const Button = ({text, onClick}: {text: string, onClick: ()=>void})=>{
    return(
        <button className="custom-button" onClick={onClick}>
            {text}
        </button>
    )
}
