import { Herosection } from "../Components/Herosection";
import { Cards } from "../Components/Cards";
import { Custom_footer } from "../Components/Custom_footer";
export const Home = ()=>{
    return(
        <div>
            <Herosection />
            <Cards />
            <Custom_footer />
        </div>
    )
}