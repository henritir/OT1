import { useEffect, useState } from "react";

const Asiakkaat = () => {


    const [hae, setHae] = useState (true);
    const [asiakkaat, setAsiakkaat] = useState ([]);
    const [muokkaa, setMuokkaa] = useState("");
    const [m_postinro, setM_postinro] = useState([]);
    const [m_etunimi, setM_etunimi] = useState("");
    const [m_sukunimi, setM_sukunimi] = useState("");
    const [m_lahiosoite, setM_lahiosoite] = useState("");
    const [m_email, setM_email] = useState("");
    const [m_puhelinnro, setM_puhelinnro] = useState("");
    const [postinro, set_postinro] = useState([]);
    const [muokattava, setMuokattava] = useState([]);
    const [tallenna, setTallenna] = useState(false);
    const [u_postinro, setU_postinro] = useState([]);
    const [u_etunimi, setU_etunimi] = useState("");
    const [u_sukunimi, setU_sukunimi] = useState("");
    const [u_lahiosoite, setU_lahiosoite] = useState("");
    const [u_email, setU_email] = useState ("");
    const [u_puhelinnro, setU_puhelinnro] = useState ("");
    const [uusiasiakas, setU_uusiasiakas] = useState ("");
    const [lisaa, setLisaa] = useState(false);

    useEffect(() => {
        const fetchasiakas = async () => {

            let response = await fetch("http://localhost:3004/api/vn/asiakas/");
            let c = await response.json();
            console.log(c);
            setAsiakkaat(c);
            
        }

        
        fetchasiakas();
        

    }, [hae]);


    useEffect(() => {
        const fetchlisaavalikot = async () => {
            let response = await fetch("http://localhost:3004/api/vn/lisaamokki");
            let c = await response.json();
            set_postinro(c.postinro);
            setU_postinro(c.postinro[0].postinro);
            setM_postinro(c.postinro[0].postinro);
        }
        
        fetchlisaavalikot();
        
        
    }, [muokkaa]);

    useEffect(() => {
        const fetchmuokka = async () => {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "postinro": m_postinro,
                "etunimi": m_etunimi,
                "sukunimi": m_sukunimi,
                "lahiosoite": m_lahiosoite,
                "email": m_email,
                "puhelinnro": m_puhelinnro,
                
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/asiakas/muokkaa/"+muokkaa, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            
        }
        if (muokkaa != "") {
            fetchmuokka();
            setHae(!hae);
        }



    }, [tallenna]);

    useEffect(() => {
        const fetchasiagas = async () => {

            let response = await fetch("http://localhost:3004/api/vn/asiakas/" + muokkaa);
            let c = await response.json();
            console.log(c);
            setMuokattava(c[0]);
            setM_postinro(c[0].postinro);
            setM_etunimi(c[0].etunimi);
            setM_sukunimi(c[0].sukunimi);
            setM_lahiosoite(c[0].lahiosoite);
            setM_email(c[0].email);
            setM_puhelinnro(c[0].puhelinnro);
            
        }

        if (muokkaa != "") {
            fetchasiagas();
        }

    }, [muokkaa]);

    useEffect(() => {
        const fetchuusiasiakas = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "postinro": u_postinro,
                "etunimi": u_etunimi,
                "sukunimi": u_sukunimi,
                "lahiosoite": u_lahiosoite,
                "email": u_email,
                "puhelinnro": u_puhelinnro,
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/uusiasiakas", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        if(uusiasiakas=="y"){
            setU_uusiasiakas("");
            fetchuusiasiakas();
        }

    }, [uusiasiakas]);


    return(
        <div>
            <h1>Asiakkaat</h1>
        
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Postinro</th>
                        <th>Etunimi</th>
                        <th>Sukunimi</th>
                        <th>Osoite</th>
                        <th>Email</th>
                        <th>Puh</th>
                        
                    </tr>
                </thead>
                <tbody>
                    
                    {asiakkaat.map((a, i) => {
                        return (
                            <tr key={i}>
                                <td>{a.asiakas_id}</td>
                                <td>{a.postinro}</td>
                                <td>{a.etunimi}</td>
                                <td>{a.sukunimi}</td>
                                <td>{a.lahiosoite}</td>
                                <td>{a.email}</td>
                                <td>{a.puhelinnro}</td>
                                <td><button value={a.asiakas_id} onClick={(e) => setMuokkaa(e.target.value)}>Muokkaa</button></td>
                            </tr>
                        )
                    })}

                    
                </tbody>
            </table>
            <div>
                {
                    muokkaa ?
                        <div>
                            <h2>Muokkaa asiakasta {muokkaa} </h2>
                            
                            <label>Postinro
                            <select onChange={(e)=> setM_postinro(e.target.value)}>
                                    {postinro.map((a, i) => {
                                        return (
                                            <option key={i} value={a.postinro}>{a.toimipaikka}, {a.postinro}</option>
                                        )
                                    })}

                                </select>

                            </label>
                            <label>Etunimi<input value={m_etunimi} onChange={(e) => setM_etunimi(e.target.value)}></input></label>
                            <label>Sukunimi<input value={m_sukunimi} onChange={(e) => setM_sukunimi(e.target.value)}></input></label>
                            <label>Lähiosoite<input value={m_lahiosoite} onChange={(e) => setM_lahiosoite(e.target.value)}></input></label>
                            <label>Email<input value={m_email} onChange={(e) => setM_email(e.target.value)}></input></label>
                            <label>Puhelinnumero<input value={m_puhelinnro} onChange={(e) => setM_puhelinnro(e.target.value)}></input></label>
                            <button onClick={(e) => setTallenna(!tallenna)}>Tallenna</button>
                            <button onClick={(e) => setMuokkaa("")}>Peruuta</button>

                        </div> : null
                }

            </div>
            <div>
                {
                    lisaa ?
                        <div>
                            <br></br>
                            <h2>Uuden asiakkaan lisäys</h2>
                            <label>Postitoimipaikka
                                <select onChange={(e)=> setU_postinro(e.target.value)}>
                                    {postinro.map((a, i) => {
                                        return (
                                            <option key={i} value={a.postinro}>{a.toimipaikka}, {a.postinro}</option>
                                        )
                                    })}

                                </select></label>
                            <label>Etunimi<input value={u_etunimi} onChange={(e)=> setU_etunimi(e.target.value)}></input></label>
                            <label>Sukunimi<input value={u_sukunimi} onChange={(e)=> setU_sukunimi(e.target.value)}></input></label>
                            <label>Lähiosoite<input value={u_lahiosoite} onChange={(e)=> setU_lahiosoite(e.target.value)}></input></label>
                            <label>Email<input value={u_email} onChange={(e)=> setU_email(e.target.value)}></input></label>
                            <label>Puhelinnumero<input value={u_puhelinnro} onChange={(e)=> setU_puhelinnro(e.target.value)}></input></label>
                            <button onClick={()=> setU_uusiasiakas("y")}>Lisää</button>
                            <button onClick={() => setLisaa(false)}>Peruuta</button>
                        </div>
                        :
                        <div>
                            <br></br>
                            <button onClick={() => setLisaa(true)}>Lisää uusi asiakas</button>
                        </div>
                }
            </div>
        
        </div>
    )

}

export {Asiakkaat,};