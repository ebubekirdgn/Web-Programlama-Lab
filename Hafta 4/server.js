var express = require('express')
var path = require('path')
const bodyParser = require("body-parser");
var app = express()
const sql = require('mssql')
const config = {
    user: 'deneme',
    password: 'deneme',
    server: "DESKTOP-T2AUIGF\\SQLEXPRESS",
    database: 'Sirket',
    options: {
        encrypt: false
    }
}
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// index
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/list', function (req, res) {
    getAllPerson().then(result => {
        res.json({ persons: result });
    })
});

// ekle
app.get('/ekle', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'ekle.html'));
});

app.post('/ekle', function (req, res, next) {
    var adi = req.body.adi
    var soyadi = req.body.soyadi
    var telno = req.body.telno
    var email = req.body.email
    createPerson(adi, soyadi, telno,email).then(result => {
            res.json({success:result})
    })

});
// sil
app.post('/sil', function (req, res, next) {
    var id = req.body.id
    deletePerson(id)
});

app.listen(8080)

// database operations
function getAllPerson() {
    sql.close()
    return sql.connect(config).then(pool => {
        return pool.request().query('select * from Kisiler')
    }).then(result => {
        return result.recordset
    }).catch(err => {
        console.error(err);
        return err
    })
}

function getPerson(id) {
    sql.close()
    return sql.connect(config).then(pool => {
        return pool.request()
            .input('id', sql.Int, id)
            .query('select * from Kisiler where Id=@id')
    }).then(result => {
        return result.recordset
    }).catch(err => {
        console.error(err);
        return err
    })
}

function createPerson(adi, soyadi, telno,email) {
    sql.close()
    return sql.connect(config).then(pool => {
        return pool.request()
            .input('adi', sql.NVarChar, adi)
            .input('soyadi', sql.NVarChar, soyadi)
            .input('telno', sql.NVarChar, telno)
            .input('email', sql.NVarChar, email)
            .query('insert into Kisiler (Adi, Soyadi, Numarasi,Email) values (@adi, @soyadi ,@telno,@email)')
    }).then(() => {
        return true
    }).catch(err => {
        console.error(err);
        return false
    })
}

function deletePerson(id) {
    sql.close()
    return sql.connect(config).then(pool => {
        return pool.request()
            .input('id', sql.Int, id)
            .query("delete from Kisiler where Id=@id")
    }).then(() => {
        return true
    }).catch(err => {
        console.error(err)
        return false
    })
}
 