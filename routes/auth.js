const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const db = require("../lib/db");
const bcrypt = require("bcrypt");
const ftn = require("../lib/ftn");

module.exports = function (passport) {
  router.get("/fail", function (req, res) {
    res.json("아이디 또는 비밀번호가 틀립니다");
  });

  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/server",
      failureRedirect: "/server/auth/fail",
      // successFlash: true,
      // failureFlash: true,
    })
  );

  router.post("/register_process", function (req, res) {
    var post = req.body;
    var email = post.email;
    var password = post.password;
    var displayName = post.displayName;

    db.query("SELECT id FROM users WHERE email=?", [email], function (err, overlap) {
      if (err) {
        throw err;
      }
      if (!ftn.isEmpty(overlap)) {
        res.json("이메일이 존재합니다");
        return false;
      }
      db.query("SELECT id FROM users WHERE displayName=?", [displayName], function (
        err2,
        overlap2
      ) {
        if (err2) {
          throw err2;
        }
        if (!ftn.isEmpty(overlap2)) {
          res.json("닉네임이 존재합니다");
          return false;
        }
        bcrypt.hash(password, 10, function (err3, hash) {
          var user = {
            id: shortid.generate(),
            email: email,
            password: hash,
            displayName: displayName,
          };
          db.query(
            "INSERT INTO users(id, email, password, displayName) VALUES(?,?,?,?)",
            [user.id, user.email, user.password, user.displayName],
            function (err4) {
              if (err4) {
                throw err4;
              }
              req.login(user, function (err5) {
                if (err5) {
                  return next(err5);
                }
                res.json({ displayName: displayName });
              });
            }
          );
          db.query("UPDATE counting set userCount = userCount + 1 where id=1", function (err) {
            if (err) {
              throw err;
            }
          });
        });
      });
    });
  });

  router.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
      res.json("로그아웃");
    });
    // req.session.save(function () {
    //   res.redirect("/");
    // });
  });
  return router;
};
