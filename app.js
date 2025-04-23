require("dotenv").config({ path: `${process.cwd()}/.env` });
const catchAsync = require("./utils/catchAsync");
const express = require("express");

const authRouter = require("./route/authRoute");
const projectRouter = require("./route/projectRoute");
const userRotes = require("./route/userRoutes");
const globalErrorHandler = require("./controller/errorController");
const APPError = require("./utils/appError");

const app = express();

app.use(express.json()); // Middleware to parse JSON(parsing of incoming JSON request bodies)

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "REST Api are working",
  });
});

//all routes  will be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRotes);
//if not router findout  it this router will show
// app.use("*", (req, res, next) => {
//   res.status(404).json({
//     status: "fail",
//     message: "Route not found",
//   });
// });

app.use(
  // Error handling using Wrapper functions
  "*",
  catchAsync(async (req, res, next) => {
    throw new APPError(`Can't find ${req.originalUrl} on this server`, 404);
    // throw new APPError("This is error from server ");
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log("server up and running", PORT);
});
