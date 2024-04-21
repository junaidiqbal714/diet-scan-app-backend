const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const { Calorie } = require("../../models/calorie");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const calorie_graph = async (req, res) => {
  try {
    let total_calories = 0;
    const today = moment().format("YYYY-MM-DD");
    const calories = await Calorie.aggregate([
      {
        $match: {
          user_id: new ObjectId(req.user._id),
          date: new Date(today),
        },
      },
      { $group: { _id: null, total_calories: { $sum: "$calories" } } },
      { $project: { total_calories: 1 } },
    ]);

    if (calories?.length > 0) {
      total_calories = calories[0].total_calories;
    }

    res.status(200).json({
      code: 200,
      message: "Calories list fetched successfully for graph",
      total_calories,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = calorie_graph;
