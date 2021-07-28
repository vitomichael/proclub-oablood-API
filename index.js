require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const restResponse = require("express-rest-response");
const options = {
  showStatusCode: false,
  showDefaultMessage: false,
};

const db = require("./models");

const menuRouter = require("./routers/menuRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const rsRouter = require("./routers/rsRouter");
const pmiRouter = require("./routers/pmiRouter");

app.use(restResponse(options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", menuRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/rumah-sakit", rsRouter);
app.use("/pmi", pmiRouter);

app.use((req, res, next) => {
  const err = new Error("");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.rest.notFound("End point not found");
  } else {
    res.rest.serverError(err.message || "Internal server error");
  }
});

const dbOptions = {
  alter: true,
  // force: true,
};

const port = process.env.PORT || 5000;

db.sequelize.sync(dbOptions).then(() => {
  app.listen(port, () => {
    console.log(`listening on: http://localhost:${port}`);
  });
});
