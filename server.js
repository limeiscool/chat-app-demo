"use strict";
const express = require("express");
const path = require("path");
const myDB = require("./connection");
const routes = require("./routes");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files (like HTML, CSS, JS)
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDB(async (client) => {
  const myDataBase = await client.db("test-app").collection("users");
  routes(app, myDataBase, path);
}).catch((e) => {
  console.error(e);
  app.route("/").get((req, res) => {
    res.route("/").get((req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
