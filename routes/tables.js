const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("All tables");
})

router.get('/1', (req, res) => {
    res.send("First table");
})

module.exports = router;