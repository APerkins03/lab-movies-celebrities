// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.set('trust proxy', 1);

//create the global variable called user and set it equal to currentUser, which equals foundUser
app.use((req, res, next)=>{
  res.locals.user = req.session.currentUser || null;
  // this means in every hbs file i have a variable called {{user}}
  let isAdmin = false;
  if(req.session.currentUser && req.session.currentUser.admin) isAdmin = true;
  res.locals.isAdmin = isAdmin;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash('success')
  next();
});


  


// 👇 Start handling routes here
const celebrityRoutes = require("./routes/celebrities.routes");
app.use("/", celebrityRoutes);
// for now, all routes have a "/" as the firsts argument.   we'll talk about it later
// also, fun fact, route files are called controllers, this is the C in the MVC pattern

const movieRoutes = require("./routes/movies.routes.js");
app.use("/", movieRoutes);
// the first arguments in app.use when you are connecting a routes file
// represents a prefix that you are attaching to every single route 
// in that file

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;