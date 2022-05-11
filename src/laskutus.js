import { useEffect, useState } from "react";

const Laskutus = () => {
  const [laskuid, setLaksuid] = useState("");
  const [varausid, setVarausid] = useState("");
  const [summa, setSumma] = useState("");
  const [alv, setAlv] = useState("");
  const [laskut, setLaskut] = useState([]);
  const [haku, setHaku] = useState(true);
  const [varaukset, setVaraukset] = useState([]);
  const [lisays, setLisays] = useState("");
  const [poista, setPoista] = useState("");



  useEffect(() => {
    const fetchpoista = async () => {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      await fetch(
        "http://localhost:3004/api/vn/laskupoista/" + poista,
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

  useEffect(() => {
    const fetchLaskut = async () => {
      let response = await fetch("http://localhost:3004/api/vn/lasku?");
      let c = await response.json();
      setLaskut(c);
    };

    fetchLaskut();
  }, [haku]);

  useEffect(() => {
    const fetchVaraukset = async () => {
      let response = await fetch("http://localhost:3004/api/vn/varaus?");
      let c = await response.json();
      setVaraukset(c);
    };

    fetchVaraukset();
  }, [haku]);

  useEffect(() => {
    const fetchlisaa = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        lasku_id: laskuid,
        varaus_id: varausid,
        summa: summa,
        alv: alv,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("http://localhost:3004/api/vn/addlasku/", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      setHaku(!haku);
    };

    if (lisays != "") {
      fetchlisaa();
      setLisays("");
    }
  }, [lisays]);

  const lisaaButtonClicked = () => {
    if (laskuid != "" && varausid != "" && summa != "" && alv != "") {
      setLisays("lisäys");
    }
  };

  return (
    <div>
      <div className="header">
        <label>
          {" "}
          LaskuID
          <input
            type="text"
            value={laskuid}
            onChange={(e) => setLaksuid(e.target.value)}
          ></input>
        </label>
        <label>
          {" "}
          VarausID
          <select
            value={varausid}
            onChange={(e) => setVarausid(e.target.value)}
          >
            <option value="">--valitse--</option>
            {varaukset.map((a, i) => {
              return (
                <option key={i} value={a.varaus_id}>
                  {a.varaus_id}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          {" "}
          Summa
          <input
            type="text"
            value={summa}
            onChange={(e) => setSumma(e.target.value)}
          ></input>
        </label>
        <label>
          Alv
          <input
            type="text"
            value={alv}
            onChange={(e) => setAlv(e.target.value)}
          ></input>
        </label>

        <button onClick={() => lisaaButtonClicked()}>Lisää</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Lasku_ID</th>
              <th>Varaus_ID</th>
              <th>Summa</th>
              <th>ALV</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {laskut.map((a, i) => {
              return (
                <tr key={i}>
                  <td>{a.lasku_id}</td>
                  <td>{a.varaus_id}</td>
                  <td>{a.summa}</td>
                  <td>{a.alv}</td>
                  <td>
                    <button
                      value={a.lasku_id}
                      onClick={(e) => setPoista(e.target.value)}
                    >
                      Poista
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Laskutus };
