const BadRequestError = require("../errors/bad-request.js");
const NotFoundError = require("../errors/not-found.js");
const Job = require("../models/Job.js");
const { StatusCodes } = require("http-status-codes");

const getJobs = async (req, res) => {
  const { user } = req;
  const { limit, skip } = req.params;

  const jobs = await Job.find({ createdBy: user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJobById = async (req, res) => {
  const { user } = req;
  const { limit, skip, id: jobId } = req.params;

  const jobs = await Job.findOne({ _id: jobId, createdBy: user.userId });

  if (!jobs) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const addJob = async (req, res) => {
  const { company, position } = req.body;
  const { user } = req;

  const job = await Job.create({ company, position, createdBy: user.userId });

  res.status(StatusCodes.CREATED).json({ data: job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Company or position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position }
  );

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getJobs, getJobById, addJob, updateJob, deleteJob };
