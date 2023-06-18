require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const connectDB = require("./db/connect.js");

//middleware
const authenticateUser = require("./middleware/authentication.js");


//routers
const BASE_PATH_VERSION = "/api/v1";
const authRouter = require("./routes/auth.js");
const jobsRouter = require("./routes/jobs.js");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages

// routes
app.use(`${BASE_PATH_VERSION}/auth`, authRouter);
app.use(`${BASE_PATH_VERSION}/jobs`, authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URL;
const start = async () => {
  try {
    await connectDB(URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
