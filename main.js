//jshint esversion:8
const express = require("express");
const flash = require("connect-flash");
const mongoose = require('mongoose');
const passport = require("passport");
const session = require("express-session");
var conn = require("./configuration/database");
const studentDB = require('./model/students');
const morgan = require("morgan");
const {ensureAuthenticated, forwardAuthenticated} = require('./configuration/auth');

const app = express();
require('./configuration/passport')(passport);

//setup some middle-wear function
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
const PORT =  5000;

studentDB.find({},(err,found)=>{
  if(found.length == 0){
    var admin = new studentDB({
      students_name:'.',
      students_id:'2020',
      Class:'.',
      section:'.',
      father_name:'.',
      mother_name:'.',
      dateOfBirth:'.',
      contact_number:'.',
      contact_rel:'.',
      admission_date:'.',
      session:'.',image:'.',password:'$2a$10$JDBfgoek//DNTLKN.kY9w.CleA73cVtPsm1WweTCLqmTjoLLH4tRu',
      role:'admin'
    });
    admin.save();
  }
});


app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
);

app.use(morgan('dev'));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

//-------- web pages ---------//
app.get("/",forwardAuthenticated, (req, res)=>{
  res.render("menupage");
});

app.post('/', (req, res, next) => {  
  passport.authenticate('local', {
      successRedirect: '/student/registration',
      failureRedirect: '/',
      failureFlash: true
  })(req, res, next);
});

// app.get("/teacher_details", (req, res)=>{
//   res.render("teacher_details");
// });

//----------------- initializing the routes ------------------//

app.use("/student", require("./route/student.js"));
app.use("/teacher", require("./route/teacher.js"));
app.use("/", require("./route/admin.js"));
app.use("/image", require("./route/student.js"));

app.listen(PORT, console.log(`Server started on port ${PORT}`));