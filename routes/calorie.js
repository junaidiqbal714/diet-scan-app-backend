const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const add_calories = require("../handlers/calorie/add_calories");
const list_calories = require("../handlers/calorie/list_calories");
const calorie_graph = require("../handlers/calorie/calorie_graph");

router.post("/add_calories", [auth], add_calories);
router.get("/list_calories", [auth], list_calories);
router.get("/calorie_graph", [auth], calorie_graph);

module.exports = router;
