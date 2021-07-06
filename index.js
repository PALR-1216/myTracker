const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const body_parse = require('body-parser')
const path = require('path')
const sqlite = require('sqlite3').verbose()



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

var urlencodedParser = body_parse.urlencoded({extended:false});


let db = new sqlite.Database('tracker.db', sqlite.OPEN_READWRITE, (err) =>{
    if(err) {
        throw err;
    }

    else{
        console.log("Database connected")

    }
})

db.serialize(() =>{
    db.each(`select * from track`, (err, row) =>{

        if(err) {
            throw err;
        }

        // console.log(row.hours + "\t" + row.total_ganado)
    })
})




app.get('/', (req,res)=>{
    var sql = 'select sum(hours) as hours, sum(total_ganado) as total_ganado from track'
    db.get(sql, [], (err, rows) =>{
        var data = {
            total_hours: rows.hours,
            total:rows.total_ganado
        }

        res.render('home', {model:data})
        console.log(data)
    })

    
   
})

app.get('/addview',(req,res) =>{
    res.render('addData')
})

app.post('/add', urlencodedParser, (req,res) =>{
    // res.send(req.body.hours)
    var hours = req.body.hours;
    var sueldo = hours * 7.25;
    var total2 =parseFloat(sueldo).toFixed(2)
    
    
    db.run('insert into track (hours, total_ganado) values (?, ?)', [hours, total2], function(err){
        if(err) {
            console.log(err.message)
        }


        console.log(`A row has been inserted with rowid ${this.lastID} hours: ${hours} total ${sueldo}`)
    })
    res.render("saved")

})


app.get('/show', (req,res) =>{
    res.render("showData")
})


app.listen(3000 ,() =>{
    console.log("server running in port 3000")
})