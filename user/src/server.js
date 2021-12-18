const express = require("express");
const mongoose = require("mongoose");
const { updateUserStatusConsumer } = require("./consumer.js");
const { seedAdminAccountProducer } = require("./producer.js");
const userRoute = require("./routes/index.js");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/test", (req, res, next) => {
  try {
    updateUserStatusProducer({
      a: 1,
      b: 2,
    });
    res.send("asdasdasdasd");
  } catch (error) {
    console.log(error);
  }
});

app.use(userRoute);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
  try {
    mongoose.connect(process.env.MONGO_DB);
    seedAdminAccountProducer();
  } catch (error) {
    console.log(error);
  }
});
