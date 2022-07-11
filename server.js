const express = require("express");
const app = express();

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index");
})

const tableRouter = require("./routes/tables")
const guestsRouter = require("./routes/guests")

app.use('/tables', tableRouter);
app.use('/guests', guestsRouter);

app.listen(3000)