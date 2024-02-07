"use strict";
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const myDB = require("./connection.js");
const routes = require("./routes.js");
const auth = require("./auth.js");

const MongoStore = require("connect-mongo")(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ mongoUrl: URI });

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files (like HTML, CSS, JS)
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

io.use((socket, next) => {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  });

  sessionMiddleware(socket.request, {}, () => {
    passport.initialize()(socket.request, {}, () => {
      passport.session()(socket.request, {}, () => {
        if (socket.request.user) {
          return next();
        } else {
          return next(new Error("unauthorized"));
        }
      });
    });
  });
});

myDB(async (client) => {
  const myDataBase = await client.db("test-app").collection("users");
  if (myDataBase) {
    console.log("Connected to database");
  } else {
    console.log("Error connecting to database");
  }
  routes(app, myDataBase, path);
  auth(app, myDataBase);
}).catch((e) => {
  console.error(e);
  app.route("/").get((req, res) => {
    res.route("/").get((req, res) => {
      console.log("Error connecting to database");
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
