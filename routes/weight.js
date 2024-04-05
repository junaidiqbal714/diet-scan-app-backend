const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const add_weight = require("../handlers/weight/add_weight");
const list_weights = require("../handlers/weight/list_weights");
const weight_graph = require("../handlers/weight/weight_graph");

router.post("/add_weight", [auth], add_weight);
router.get("/list_weights", [auth], list_weights);
router.get("/weight_graph", [auth], weight_graph);

module.exports = router;
