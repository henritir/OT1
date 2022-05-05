import { useEffect, useState } from "react";

const Alueet = () => {
    const [alueet, setAlueet] = useState([]);
    const [areaid, setAreaid] = useState("");
    const [areaname, setAreaname] = useState("");
    const [lisaa, setLisaa] = useState("");
    const [haku, setHaku] = useState(true);
    useEffect( () => {
        console.log("useEffect happened ...");

        const fetchAlueet = async () => {
            console.log("fetchAlueet alkaa ...");
            let response = await fetch("http://localhost:3004/api/vn/alue?");
            console.log("fetch called ...", response);
            let c = await response.json();
            console.log("alueet = ", c);
            setAlueet(c);
            console.log("setAlueet called ...");
        }

        fetchAlueet();
        console.log("useEffect called ...");
    }, [haku]);
    
    const areas = alueet.map((s, i) => {
        return <tr><td>{s.alue_id}</td><td>{s.nimi}</td></tr>
    })
    useEffect(() => {
        const fetchlisaa = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");


            var raw = JSON.stringify({
                "alue_id": areaid,
                "nimi": areaname,
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/addalue/", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            setHaku(!haku)
        }
        
        if(lisaa!=""){
            fetchlisaa();
            setLisaa("");
        }
        

    }, [lisaa]);
    const lisaaButtonClicked = () => {
        if(areaid !== "" && areaname !== ""){
            setLisaa("klikattu");
        }
    }
    return(
        <div>
            <div>
                <label>ID(nro)
                <input type="text" value={areaid} onChange={(e) => setAreaid(e.target.value)}></input>
                </label>
                <label>Nimi(teksti)
                <input type="text" value={areaname} onChange={(e) => setAreaname(e.target.value)}></input>
                </label>
                <button onClick={() => lisaaButtonClicked()}>Lisää/Muuta</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nimi</th>
                    </tr>
                </thead>
                <tbody>
                    {areas}
                </tbody>
            </table>
        </div>
    )

}

export {Alueet,};