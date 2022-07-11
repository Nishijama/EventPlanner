const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Show guest list");
})

router.get('/edit', (req, res) => {
    res.send("Edit guest list");
})

module.exports = router;