const { Weight, validateWeight } = require("../../models/weight");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const add_weight = async (req, res) => {
  try {
    // console.log("req.body: ", req.body);
    const { error } = validateWeight(req.body);
    if (error)
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/\"/g, ""),
      });

    let weight = new Weight({
      user_id: req.user._id,
      weight: req.body.weight,
    });
    weight = await weight.save();

    if (!weight) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to log weight" });
    }

    res.status(200).json({
      code: 200,
      message: "Weight logged successfully",
      weight,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = add_weight;
