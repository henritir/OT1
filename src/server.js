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

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

/************************************/
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',      // ÄLÄ KOSKAAN käytä root:n tunnusta tuotannossa
    password : 'root',
    database : 'customer',
    dateStrings : true
});

// REST api -> GET 
app.get('/api/customer', (req,res) => {
    // localhost:3000/api/customer
    
    console.log("/asiakas. REQ:", req.query);

    let query= "SELECT asiakas.AVAIN,asiakas.NIMI,asiakas.OSOITE,asiakas.POSTINRO,asiakas.POSTITMP,asiakas.LUONTIPVM,asiakas.ASTY_AVAIN,asiakas.Tunnus,asiakas.Salasana,asiakastyyppi.SELITE as ASTY_SELITE FROM asiakas INNER JOIN asiakastyyppi ON asiakas.ASTY_AVAIN=asiakastyyppi.AVAIN WHERE 1=1"

    let nimi = req.query.nimi;

    let osoite = req.query.osoite;

    let asty = req.query.asty;

    if (nimi != undefined) {

        query = query + " AND nimi LIKE " + "'" + nimi + "%'";
    }

    if (osoite != undefined) {
        query = query + " AND osoite LIKE" + "'" + osoite + "%'";
    }

    if (asty != undefined) {
        query = query + " AND asty_avain LIKE" + "'" + asty + "%'";
    }

    //let query = "SELECT * from asiakastyyppi WHERE 1=1 AND nimi='x' and osoite='y'";

    console.log("query:" + query);
    connection.query(query, function(error, result, fields){

        console.log("done")
        if ( error || result == "" )
        {
            console.log("Virhe", error);
            res.json({status : "NOT OK", message : "Virheellinen haku", data : result});
        }
        else
        {
            res.statusCode = 200;
            console.log(result);
            res.json({status : "OK", message : "", data : result});
        }
    });

    console.log("Kysely tehty")
});

/******************************* */

app.get('*',function(req, res){

    let query = "SELECT COUNT(*) as nimet FROM asiakas";

    connection.query(query,function(error,result,fields) {

        console.log(result[0].nimet);

        let maara = result[0].nimet;

        console.log("R:", req.url);
        res.statusCode = 404;
        res.json({message : "Osoite oli virheellinen:" + req.url, count : maara })

    }) 
});

console.log("Serveri tulille nyt");

module.exports = app