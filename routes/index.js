var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  login = (req) => {
    if (req.user) {
      return true;
    } else {
      false;
    }
  };

  id = (req) => {
    if (req.user) {
      return req.user[0].id;
    } else {
      return false;
    }
  };

  displayName = (req) => {
    if (req.user) {
      return req.user[0].displayName;
    } else {
      return false;
    }
  };

  res.json({
    login: login(req),
    id: id(req),
    displayName: displayName(req),
  });
});

module.exports = router;
