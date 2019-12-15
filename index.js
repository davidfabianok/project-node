const express = require("express"),
session = require('express-session'),
hbs = require("express-handlebars"),
routes = require("./routes"),
path = require("path"),
methodOverride = require('method-override'),
flash = require('connect-flash');

// Initiliazations
const app = express();
require('./database');

// Settings
const port = 3001;
app.engine(
  "hbs",
  hbs({
    defaultLayout: "main",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretappnode',
    resave: true,
    saveUninitialized: true
}));
app.use(flash())

// Global variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
})

// Routes
app.use(routes);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Server 
app.listen(port, () => console.log("Running server..."));
