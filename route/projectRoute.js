const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getallproject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} = require("../controller/productController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("1"), createProject)
  .get(authentication, restrictTo("1"), getallproject);

router
  .route("/:id")
  .get(authentication, restrictTo("1"), getProjectById)
  .patch(authentication, restrictTo("1"), updateProjectById)
  .delete(authentication, restrictTo("1"), deleteProjectById);

module.exports = router;
