import { useEffect, useState } from "react";

const Alueet = () => {
    const [alueet, setAlueet] = useState([]);
    const [areaid, setAreaid] = useState("");
    const [areaname, setAreaname] = useState("");
    const [lisaa, setLisaa] = useState("");
    const [haku, setHaku] = useState(true);
    const [poista, setPoista] = useState("");
    const [posti, setPosti] = useState([]);
    const [postnum, setPostnum] = useState("");
    const [postplace, setPostplace] = useState("");
    const [lisaa2, setLisaa2] = useState("");
    const [poista2, setPoista2] = useState("");
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
    useEffect( () => {
        console.log("useEffect happened ...");

        const fetchPosti = async () => {
            console.log("fetchAlueet alkaa ...");
            let response = await fetch("http://localhost:3004/api/vn/posti?");
            console.log("fetch called ...", response);
            let c = await response.json();
            console.log("posti = ", c);
            setPosti(c);
            console.log("setAlueet called ...");
        }

        fetchPosti();
        console.log("useEffect called ...");
    }, [haku]);
    
    const areas = alueet.map((s, i) => {
        return <tr><td>{s.alue_id}</td><td>{s.nimi}</td><td><button value={s.alue_id} onClick={(e) => setPoista(e.target.value)}>Poista</button></td></tr>
    })
    const post = posti.map((s, i) => {
        return <tr><td>{s.postinro}</td><td>{s.toimipaikka}</td><td><button value={s.postinro} onClick={(e) => setPoista2(e.target.value)}>Poista</button></td></tr>
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
    useEffect(() => {
        const fetchlisaa2 = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");


            var raw = JSON.stringify({
                "postinro": postnum,
                "toimipaikka": postplace,
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/addposti/", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            setHaku(!haku)
        }
        
        if(lisaa2!=""){
            fetchlisaa2();
            setLisaa2("");
        }
        

    }, [lisaa2]);
    useEffect(() => {
        const fetchpoista = async () => {

            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/alue/poista/" + poista, requestOptions)
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
    useEffect(() => {
        const fetchpoista2 = async () => {

            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/posti/poista/" + poista2, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            setHaku(!haku);
            console.log(haku);
        }

        if (poista2 != "") {
            console.log(poista2);
            fetchpoista2();
        }


    }, [poista2]);
    const lisaaButtonClicked = () => {
        if(areaid !== "" && areaname !== ""){
            setLisaa("klikattu");
        }
    }
    const lisaaButtonClicked2 = () => {
        if(postnum !== "" && postplace !== ""){
            setLisaa2("klikattu");
        }
    }
    return(
        <div>
            <div>
            <h3>Alue</h3>
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
            <h3>Posti</h3>
            <label>Postinumero(nro)
                <input type="text" value={postnum} onChange={(e) => setPostnum(e.target.value)}></input>
                </label>
                <label>Postitoimipaikka(teksti)
                <input type="text" value={postplace} onChange={(e) => setPostplace(e.target.value)}></input>
                </label>
                <button onClick={() => lisaaButtonClicked2()}>Lisää/Muuta</button>
            <table>
                <thead>
                    <tr>
                        <th>Postinumero</th>
                        <th>Postitoimipaikka</th>
                    </tr>
                </thead>
                <tbody>
                    {post}
                </tbody>
            </table>
        </div>
    )

}

export {Alueet,};