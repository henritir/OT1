import { useEffect, useState } from "react";
let query = "";

const Alueet = () => {
    const [alueet, setAlueet] = useState([]);
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
    }, [query]);
    const areas = alueet.map((s, i) => {
        return <tr><td>{s.alue_id}</td><td>{s.nimi}</td></tr>
    })
    return(
        <div>
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