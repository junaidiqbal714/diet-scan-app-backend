const moment = require("moment");
const { Calorie } = require("../../models/calorie");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const list_calories = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const calories = await Calorie.find({
      user_id: req.user._id,
      date: new Date(today),
    }).lean();

    res.status(200).json({
      code: 200,
      message: "Calories list fetched successfully",
      calories,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = list_calories;
