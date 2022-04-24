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

// REST api -> GET 
app.get('/api/vn', (request, response) => {

    const query = "SELECT m.mokki_id, m.mokkinimi, m.postinro, p.toimipaikka as toimipaikka, m.katuosoite, m.henkilomaara, m.hinta  FROM mokki m join posti p on p.postinro = m.postinro WHERE 1=1";


    let mokit = [];
    let varaukset = [];
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
                    response.json({ mokit: mokit, varaukset: varaukset, paikat: result });
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

console.log("Serveri tulille nyt");

module.exports = app