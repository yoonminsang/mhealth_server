const express = require("express");
const app = express();

const passport = require("../lib/passport")(app);

const indexRouter = require("./index");
const authRouter = require("./auth")(passport);
const communityRouter = require("./community");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/community", communityRouter);

module.exports = app;
