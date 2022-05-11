// ASENNA ensin tarvittaessa:
// npm install express
// npm install mysql

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const { json } = require('express/lib/response');

app.use(bodyParser.json());

console.log("Aloitetaan");

var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

/************************************/
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // ÄLÄ KOSKAAN käytä root:n tunnusta tuotannossa
    password: 'root',
    database: 'vn',
    dateStrings: true
});
app.get('/api/vn/alue', (request, response) => {

    const query = "SELECT alue_id, nimi from alue ORDER BY alue_id ASC";


    let alueet = [];
    console.log("alueet alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            alueet = result;
            response.json(alueet);
        }
    });

});
app.get('/api/vn/palvelu', (request, response) => {

    const query = "SELECT palvelu_id, alue_id, nimi, tyyppi, kuvaus, hinta, alv from palvelu";


    let palvelut = [];
    console.log("alueet alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            palvelut = result;
            response.json(palvelut);
        }
    });

});
app.get('/api/vn/posti', (request, response) => {

    const query = "SELECT postinro, toimipaikka from posti";


    let posti = [];
    console.log("alueet alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            posti = result;
            response.json(posti);
        }
    });

});
app.post('/api/vn/addalue', (req,res) => {
    
    console.log("/vn/addalue. BODY:", req.body);

    let alue_id = req.body.alue_id;
    let nimi = req.body.nimi; 
    
    let query = "INSERT INTO alue (alue_id, nimi) VALUES (?, ?) ON DUPLICATE KEY UPDATE nimi = VALUES(nimi)";

    console.log("query:" + query);
    connection.query(query, [alue_id, nimi], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            res.json({alue_id : alue_id,  nimi : nimi})
        }
    });
});
app.post('/api/vn/addpalvelu', (req,res) => {
    
    console.log("/vn/addalue. BODY:", req.body);

    let palvelu_id = req.body.palvelu_id;
    let alue_id = req.body.alue_id;
    let nimi = req.body.nimi;
    let tyyppi = req.body.tyyppi;
    let kuvaus = req.body.kuvaus;
    let hinta = req.body.hinta;
    let alv = req.body.alv; 
    
    let query = "INSERT INTO palvelu (palvelu_id, alue_id, nimi, tyyppi, kuvaus, hinta, alv) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ";
    query = query + "alue_id = VALUES(alue_id),nimi = VALUES(nimi),tyyppi = VALUES(tyyppi),kuvaus = VALUES(kuvaus),hinta = VALUES(hinta),alv = VALUES(alv)";
    console.log("query:" + query);
    connection.query(query, [palvelu_id, alue_id, nimi, tyyppi, kuvaus, hinta, alv], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            res.json({palvelu_id : palvelu_id, alue_id : alue_id, nimi : nimi, tyyppi : tyyppi, kuvaus : kuvaus, hinta: hinta, alv: alv})
        }
    });
});
app.post('/api/vn/addposti', (req,res) => {
    
    console.log("/vn/addposti. BODY:", req.body);

    let postinro = req.body.postinro;
    let toimipaikka = req.body.toimipaikka; 
    
    let query = "INSERT INTO posti (postinro, toimipaikka) VALUES (?, ?) ON DUPLICATE KEY UPDATE toimipaikka = VALUES(toimipaikka)";

    console.log("query:" + query);
    connection.query(query, [postinro,toimipaikka], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            res.json({postinro : postinro,  toimipaikka : toimipaikka})
        }
    });
});
app.delete('/api/vn/alue/poista/:alue_id', (req,res) => {

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let alue_id = req.params.alue_id;
    
    let query = "DELETE FROM alue where alue_id = ? ";

    console.log("query:" + query);
    connection.query(query, [alue_id], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});
app.delete('/api/vn/palvelu/poista/:palvelu_id', (req,res) => {

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let palvelu_id = req.params.palvelu_id;
    
    let query = "DELETE FROM palvelu where palvelu_id = ? ";

    console.log("query:" + query);
    connection.query(query, [palvelu_id], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});
app.delete('/api/vn/posti/poista/:postinro', (req,res) => {

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let postinro = req.params.postinro;
    
    let query = "DELETE FROM posti where postinro = ? ";

    console.log("query:" + query);
    connection.query(query, [postinro], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});
// REST api -> GET 
app.get('/api/vn/mokkidata', (request, response) => {

    const query = "SELECT m.mokki_id, m.mokkinimi, m.postinro, p.toimipaikka as toimipaikka, m.katuosoite, m.henkilomaara, m.hinta, m.kuvaus, m.varustelu  FROM mokki m join posti p on p.postinro = m.postinro WHERE 1=1";


    let mokit = [];
    let varaukset = [];
    let asiakkaat = [];
    console.log("asiakas alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            mokit = result;


            console.log("asiakastyyppi alkaa")
            connection.query("SELECT * from varaus", function (error, result, fields) {
                if (error) {
                    console.log("Virhe", error);
                    response.statusCode = 400;
                    response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
                }
                else {
                    //console.log("R (ASTY):" , result);
                    console.log("asiakastyyppi loppuu:", mokit);
                    response.statusCode = 200;
                    varaukset = result;
                }
            });

            connection.query("SELECT * from asiakas", function (error, result, fields) {
                if (error) {
                    console.log("Virhe", error);
                    response.statusCode = 400;
                    response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
                }
                else {
                    //console.log("R (ASTY):" , result);
                    console.log("asiakastyyppi loppuu:", mokit);
                    response.statusCode = 200;
                    asiakkaat = result;
                }
            });

            connection.query("SELECT DISTINCT toimipaikka from posti", function (error, result, fields) {
                if (error) {
                    console.log("Virhe", error);
                    response.statusCode = 400;
                    response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
                }
                else {
                    //console.log("R (ASTY):" , result);
                    console.log("asiakastyyppi loppuu:", mokit);
                    response.statusCode = 200;
                    response.json({ mokit: mokit, varaukset: varaukset,asiakkaat: asiakkaat, paikat: result });
                }
            });


        }
    });

});

app.post('/api/vn/varaa', (req,res) => {
    
    console.log("/vn/varaus. BODY:", req.body);

    let asiakas_id = req.body.asiakas_id;
    let mokki_id = req.body.mokki_id;
    let varaus_pvm = req.body.varaus_pvm;
    let vahvistus = req.body.vahvistus;
    let a_pvm = req.body.a_pvm;
    let l_pvm = req.body.l_pvm;

    
    // Tarkista kentät -> jos virheitä -> palauta validi statuscode ja res.json    
    
    let query = "INSERT INTO varaus (asiakas_id, mokki_mokki_id, varattu_pvm, vahvistus_pvm, varattu_alkupvm, varattu_loppupvm) VALUES (?, ?, ?, ?, ?, ?) ";

    // ÄLÄ TEE näin! SQL Injection!
    //let query = "INSERT INTO asiakastyyppi (LYHENNE, SELITE) VALUES ('" + lyhenne + "', '" + selite + "')";

    console.log("query:" + query);
    connection.query(query, [asiakas_id, mokki_id, varaus_pvm, vahvistus, a_pvm, l_pvm], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            // Palautetaan juuri lisätty asiakastyyppi kutsujalle! HUOM! Kaikissa REST-rajapinnoissa EI välttämättä tehdä näin
            // ELI ei palauteta välttämättä mitään!
            res.json({asiakas_id : asiakas_id,  mokki_id: mokki_id, varaus_pvm : varaus_pvm, vahvistus : vahvistus, a_pvm :a_pvm, l_pvm : l_pvm})
        }
    });
});


