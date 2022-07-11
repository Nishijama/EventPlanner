const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("All tables");
})
// dynamic routes using request paramenters
// put these at the bottom (will override static routes otherwise)
router
.route("/:tableNumber")
.get((req, res) => {
    res.send(`Get table number ${req.params.tableNumber}`);
})
.put((req, res) => {
    res.send(`Post table number ${req.params.tableNumber}`);
})
.delete((req, res) => {
    res.send(`Delete table number ${req.params.tableNumber}`);
})

module.exports = router;