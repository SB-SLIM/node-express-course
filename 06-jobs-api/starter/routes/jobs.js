const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  addJob,
} = require("../controllers/jobs.js");
const auth = require("../middleware/authentication.js");

router.route("/").get(getJobs);
router.route("/").post(addJob);
router.route("/:id").get(getJobById);
router.route("/:id").patch(updateJob);
router.route("/:id").delete(deleteJob);

module.exports = router;