/******************************* */



app.get('/api/vn/mokki/:mokki_id', (request, response) => {

    const query = "SELECT* FROM mokki WHERE mokki_id = ?;";

    let mokki_id = request.params.mokki_id;

    console.log("alueet alkaa")
    connection.query(query,[mokki_id], function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            response.json(result);
        }
    });

});

app.put('/api/vn/mokki/muokkaa/:mokki_id', (req,res) => {
    
    console.log("/asiakastyyppi. PARAMS:", req.params);
    console.log("/asiakastyyppi. BODY:", req.body);

    let postinro = req.body.postinro;
    let mokkinimi = req.body.mokkinimi;
    let katuosoite = req.body.katuosoite;
    let hinta = req.body.hinta;
    let kuvaus = req.body.kuvaus;
    let henkilomaara = req.body.henkilomaara;
    let varustelu = req.body.varustelu;


    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let mokki_id = req.params.mokki_id;
    
    let query = "UPDATE mokki SET postinro=?, mokkinimi=?, katuosoite=?, hinta=?, kuvaus=?, henkilomaara=?, varustelu =? where mokki_id = ? ";

    console.log("query:" + query);
    connection.query(query, [postinro,mokkinimi,katuosoite,hinta,kuvaus,henkilomaara,varustelu, mokki_id], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});

app.get('/api/vn/lisaamokki', (request, response) => {

    const query = "SELECT* FROM alue;";
    let alueet = [];
    let postinro = [];

    console.log("alueet alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            alueet = result;
        

        connection.query("SELECT* from posti", function (error, result, fields) {
            if (error) {
                console.log("Virhe", error);
                response.statusCode = 400;
                response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
            }
            else {
                //console.log("R (ASTY):" , result);
                //console.log("asiakastyyppi loppuu:", mokit);
                response.statusCode = 200;
                response.json({ alueet: alueet, postinro: result});
            }
        });
    }
    });

});


