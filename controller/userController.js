const { Op, Sequelize } = require("sequelize");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const getAllUser = catchAsync(async (req, res, next) => {
  const users = await user.findAndCountAll({
    where: {
      userType: {
        [Op.ne]: "0",
      },
    },
    attributes: { exclude: ["password"] },
  });
  return res.status(200).json({
    status: "success",
    data: users,
  });
});

module.exports = { getAllUser };
