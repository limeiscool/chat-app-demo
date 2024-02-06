module.exports = function (app, myDataBase, path) {
  app.route("/").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  app.route("/signup").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
  });
  app.route("/login").get((req, res) => {});
};