app.post('/api/vn/uusimokki', (req,res) => {
    
    console.log("/api/vn/uusimokki. BODY:", req.body);

    let alue = req.body.alue;
    let postinro = req.body.postinro;
    let nimi = req.body.nimi;
    let osoite = req.body.osoite;
    let hinta = req.body.hinta;
    let kuvaus = req.body.kuvaus;
    let hmaara = req.body.hmaara;
    let varustelu = req.body.varustelu;

    
    // Tarkista kentät -> jos virheitä -> palauta validi statuscode ja res.json    
    
    let query = "INSERT INTO mokki (alue_id, postinro, mokkinimi, katuosoite, hinta, kuvaus, henkilomaara, varustelu) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";

    // ÄLÄ TEE näin! SQL Injection!
    //let query = "INSERT INTO asiakastyyppi (LYHENNE, SELITE) VALUES ('" + lyhenne + "', '" + selite + "')";

    console.log("query:" + query);
    connection.query(query, [alue, postinro, nimi, osoite, hinta, kuvaus, hmaara, varustelu], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            // Palautetaan juuri lisätty asiakastyyppi kutsujalle! HUOM! Kaikissa REST-rajapinnoissa EI välttämättä tehdä näin
            // ELI ei palauteta välttämättä mitään!
            res.json({id: result.insertId, alue : alue,  postinro: postinro})
        }
    });
});

app.delete('/api/vn/mokki/poista/:mokki_id', (req,res) => {

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let mokki_id = req.params.mokki_id;
    
    let query = "DELETE FROM mokki where mokki_id = ? ";

    console.log("query:" + query);
    connection.query(query, [mokki_id], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});

app.get('/api/vn/asiakas/', (request, response) => {

    const query = "SELECT* FROM asiakas";


    console.log("alueet alkaa")
    connection.query(query, function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            response.json(result);
        }
    });

});

