const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Weight } = require("../../models/weight");
const { CATCH_BAD_REQUEST } = require("../../utils/utils");

const weight_graph = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const weights = await Weight.aggregate([
      {
        $match: {
          user_id: new ObjectId(req.user._id),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          weight: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          average_weight: { $avg: "$weight" },
        },
      },
      { $project: { _id: 0, month: "$_id.month", average_weight: 1 } },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json({
      code: 200,
      message: "Weight list fetched successfully for graph",
      weights,
    });
  } catch (ex) {
    CATCH_BAD_REQUEST(res, ex);
  }
};

module.exports = weight_graph;
