const db = require("../lib/db");
const bcrypt = require("bcrypt");
// const shortid = require("shortid");

module.exports = function (app) {
  var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy; //session다음에 넣어야 돼
  // FacebookStrategy = require("passport-facebook").Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    console.log("serializeUser", user);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.query(`SELECT * FROM users WHERE id=?`, [id], function (err, user) {
      if (err) throw err;
      console.log("deserializeUser", id, user);
      done(null, user);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        console.log("LocalStrategy", email, password);
        db.query(`SELECT * FROM users WHERE email=?`, [email], function (err, user) {
          if (err) {
            throw err;
          }
          if (user[0]) {
            bcrypt.compare(password, user[0].password, function (err2, res) {
              if (err2) throw err2;
              if (res) {
                return done(null, user[0]);
              } else {
                return done(null, false);
              }
            });
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  //   var facebookCredentials = require("../config/facebook.json");
  //   facebookCredentials.profileFields = ["id", "emails", "name", "displayName"];
  //   passport.use(
  //     new FacebookStrategy(facebookCredentials, function (accessToken, refreshToken, profile, done) {
  //       console.log("FacebookStrategy", accessToken, refreshToken, profile);
  //       var email = profile.emails[0].value;
  //       var user = db.get("users").find({ email: email }).value();
  //       if (user) {
  //         user.facebookId = profile.id;
  //         db.get("users").find({ email: email }).assign(user).write();
  //       } else {
  //         user = {
  //           id: shortid.generate(),
  //           email: email,
  //           displayName: profile.displayName,
  //           facebookId: profile.id,
  //         };
  //         db.get("users").push(user).write();
  //       }
  //       done(null, user);
  //       // User.findOrCreate(..., function(err, user) {
  //       //   if (err) { return done(err); }
  //       //   done(null, user);
  //       // });
  //     })
  //   );
  //   app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
  //   app.get(
  //     "/auth/facebook/callback",
  //     passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/auth/login" })
  //   );
  return passport;
};
