const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const db = require("./database/db")

server.use(express.static("public"))

server.use(express.urlencoded({extended: true}))

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
}) 

server.get("/create-point", (req, res) => {

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    console.log(req.body)

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        )   VALUES (?,?,?,?,?,?,?)
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items    
    ]

    function afterInsertData(err) {
        if (err) {
            return res.send("Erro no Cadastro! ")
        }
        console.log("Cadastro com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true })
    }

    db.run(query, values, afterInsertData)
 
})

server.get("/search-results", (req, res) => {

    const search = req.query.search

    if (search == "") {
        return res.render("search-results.html", {total: 0})
    }


    function registers(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        return res.render("search-results.html", {places: rows, total})
        console.log(rows)
    }
    
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%' `, registers)

})

server.listen(3000)