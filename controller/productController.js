const { application } = require("express");
const project = require("../db/models/project");
const user = require("../db/models/user");
const APPError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const newProject = await project.create({
    title: body.title,
    // isFeatured: body.isFeatured,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: userId,
  });

  return res.status(201).json({
    status: "success",
    data: newProject,
  });
});

const getallproject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await project.findAll({
    include: user,
    where: { createdBy: userId },
  });

  return res.json({
    status: "success",
    data: result,
  });
});

const getProjectById = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const result = await project.findByPk(projectId, { include: user });
  if (!result) {
    return next(new APPError("Invaild project id", 401));
  }
  return res.json({
    status: "success",
    data: result,
  });
});

const updateProjectById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;

  const result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });

  if (!result) {
    return next(new APPError("Invaild project id", 401));
  }

  result.title = body.title;
  // isFeatured: body.isFeatured,
  result.productImage = body.productImage;
  result.price = body.price;
  result.shortDescription = body.shortDescription;
  result.description = body.description;
  result.productUrl = body.productUrl;
  result.category = body.category;
  result.tags = body.tags;

  const updatedResult = await result.save();

  return res.json({
    status: "success",
    data: updatedResult,
  });
});

const deleteProjectById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;

  const result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });

  if (!result) {
    return next(new APPError("Invaild project id", 400));
  }
  await result.destroy();
  return res.json({
    status: "success",
    data: "Record deleted successfully",
  });
});

module.exports = {
  createProject,
  getallproject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
