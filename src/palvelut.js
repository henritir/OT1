import { useEffect, useState } from "react";

const Palvelut = () => {
        const [palvelut, setPalvelut] = useState([]);
        const [alueet, setAlueet] = useState([]);
        const [serviceId, setServiceId] = useState("");
        const [serviceAreaId, setServiceAreaId] = useState("");
        const [serviceName, setServiceName] = useState("");
        const [serviceType, setServiceType] = useState("");
        const [serviceDescription, setServiceDescription] = useState("");
        const [servicePrice, setServicePrice] = useState("");
        const [serviceVat, setServiceVat] = useState("");
        const [haku, setHaku] = useState(true);
        const [lisaa, setLisaa] = useState("");
        const [poista, setPoista] = useState("");
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
        }, [haku]);


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
        useEffect(() => {
            const fetchlisaa = async () => {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
    
    
                var raw = JSON.stringify({
                    "palvelu_id": serviceId,
                    "alue_id": serviceAreaId,
                    "nimi": serviceName,
                    "tyyppi": serviceType,
                    "kuvaus": serviceDescription,
                    "hinta": servicePrice,
                    "alv": serviceVat,
                });
    
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
    
                await fetch("http://localhost:3004/api/vn/addpalvelu/", requestOptions)
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
        useEffect(() => {
            const fetchpoista = async () => {
    
                var requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                };
    
                await fetch("http://localhost:3004/api/vn/palvelu/poista/" + poista, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
    
                setHaku(!haku);
                console.log(haku);
            }
    
            if (poista != "") {
                fetchpoista();
            }
    
    
        }, [poista]);
        const lisaaButtonClicked = () => {
            if(serviceId !== "" && serviceAreaId !== "" && serviceName !== "" && serviceType !== "" && serviceDescription !== "" && servicePrice !== "" && serviceVat !== "" ){
                setLisaa("klikattu");
            }
        }
        const services = palvelut.map((s, i) => {
            return <tr>
                <td>{s.palvelu_id}</td>
                <td>{s.alue_id}</td>
                <td>{s.nimi}</td>
                <td>{s.tyyppi}</td>
                <td>{s.kuvaus}</td>
                <td>{s.hinta}</td>
                <td>{s.alv}</td>
                <td><button value={s.palvelu_id} onClick={(e) => setPoista(e.target.value)}>Poista</button></td>
                </tr>
        })
        return(
            <div>
                <div>
                <h3>Palvelu</h3>
                <label>Palvelu_ID(nro)
                <input type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)}></input>
                </label>
                <label>Alue_ID(nro)
                <select value={serviceAreaId} onChange={(e)=>setServiceAreaId(e.target.value)}>
                    <option value="">--valitse--</option>
                    {alueet.map((a,i)=> {
                        return (
                            <option key={i} value={a.alue_id}>{a.alue_id}</option>
                        )
                    })}
                </select>
                </label>
                <label>Nimi(teksti)
                <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)}></input>
                </label>
                <label>Tyyppi(nro)
                <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)}></input>
                </label>
                <label>Kuvaus(teksti)
                <input type="text" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)}></input>
                </label>
                <label>Hinta(nro)
                <input type="text" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)}></input>
                </label>
                <label>Alv(nro)
                <input type="text" value={serviceVat} onChange={(e) => setServiceVat(e.target.value)}></input>
                </label>
                <button onClick={() => lisaaButtonClicked()}>Lisää/Muuta</button>
                </div>
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