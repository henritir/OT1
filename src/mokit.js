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

    }, [haettu_a_pvm, haettu_l_pvm]);


    useEffect(() => {
        const fetchvaraa = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let tanaan = new Date();
            tanaan = tanaan.getFullYear() +"-" + tanaan.getMonth() +"-"+ tanaan.getDate();
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
        
        fetchvaraa();
        
        

    }, [varaa]);

    const haeButtonclicked = () => {
        setHaettu_a_pvm(spvm);
        setHaettu_l_pvm(lpvm);
    }

    const varaaButtonClicked = (e) => {
        console.log(haettu_a_pvm+"  "+haettu_l_pvm+"  "+asiakas)
        if(haettu_a_pvm != "" && haettu_l_pvm != "" && asiakas !=""){
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
                <select onChange={(e)=>setAsiakas(e.target.value)}>
                    <option value="">--valitse--</option>
                    {asikkaat.map((a,i)=> {
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
                                <td><button value={a.mokki_id} onClick={(e)=>varaaButtonClicked(e.target.value)}>Varaa</button></td>
                                <td><button>Lisätietoja</button></td>
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

        </div>

    )

}

export { Mokit, };