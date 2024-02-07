require("dotenv").config();
const passport = require("passport");
const { ObjectID } = require("mongodb");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

module.exports = function (app, myDataBase) {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      if (err) return console.error(err);
      done(null, doc);
    });
  });

  // passport.use(
  //   new LocalStrategy((username, password, done) => {
  //     myDataBase.findOne({ username: username }, (err, user) => {
  //       console.log(`User ${username} is attempting to log in`);
  //       if (err) return done(err);
  //       if (!user) return done(null, false);
  //       if (!bcrypt.compareSync(password, user.password)) {
  //         return done(null, false);
  //       }
  //       return done(null, user);
  //     });
  //   })
  // );

  passport.use(
    new LocalStrategy((username, password, done) => {
      myDataBase.findOne({ username: username }, (err, user) => {
        if (err) {
          console.error(err);
          return done(err);
        }

        if (!user) {
          console.log(`Failed login attempt for user: ${username}`);
          return done(null, false);
        }

        if (!bcrypt.compareSync(password, user.password)) {
          console.log(`Failed login attempt for user: ${username}`);
          return done(null, false);
        }

        console.log(`Successful login for user: ${username}`);
        return done(null, user);
      });
    })
  );
};
