import { useEffect, useState } from "react";

const Raportit = () => {

    const [haku, setHaku] = useState(true);
    const [varaukset, setVaraukset] = useState([]);
    const [poista, setPoista] = useState("");

    useEffect(() => {
        const fetchVaraukset = async () => {
          let response = await fetch("http://localhost:3004/api/vn/varaus?");
          let c = await response.json();
          setVaraukset(c);
        };
    
        fetchVaraukset();
      }, [haku]);

      
  useEffect(() => {
    const fetchpoista = async () => {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      await fetch(
        "http://localhost:3004/api/vn/varauspoista/" + poista,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      setHaku(!haku);
    };

    if (poista != "") {
      fetchpoista();
    }
  }, [poista]);



    return(
        <div>
            <table>
                <thead>
                    <th>varaus_id</th>
                    <th>asiakas_id</th>
                    <th>mokki_id</th>
                    <th>varattu_pvm</th>
                    <th>vahvistus_pvm</th>
                    <th>varattu_alkupvm</th>
                    <th>varattu_loppupvm</th>
                </thead>
                <tbody>
                {varaukset.map((s, i) => {
                return <tr>
                    <td>{s.varaus_id}</td>
                    <td>{s.asiakas_id}</td>
                    <td>{s.mokki_mokki_id}</td>
                    <td>{s.varattu_pvm}</td>
                    <td>{s.vahvistus_pvm}</td>
                    <td>{s.varattu_alkupvm}</td>
                    <td>{s.varattu_loppupvm}</td>
                    <td>
                    <button
                      value={s.varaus_id}
                      onClick={(e) => setPoista(e.target.value)}
                    >
                      Poista
                    </button>
                  </td>
                </tr>
    })}
                </tbody>
            </table>
            
        </div>
    )

}

export {Raportit};
