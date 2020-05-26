const db = require("../lib/db");
router.get("/ex", function (req, res) {
  new Promise((resolve, reject) => {
    db.query("SELECT displayName FROM users", function (err, users) {
      if (err) {
        throw err;
      }
      console.log(users);
      if (users) {
        reject("중복");
        res.json("중복22");
        return false;
      } else {
      }
    });
  })
    .then((message) => {
      // console.log("Yay! " + message);
    })
    .catch((error) => {
      console.log("error! " + error);
      // res.json(error);
    });
  if (res.json) {
    return false;
  }
  new Promise((resolve, reject) => {
    db.query("SELECT displayName FROM users", function (err, users) {
      if (err) {
        throw err;
      }
      console.log(users);
      if (users) {
        reject("중복");
        res.json("중복33");
        return false;
      } else {
      }
    });
  })
    .then((message) => {
      // console.log("Yay! " + message);
    })
    .catch((error) => {
      console.log("error! " + error);
      res.json(error);
    });
  if (res.json) {
    return false;
  }
  res.json("HD");
});