app.put('/api/vn/asiakas/muokkaa/:asiakas_id', (req,res) => {
    
    console.log("/asiakastyyppi. PARAMS:", req.params);
    console.log("/asiakastyyppi. BODY:", req.body);

    let postinro = req.body.postinro;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let lahiosoite = req.body.lahiosoite;
    let email = req.body.email;
    let puhelinnro = req.body.puhelinnro;
    

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let asiakas_id = req.params.asiakas_id;
    
    let query = "UPDATE asiakas SET postinro=?, etunimi=?, sukunimi=?, lahiosoite=?, email=?, puhelinnro=? where asiakas_id = ? ";

    console.log("query:" + query);
    connection.query(query, [postinro,etunimi,sukunimi,lahiosoite,email,puhelinnro, asiakas_id], function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});


app.get('/api/vn/asiakas/:asiakas_id', (request, response) => {

    const query = "SELECT* FROM asiakas WHERE asiakas_id = ?;";

    let asiakas_id = request.params.asiakas_id;

    console.log("asiakas alkaa")
    connection.query(query,[asiakas_id], function (error, result, fields) {
        if (error) {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;
            //response.json(result)
            response.json(result);
        }
    });

});

app.post('/api/vn/uusiasiakas', (req,res) => {
    
    console.log("/api/vn/uusiasiakas. BODY:", req.body);

    let postinro = req.body.postinro;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let lahiosoite = req.body.lahiosoite;
    let email = req.body.email;
    let puhelinnro = req.body.puhelinnro;

    
    // Tarkista kentät -> jos virheitä -> palauta validi statuscode ja res.json    
    
    let query = "INSERT INTO asiakas (postinro, etunimi, sukunimi, lahiosoite, email, puhelinnro) VALUES (?, ?, ?, ?, ?, ?) ";

    // ÄLÄ TEE näin! SQL Injection!
    //let query = "INSERT INTO asiakastyyppi (LYHENNE, SELITE) VALUES ('" + lyhenne + "', '" + selite + "')";

    console.log("query:" + query);
    connection.query(query, [postinro,etunimi,sukunimi,lahiosoite,email,puhelinnro], function(error, result, fields){
    //connection.query(query,  function(error, result, fields){

        if ( error )
        {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 201;
            // Palautetaan juuri lisätty asiakastyyppi kutsujalle! HUOM! Kaikissa REST-rajapinnoissa EI välttämättä tehdä näin
            // ELI ei palauteta välttämättä mitään!
            res.json({id: result.insertId})
        }
    });
});



app.get('*', function (req, res) {

    let query = "SELECT COUNT(*) as nimet FROM asiakas";

    connection.query(query, function (error, result, fields) {

        console.log(result[0].nimet);

        let maara = result[0].nimet;

        console.log("R:", req.url);
        res.statusCode = 404;
        res.json({ message: "Osoite oli virheellinen:" + req.url, count: maara })

    })
});

app.get("/api/vn/varaus", (request, response) => {
  const query = "SELECT * from varaus";

  let varaukset = [];
  connection.query(query, function (error, result, fields) {
    if (error) {
      console.log("Virhe", error);
      response.statusCode = 400;
      response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
    } else {
      console.log("asiakas loppuu");
      response.statusCode = 200;
      varaukset = result;
      response.json(varaukset);
    }
  });
});

app.get("/api/vn/lasku", (request, response) => {
  const query = "SELECT * from lasku ORDER BY summa ASC";

  let laskut = [];
  connection.query(query, function (error, result, fields) {
    if (error) {
      console.log("Virhe", error);
      response.statusCode = 400;
      response.json({ status: "NOT OK", msg: "Tekninen virhe!" });
    } else {
      console.log("asiakas loppuu");
      response.statusCode = 200;
      laskut = result;
      response.json(laskut);
    }
  });
});

app.post("/api/vn/addlasku", (req, res) => {
  let lasku_id = req.body.lasku_id;
  let varaus_id = req.body.varaus_id;
  let summa = req.body.summa;
  let alv = req.body.alv;

  let query =
    "INSERT INTO lasku (lasku_id, varaus_id, summa, alv) VALUES (?, ?, ?, ?)";

  console.log("query:" + query);
  connection.query(
    query,
    [lasku_id, varaus_id, summa, alv],
    function (error, result, fields) {
      if (error) {
        console.log("Virhe", error);
        res.statusCode = 400;
        res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
      } else {
        console.log("R:", result);
        res.statusCode = 201;
        res.json({
          lasku_id: lasku_id,
          varaus_id: varaus_id,
          summa: summa,
          alv: alv,
        });
      }
    }
  );
});

app.delete("/api/vn/laskupoista/:lasku_id", function (req, res) {
  const avain = req.params.lasku_id;

  let query = "DELETE FROM LASKU WHERE lasku_id=? ";

  connection.query(query, [avain], function (error, result, fields) {
    if (error) {
      console.log("Virhe", error);
      res.status = 400;
      res.json({ status: "NOT OK", message: error });
    } else {
      if (result.affectedRows > 0) {
        res.statusCode = 204;
        res.json();
      } else {
        res.statusCode = 404;
        res.json({
          status: "NOT OK",
          message: `Poistettavaa asiakasta ${avain} ei löydy`,
        });
      }
    }
  });
});

console.log("Serveri tulille nyt");

module.exports = app
