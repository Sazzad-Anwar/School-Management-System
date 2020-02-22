//jshint esversion:8
const express = require("express");
const flash = require("connect-flash");
const mongoose = require('mongoose');
const passport = require("passport");
const session = require("express-session");
var conn = require("./configuration/database");

const app = express();

//setup some middle-wear function
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
const PORT =  5000;

app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
);
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//-------- web pages ---------//
app.get("/menupage", (req, res)=>{
  res.render("menupage");
});


app.get("/teacher_details", (req, res)=>{
  res.render("teacher_details");
});

//----------------- initializing the routes ------------------//

app.use("/student", require("./route/student.js"));
app.use("/teacher", require("./route/teacher.js"));
app.use("/", require("./route/admin.js"));
app.use("/image", require("./route/student.js"));

app.listen(PORT, console.log(`Server started on port ${PORT}`));