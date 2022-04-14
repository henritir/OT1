import { useEffect, useState } from "react";

const Mokit = () => {

    const [haku, setHaku] = useState("a");
    const [mokit, setMokit] = useState([]);


    useEffect(() => {
        const fetchmokit = async () => {
            let response = await fetch("http://localhost:3004/api/customer?" + haku);
            let c = await response.json();
            console.log(c);
            setMokit(c);
        }
        if(haku != "a"){
            fetchmokit();

        }
        
    }, [haku]);

    const haeButtonclicked = () => {
        console.log("klikattu");
        setHaku("");
    }


    return (
        <div><h4>Basic näkymä</h4>
            <button onClick={(e)=>haeButtonclicked(e)}>Hae</button>

        </div>

    )

}

export { Mokit, };