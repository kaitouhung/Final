const express = require("express");
const verifyToken = require("../middleware/auth/authenticate.js");
const publicRouter = require("./public/index.js");
const secretRouter = require("./secret/index.js");

const router = express.Router();

router.use("/users/public", publicRouter);
router.use("/users/secret", verifyToken, secretRouter);

module.exports = router;
