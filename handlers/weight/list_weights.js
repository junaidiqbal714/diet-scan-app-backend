const { Weight } = require("../../models/weight");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const list_weights = async (req, res) => {
  try {
    const weights = await Weight.find({ user_id: req.user._id }).lean();

    res.status(200).json({
      code: 200,
      message: "Weight list fetched successfully",
      weights,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = list_weights;
