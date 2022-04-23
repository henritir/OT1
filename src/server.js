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
    database : 'vn',
    dateStrings : true
});

// REST api -> GET 
app.get('/api/vn', (request, response) => {

    const query = "SELECT mokki.mokki_id, mokki.mokkinimi, mokki.postinro FROM mokki WHERE 1=1";
    

    let mokit = [];
console.log("asiakas alkaa")
    connection.query(query, function(error, result, fields){
        if ( error )
        {
            console.log("Virhe", error);
            response.statusCode = 400;
            response.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            //console.log(":" , result);
            console.log("asiakas loppuu")
            response.statusCode = 200;   
            //response.json(result)
            mokit = result;


            console.log("asiakastyyppi alkaa")
            connection.query("SELECT * from varaus", function(error, result, fields){
                if ( error )
                {
                    console.log("Virhe", error);
                    response.statusCode = 400;
                    response.json({status : "NOT OK", msg : "Tekninen virhe!"});
                }
                else
                {
                    //console.log("R (ASTY):" , result);
                    console.log("asiakastyyppi loppuu:", mokit);
                    response.statusCode = 200;   
                    response.json({mokit : mokit, varaukset: result});
                }
            });

            
        

        }
    });

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