import { useEffect, useState } from "react";

const Mokit = () => {

    const [haku, setHaku] = useState(true);
    const [mokit, setMokit] = useState([]);
    const [numero, setNumero] = useState("");
    const [spvm, setSpvm] = useState("");
    const [lpvm, setLpvm] = useState("");
    const [paikat, setPaikat] = useState([]);
    const [paikka, setPaikka] = useState("");



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

        }
        fetchmokit();

    }, [haku]);

    const haeButtonclicked = () => {
        console.log("klikattu");
        setHaku(!haku);
    }


    return (
        <div>
            <p></p>
            <label> PostiNro
                <input onChange={(e) => setNumero(e.target.value)}>
                </input>
            </label>
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
            <label>Saapumispvm(vvvv-kk-pp)
                <input onChange={(e) => setSpvm(e.target.value)}>
                </input>
            </label>
            <label>Lähtöpvm(vvvv-kk-pp)
                <input onChange={(e) => setLpvm(e.target.value)}>
                </input>
            </label>
            <button onClick={(e) => haeButtonclicked(e)}>Hae</button>
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
                                <td><button>Varaa</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </div>

    )

}

export { Mokit, };