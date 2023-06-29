require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");

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
app.use("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each Ip to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send(`<h1>Jobs API</h1> <a href="/api-docs">Documentation</a>`)
})

app.use("/app-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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
