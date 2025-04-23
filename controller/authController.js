const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const APPError = require("../utils/appError");

//method of json
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JET_EXPIRES_IN,
  });
};
const signup = catchAsync(async (req, res, next) => {
  // CatchAsync_is_From untils( Error )  which is Wrapper functions
  const body = req.body;

  if (!["1", "2"].includes(body.userType)) {
    throw new APPError("Invaild user Type", 400);
    // return res.status(400).json({
    //   status: "fail",
    //   message: "Invaild user Type",
    // });
  }
  const newUser = await user.create({
    userType: body.userType,
    name: body.name,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new APPError("Failed to create the user", 400));
    // return res.status(400).json({
    //   status: "success",
    //   message: "",
    // });
  }
  const result = newUser.toJSON(); //object to json

  delete result.password;
  delete result.deleteAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new APPError("please provide email and password", 400));
    // return res.status(400).json({
    //   status: "fails",
    //   message: "please provide email and password",
    // });
  }
  const result = await user.findOne({ where: { email } });
  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new APPError("Incorrect email or password", 400));
    // return res.status(401).json({
    //   status: "fail",
    //   message: "Incorrect email or password",
    // });
  }
  const token = generateToken({
    id: result.id,
  });
  return res.json({
    status: "sucess",
    token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";

  // 1. Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new APPError("Please login to get access", 401));
  }

  // 2. Verify token
  let tokenDetail;
  try {
    tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new APPError("Invalid or expired token", 401));
  }

  // 3. Find user in DB
  const freshUser = await user.findByPk(tokenDetail.id); // assumes `id` is in the token payload

  if (!freshUser) {
    return next(new APPError("User no longer exists", 400));
  }

  req.user = freshUser;
  next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(new APPError("You don't have permission to perform", 403));
    }
    return next();
  };
  return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };
