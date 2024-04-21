const moment = require("moment");
const { Calorie, validateCalories } = require("../../models/calorie");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const add_calories = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateCalories(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    let final_food_calories = [];

    for (let i = 0; i < req.body.food_calories.length; i++) {
      const item = req.body.food_calories[i];
      let calorie = new Calorie({
        user_id: req.user._id,
        food: item.food,
        calories: item.calories,
        date: moment(moment().format("YYYY-MM-DD")),
      });
      calorie = await calorie.save();
      if (!calorie) {
        return res
          .status(400)
          .json({ code: 400, message: "Unable to log calorie" });
      }
      final_food_calories.push(calorie);
    }

    res.status(200).json({
      code: 200,
      message: "Calories are logged successfully",
      final_food_calories,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = add_calories;
