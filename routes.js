module.exports = function (app, myDataBase, path) {
  app.route("/").get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
};
