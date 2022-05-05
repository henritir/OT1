import { useEffect, useState } from "react";
let query = "";

const Palvelut = () => {
        const [palvelut, setPalvelut] = useState([]);
        useEffect( () => {
            console.log("useEffect happened ...");
    
            const fetchPalvelut = async () => {
                console.log("fetchPalvelut alkaa ...");
                let response = await fetch("http://localhost:3004/api/vn/palvelu?");
                console.log("fetch called ...", response);
                let c = await response.json();
                console.log("palvelut = ", c);
                setPalvelut(c);
                console.log("setAlueet called ...");
            }
    
            fetchPalvelut();
            console.log("useEffect called ...");
        }, [query]);
        const services = palvelut.map((s, i) => {
            return <tr>
                <td>{s.palvelu_id}</td>
                <td>{s.alue_id}</td>
                <td>{s.nimi}</td>
                <td>{s.tyyppi}</td>
                <td>{s.kuvaus}</td>
                <td>{s.hinta}</td>
                <td>{s.alv}</td>
                </tr>
        })
        return(
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Palvelu_ID</th>
                            <th>Alue_ID</th>
                            <th>Nimi</th>
                            <th>Tyyppi</th>
                            <th>Kuvaus</th>
                            <th>Hinta</th>
                            <th>Alv</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services}
                    </tbody>
                </table>
            </div>
        )
    
    }

export {Palvelut,};