const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const add_calories = require("../handlers/calorie/add_calories");
const list_calories = require("../handlers/calorie/list_calories");
const calories_graph = require("../handlers/calorie/calories_graph");

router.post("/add_calories", [auth], add_calories);
router.get("/list_calories", [auth], list_calories);
router.get("/calories_graph", [auth], calories_graph);

module.exports = router;
