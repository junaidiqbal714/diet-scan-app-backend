const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const add_weight = require("../handlers/weight/add_weight");
const list_weights = require("../handlers/weight/list_weights");

router.post("/add_weight", add_weight);

router.get("/list_weights", [auth], list_weights);

module.exports = router;
