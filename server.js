const express = require("express");
const app = express();

app.set("view engine", "ejs")

const tableRouter = require("./routes/tables")
const guestsRouter = require("./routes/guests")

app.use(express.static("public"))
app.use('/tables', tableRouter);
app.use('/guests', guestsRouter);

app.listen(3000)