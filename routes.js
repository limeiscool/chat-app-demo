const passport = require("passport");
const bcrypt = require("bcryptjs");

module.exports = function (app, myDataBase, path) {
  app.route("/").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  app.route("/signup").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
  });
  app.route("/login").post((req, res) => {
    console.log(req.body.username, req.body.password);
    res.redirect("/chat");
  });

  app.route("/register").post(
    (req, res, next) => {
      console.log("someone is trying to register");
      const hash = bcrypt.hashSync(req.body.password, 8);
      if (hash) {
        console.log("hash created");
      }
      myDataBase.findOne({ username: req.body.username }, (err, user) => {
        console.log(user);
        if (err) {
          console.log("there was an error");
          next(err);
        } else if (user) {
          console.log("user already exists");
          res.redirect("/");
        } else {
          console.log("inserting user");
          myDataBase.insertOne(
            {
              username: req.body.username,
              password: hash,
            },
            (err, doc) => {
              if (err) {
                console.log("there was an error");
                res.redirect("/");
              } else {
                next(null, doc.ops[0]);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/chat");
    }
  );

  app.route("/chat").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat.html"));
  });

  // 404 handle
  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
};
