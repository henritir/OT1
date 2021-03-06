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
    const [u_alue, setU_alue] = useState("");
    const [u_postinro, setU_postinro] = useState("");
    const [u_nimi, setU_nimi] = useState("");
    const [u_osoite, setU_osoite] = useState("");
    const [u_hinta, setU_hinta] = useState("");
    const [u_kuvaus, setU_kuvaus] = useState("");
    const [u_hmaara, setU_hmaara] = useState("");
    const [u_varustelu, setU_varustelu] = useState("");
    const [uusimokki, setUusimokki] = useState("");
    const [varaaminen, setVaraaminen] = useState("");
    const [alue, setAlue] = useState("");
    const [palveluhaku, setPalveluhaku] = useState("");
    const [palvelut, setPalvelut] = useState([]);
    const [valitutp, setValitutp] = useState([]);
    const [varaus_id, setVarausid] = useState("");


    useEffect(() => {
        const fetchmokit = async () => {
            let response = await fetch("http://localhost:3004/api/vn/mokkidata?");
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
                .then(result => setVarausid(result))
                .catch(error => console.log('error', error));

            console.log(varaus_id);
        }

        if (varaa != "") {
            fetchvaraa();
        }
    }, [varaa]);


    useEffect(() => {
        const fetchlisaapalvelut = async () => {
            while (valitutp.length > 0) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "varaus_id": varaus_id,
                    "palvelu_id": valitutp[valitutp.length - 1],
                    "lkm": "1"
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                await fetch("http://localhost:3004/api/vn/palveluvaraus/", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                valitutp.pop();
            }
        }

        if (valitutp.length > 0) {
            fetchlisaapalvelut();
        }
    }, [varaus_id]);

    useEffect(() => {
        const fetchmokki = async () => {
            let mokkki = muokkaa;
            if (muokkaa == "") {
                mokkki = varaaminen;
            }

            let response = await fetch("http://localhost:3004/api/vn/mokki/" + mokkki);
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
            setAlue(c[0].alue_id);
            setPalveluhaku(c[0].alue_id);
            console.log(palveluhaku);
        }

        if (muokkaa != "") {
            fetchmokki();
        }

        if (varaaminen != "") {
            fetchmokki();
        }

    }, [muokkaa, varaaminen]);


    useEffect(() => {
        const fetchpalvelut = async () => {
            let response = await fetch("http://localhost:3004/api/vn/saatavatpalvelut/" + palveluhaku);
            let c = await response.json();
            console.log(c);
            setPalvelut(c);
        }

        if (palveluhaku != "") {
            fetchpalvelut();
        }

    }, [palveluhaku]);

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

            await fetch("http://localhost:3004/api/vn/mokki/muokkaa/" + muokkaa, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));


        }
        if (muokkaa != "") {
            fetchmuokka();
            setHaku(!haku);
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

    useEffect(() => {
        const fetchlisaavalikot = async () => {
            let response = await fetch("http://localhost:3004/api/vn/lisaamokki");
            let c = await response.json();
            setAlueet(c.alueet);
            setPostinro(c.postinro);
            setU_alue(c.alueet[0].alue_id);
            setU_postinro(c.postinro[0].postinro);
            setM_postinro(c.postinro[0].postinro);
        }

        fetchlisaavalikot();


    }, [lisaa, muokkaa]);

    useEffect(() => {
        const fetchuusimokki = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "alue": u_alue,
                "postinro": u_postinro,
                "nimi": u_nimi,
                "osoite": u_osoite,
                "hinta": u_hinta,
                "kuvaus": u_kuvaus,
                "hmaara": u_hmaara,
                "varustelu": u_varustelu
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("http://localhost:3004/api/vn/uusimokki", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        if (uusimokki == "y") {
            setUusimokki("");
            fetchuusimokki();
        }

    }, [uusimokki]);

    const haeButtonclicked = () => {
        setHaettu_a_pvm(spvm);
        setHaettu_l_pvm(lpvm);
        setHaku(!haku);
    }

    const varaaButtonClicked = (e) => {
        console.log("valitut palvelut: " + valitutp);
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

    const palveluidenvalinta = (e) => {
        let i = null;
        if (!valitutp.includes(e)) {
            valitutp.push(e);
            console.log("if");
        }

        else if (valitutp.includes(e)) {
            console.log("else");
            for (let index = 0; index < valitutp.length; index++) {
                if (valitutp[index] == e) {
                    i = index;
                }
            }
            let eka = valitutp.slice(0, i);
            let toka = valitutp.slice(i + 1, valitutp.length);
            setValitutp(eka.concat(toka));
        }
        paivita();
    }



    const paivita = () => {
        console.log("valitut:" + valitutp);
    }


    return (
        <div>
            <h1>M??kki</h1>
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

            <label>L??ht??pvm(vvvv-kk-pp)
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
                        <th>Henkil??m????r??</th>
                        <th>Hinta</th>
                        <th>Kuvaus</th>
                        <th>Varustelu</th>
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
                                <td><button value={a.mokki_id} onClick={(e) => setVaraaminen(e.target.value)}>Varaa</button></td>
                                <td><button value={a.mokki_id} onClick={(e) => setMuokkaa(e.target.value)}>Muokkaa</button></td>
                                <td><button value={a.mokki_id} onClick={(e) => setPoista(e.target.value)}>Poista</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>

                <div>
                    {
                        varaaminen ?
                            <div>
                                <h2>M??kin {varaaminen} varaus?</h2>
                                <p>alueen {alue} palvelut</p>
                                {palvelut.map((a, i) => {
                                    return (
                                        <div>
                                        <label key={i}><input type="checkbox" onClick={(e) => palveluidenvalinta(e.target.value)} value={a.palvelu_id}></input>{a.nimi}
                                        </label>
                                        </div>
                                    )
                                })
                                }
                                <button value={varaaminen} onClick={(e) => varaaButtonClicked(e.target.value)}>Varaa</button>
                                <button onClick={() => setVaraaminen("")}>Peruuta</button>
                            </div> :
                            <div></div>

                    }

                </div>
                {
                    onnistui ?
                        <div>
                            <h2>Varauksen tiedot</h2>
                            <p>Asiakas id: {asiakas}</p>
                            <p>M??kki id: {varaa}</p>
                            <p>Saapumispvm: {haettu_a_pvm}</p>
                            <p>L??ht??pvm: {haettu_l_pvm}</p>

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
                            <h2>Muokkaa m??kki?? {muokattava.mokki_id}</h2>

                            <label>Postinro
                                <select onChange={(e) => setM_postinro(e.target.value)}>
                                    {postinro.map((a, i) => {
                                        return (
                                            <option key={i} value={a.postinro}>{a.toimipaikka}, {a.postinro}</option>
                                        )
                                    })}

                                </select>

                            </label>
                            <label>Nimi<input value={m_nimi} onChange={(e) => setM_nimi(e.target.value)}></input></label>
                            <label>Osoite<input value={m_osoite} onChange={(e) => setM_osoite(e.target.value)}></input></label>
                            <label>Hinta<input value={m_hinta} onChange={(e) => setM_hinta(e.target.value)}></input></label>
                            <label>Kuvaus<input value={m_kuvaus} onChange={(e) => setM_kuvaus(e.target.value)}></input></label>
                            <label>Henkil??m????r??<input value={m_hmaara} onChange={(e) => setM_hmaara(e.target.value)}></input></label>
                            <label>Varustelu<input value={m_varustelu} onChange={(e) => setM_varustelu(e.target.value)}></input></label>
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
                            <h2>Uuden m??kin lis??ys</h2>
                            <label>Alue
                                <select onChange={(e) => setU_alue(e.target.value)}>
                                    {alueet.map((a, i) => {
                                        return (
                                            <option key={i} value={a.alue_id}>{a.nimi},{a.alue_id}</option>
                                        )
                                    })}

                                </select>
                            </label>
                            <label>Postitoimipaikka
                                <select onChange={(e) => setU_postinro(e.target.value)}>
                                    {postinro.map((a, i) => {
                                        return (
                                            <option key={i} value={a.postinro}>{a.toimipaikka}, {a.postinro}</option>
                                        )
                                    })}

                                </select></label>
                            <label>Nimi<input value={u_nimi} onChange={(e) => setU_nimi(e.target.value)}></input></label>
                            <label>Osoite<input value={u_osoite} onChange={(e) => setU_osoite(e.target.value)}></input></label>
                            <label>Hinta<input value={u_hinta} onChange={(e) => setU_hinta(e.target.value)}></input></label>
                            <label>Kuvaus<input value={u_kuvaus} onChange={(e) => setU_kuvaus(e.target.value)}></input></label>
                            <label>Henkil??m????r??<input value={u_hmaara} onChange={(e) => setU_hmaara(e.target.value)}></input></label>
                            <label>Varustelu<input value={u_varustelu} onChange={(e) => setU_varustelu(e.target.value)}></input></label>
                            <button onClick={() => setUusimokki("y")}>Lis????</button>
                            <button onClick={() => setLisaa(false)}>Peruuta</button>
                        </div>
                        :
                        <div>
                            <br></br>
                            <button onClick={() => setLisaa(true)}>Lis???? uusi m??kki</button>
                        </div>
                }
            </div>

        </div>

    )

}

export { Mokit, };