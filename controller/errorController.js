const APPError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  res.status(statusCode).json({
    statusCode,
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }
  console.log(error.name, error.message, stack);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  // let error = "";
  // if (err.code === 5001) {
  //   error = new APPError();
  // }
  if (err.name === "JsonWebTokenError") {
    err = new APPError("Invalid token", 401);
  }
  if (err.name === "SequelizeValidationError") {
    err = new APPError(err.errors[0].message, 400);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new APPError(err.errors[0].message, 400);
  }
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
