import { useEffect, useState } from "react";

const Mokit = () => {

    const [varaa, setVaraa] = useState("");
    const [mokit, setMokit] = useState([]);
    const [spvm, setSpvm] = useState("");
    const [lpvm, setLpvm] = useState("");
    const [paikat, setPaikat] = useState([]);
    const [paikka, setPaikka] = useState("");
    const [asikkaat, setAsiakkaat] = useState([]);
    const [asiakas, setAsiakas] = useState("");
    const [haettu_a_pvm, setHaettu_a_pvm] = useState("");
    const [haettu_l_pvm, setHaettu_l_pvm] = useState("");
    const [onnistui, setOnnistui] = useState(false);
    const [e_onnistui, setE_onnistu] = useState(false);
    const [haku, setHaku] = useState(true);
    const [poista, setPoista] = useState("");
    const [muokkaa, setMuokkaa] = useState("");
    const [muokattava, setMuokattava] = useState([]);
    const [m_postinro, setM_postinro] = useState("");
    const [m_nimi, setM_nimi] = useState("");
    const [m_osoite, setM_osoite] = useState("");
    const [m_hinta, setM_hinta] = useState("");
    const [m_kuvaus, setM_kuvaus] = useState("");
    const [m_hmaara, setM_hmaara] = useState("");
    const [m_varustelu, setM_varustelu] = useState("");
    const [tallenna, setTallenna] = useState(false);
    const [lisaa, setLisaa] = useState(false);
    const [alueet, setAlueet] = useState([]);
    const [postinro, setPostinro] = useState([]);


    useEffect(() => {
        const fetchmokit = async () => {
            let response = await fetch("http://localhost:3004/api/vn?");
            let c = await response.json();
            console.log(c);
            console.log(c.mokit);
            console.log(c.varaukset[0].varattu_alkupvm + "  " + c.varaukset[0].varattu_loppupvm);

            let varatut = [];

            c.varaukset.map((a, i) => {
                if (a.varattu_alkupvm < spvm && spvm < a.varattu_loppupvm) {
                    varatut.push(a.mokki_mokki_id);
                }

                else if (a.varattu_alkupvm < lpvm && lpvm < a.varattu_loppupvm) {
                    varatut.push(a.mokki_mokki_id);
                }

                else if (spvm < a.varattu_alkupvm && lpvm > a.varattu_alkupvm) {
                    varatut.push(a.mokki_mokki_id);
                }

            });

            console.log(varatut);
            let mokit = [];
            c.mokit.map((a, i) => {
                if (paikka != "") {
                    if (!varatut.includes(a.mokki_id) && paikka == a.toimipaikka) {
                        mokit.push(a);
                    }
                }

                else {

                    if (!varatut.includes(a.mokki_id)) {
                        mokit.push(a);
                    }
                }

            });
            console.log(paikka);
            setMokit(mokit);
            setPaikat(c.paikat);
            setAsiakkaat(c.asiakkaat);

        }
        fetchmokit();

    }, [haku]);


    useEffect(() => {
        const fetchvaraa = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let tanaan = new Date();
            tanaan = tanaan.getFullYear() + "-" + tanaan.getMonth() + "-" + tanaan.getDate();
            console.log(tanaan);

            var raw = JSON.stringify({
                "asiakas_id": asiakas,
                "mokki_id": varaa,
                "varaus_pvm": tanaan,
                "vahvistus": tanaan,
                "a_pvm": spvm,
                "l_pvm": lpvm
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/varaa/", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

        }

        if (varaa != "") {
            fetchvaraa();
        }


    }, [varaa]);

    useEffect(() => {
        const fetchmokki = async () => {

            let response = await fetch("http://localhost:3004/api/vn/mokki/" + muokkaa);
            let c = await response.json();
            console.log(c);
            setMuokattava(c[0]);
            setM_postinro(c[0].postinro);
            setM_nimi(c[0].mokkinimi);
            setM_osoite(c[0].katuosoite);
            setM_hinta(c[0].hinta);
            setM_kuvaus(c[0].kuvaus);
            setM_hmaara(c[0].henkilomaara);
            setM_varustelu(c[0].varustelu);
        }

        if (muokkaa != "") {
            fetchmokki();
        }

    }, [muokkaa]);

    useEffect(() => {
        const fetchmuokka = async () => {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "postinro": m_postinro,
                "mokkinimi": m_nimi,
                "katuosoite": m_osoite,
                "hinta": m_hinta,
                "kuvaus": m_kuvaus,
                "henkilomaara": m_hmaara,
                "varustelu": m_varustelu
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:3004/api/vn/mokki/muokkaa/8", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

                setHaku(!haku);
        }
        if(muokkaa != ""){
            fetchmuokka();
        }
        


    }, [tallenna]);


    useEffect(() => {
        const fetchpoista = async () => {

            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/mokki/poista/" + poista, requestOptions)
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

    useEffect(()=> {
        const fetchlisaavalikot = async () => {
            let response = await fetch("http://localhost:3004/api/vn/lisaamokki");
            let c = await response.json();
            setAlueet(c.alueet);
            setPostinro(c.postinro);
        }
        if(lisaa){
            fetchlisaavalikot();
        }
    }, [lisaa]);

    const haeButtonclicked = () => {
        setHaettu_a_pvm(spvm);
        setHaettu_l_pvm(lpvm);
        setHaku(!haku);
    }

    const varaaButtonClicked = (e) => {
        console.log(haettu_a_pvm + "  " + haettu_l_pvm + "  " + asiakas)
        if (haettu_a_pvm != "" && haettu_l_pvm != "" && asiakas != "") {
            setVaraa(e);
            setOnnistui(true);
            setE_onnistu(false);
        }
        else {
            setE_onnistu(true);
            setOnnistui(false);
        }
    }


    return (
        <div>
            <p>Hakutiedot(pakolliset)</p>

            <label> Asiakas
                <select onChange={(e) => setAsiakas(e.target.value)}>
                    <option value="">--valitse--</option>
                    {asikkaat.map((a, i) => {
                        return (
                            <option key={i} value={a.asiakas_id}>{a.asiakas_id}, {a.sukunimi} {a.etunimi}</option>
                        )
                    })}
                </select>
            </label>

            <label>Saapumispvm(vvvv-kk-pp)
                <input onChange={(e) => setSpvm(e.target.value)}>
                </input>
            </label>

            <label>Lähtöpvm(vvvv-kk-pp)
                <input onChange={(e) => setLpvm(e.target.value)}>
                </input>
            </label>
            <button onClick={(e) => haeButtonclicked(e)}>Hae</button>

            <p>Hakuehdot</p>
            <label>Paikka
                <select onChange={(e) => setPaikka(e.target.value)}>
                    <option value="">--valitse--</option>
                    {paikat.map((a, i) => {
                        return (
                            <option key={i} value={a.toimipaikka}>{a.toimipaikka}</option>
                        )
                    })}
                </select>
            </label>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nimi</th>
                        <th>POSTINRO</th>
                        <th>Toimipaikka</th>
                        <th>Osoite</th>
                        <th>Henkilömäärä</th>
                        <th>Hinta</th>
                    </tr>
                </thead>
                <tbody>
                    {mokit.map((a, i) => {
                        return (
                            <tr key={i}>
                                <td>{a.mokki_id}</td>
                                <td>{a.mokkinimi}</td>
                                <td>{a.postinro}</td>
                                <td>{a.toimipaikka}</td>
                                <td>{a.katuosoite}</td>
                                <td>{a.henkilomaara}</td>
                                <td>{a.hinta}</td>
                                <td>{a.kuvaus}</td>
                                <td>{a.varustelu}</td>
                                <td><button value={a.mokki_id} onClick={(e) => varaaButtonClicked(e.target.value)}>Varaa</button></td>
                                <td><button value={a.mokki_id} onClick={(e) => setMuokkaa(e.target.value)}>Muokkaa</button></td>
                                <td><button value={a.mokki_id} onClick={(e) => setPoista(e.target.value)}>Poista</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>
                {
                    onnistui ?
                        <div>
                            <h2>Varauksen tiedot</h2>
                            <p>Asiakas id: {asiakas}</p>
                            <p>Mökki id: {varaa}</p>
                            <p>Saapumispvm: {haettu_a_pvm}</p>
                            <p>Lähtöpvm: {haettu_l_pvm}</p>

                        </div> : null
                }

                {
                    e_onnistui ?
                        <div>
                            <h2>Puutteelliset tiedot</h2>
                        </div> : null
                }


            </div>
            <div>
                {
                    muokkaa ?
                        <div>
                            <h2>Muokkaa mökkiä {muokattava.mokki_id}</h2>
                            <label>Postinro<input value={m_postinro} onChange={(e) => setM_postinro(e.target.value)}></input></label>
                            <label>Nimi<input value={m_nimi} onChange={(e) => setM_nimi(e.target.value)}></input></label>
                            <label>Osoite<input value={m_osoite} onChange={(e) => setM_osoite(e.target.value)}></input></label>
                            <label>Hinta<input value={m_hinta} onChange={(e) => setM_hinta(e.target.value)}></input></label>
                            <label>Kuvaus<input value={m_kuvaus} onChange={(e) => setM_kuvaus(e.target.value)}></input></label>
                            <label>Henkilömäärä<input value={m_hmaara} onChange={(e) => setM_hmaara(e.target.value)}></input></label>
                            <label>Varustelu<input value={m_varustelu} onChange={(e) => setM_varustelu(e.target.value)}></input></label>
                            <button onClick={(e)=> setTallenna(!tallenna)}>Tallenna</button>
                            <button onClick={(e) => setMuokkaa("")}>Peruuta</button>

                        </div> : null
                }

            </div>

            <div>
                {
                    lisaa ? 
                    <div>
                        <br></br>
                        <h2>Uuden mökin lisäys</h2>
                        <label>Alue
                            <select>
                                {alueet.map((a,i)=>{
                                    return(
                                        <option key={i} value={a.alue_id}>{a.nimi},{a.alue_id}</option>
                                    )
                                })}

                            </select>
                        </label>
                        <label>Postitoimipaikka
                            <select>
                                {postinro.map((a,i)=>{
                                    return(
                                        <option key={i} value = {a.postinro}>{a.toimipaikka}, {a.postinro}</option>
                                    )
                                })}

                            </select></label>
                        <label>Nimi<input></input></label>
                        <label>Osoite<input></input></label>
                        <label>Hinta<input></input></label>
                        <label>Kuvaus<input></input></label>
                        <label>Henkilömäärä<input></input></label>
                        <label>Varustelu<input></input></label>
                        <button>Lisää</button>
                        <button onClick={()=> setLisaa(false)}>Peruuta</button>
                    </div>
                     : 
                    <div>
                        <br></br>
                        <button onClick={()=>setLisaa(true)}>Lisää uusi mökki</button>
                    </div>
                }
            </div>
        </div>

    )

}

export { Mokit, };