const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const topicRouter = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/topic", topicRouter);

app.use((error, req, res, next) => {
  return res.status(error.statusCode).send({
    message: error.message,
  });
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log(`listening on port ${process.env.PORT}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
