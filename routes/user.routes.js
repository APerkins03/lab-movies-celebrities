const router = require("express").Router();
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');
const mongoose = require("mongoose");


router.get("/signup", (req, res, next)=>{
  res.render("users/signup");
});

router.post("/signup", (req, res, next)=>{
  const numberOfRounds = 10;
  // this variable is what were going to use for the number of rounds of encyption
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if(!re.test(password)){
    req.flash("error", "password must contain lowercase, capital, numerals, and special characters");
    res.redirect("/signup");
    return;
  }

  // activate bcrypt to create the salt which will act as a signature that will be attached to the scrambled password
  // bcrypt will use this later to compare the password hash to the user's input
  bcryptjs
  .genSalt(numberOfRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {

      User.create({username:username, email: email, passwordHash: hashedPassword})
      .then(()=>{
          res.redirect("/");
      })
      .catch((error)=>{
        if (error instanceof mongoose.Error) {
          // the way to create a message with req.flash to show user feedback
          // after a redirect is like this
          console.log(error.message)
          req.flash("error", error.message);
          // first argument is the name of the key inside the req.flash object
          // second argument is the value
          res.redirect("/signup");
        }
      })
  })
  .catch(error => next(error));
});

router.get("/login", (req, res)=>{
  res.render("users/login");
});

router.post("/login", (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;
  console.log("heres the session", req.session);

  // the first thing we do is just to simply search through our databse and see if we find a user with a username matching what the person just typed in
  User.findOne({ username: req.body.username })
  .then(foundUser => {
    if (!foundUser) {
      // this if only happens we successfully queries the databse and there is no user with that username
      req.flash("error", "Username Not Found");
      // for now we'll just console log an error message if we cant find a user with that username
      // we will add a package for error messages later
      res.redirect("/login");
      return;
    } else if (bcryptjs.compareSync(req.body.password, foundUser.passwordHash)) {
      //******* SAVE THE USER IN THE SESSION ********//
      req.session.currentUser = foundUser;
      // ^ this is the magic right here this is how we log in
      // req.session exists as soon as I use the express-session package
      // but right now I am created req.session.currentUser and saving foundUser's info there in the session
      // logging somebody in is really nothing more than saving their user info to the session
      req.flash("success", "Successfully Logged In");
      res.redirect('/');
    } else {
      req.flash("error", "Incorrect Password");
      res.redirect("/login");
      
    }
  })
  .catch(error => next(error));
});


router.post("/logout", (req, res, next)=>{
// console.log(request.session);
req.session.destroy();
res.redirect("/");
})

router.get("/see-users", (req, res, next)=>{
if(!(req.session.currentUser && req.session.currentUser.admin)){
  res.redirect("/");
  return;
}
User.find()
.then((allUsers)=>{
  const nonAdminUsers = allUsers.filter(user => user.admin === false)
  res.render("users/all-users", {users: nonAdminUsers});
}).catch((err)=>next(err));
})

router.post("/delete-user", (req, res, next)=>{
if(!(req.session.currentUser && req.session.currentUser.admin)){
  res.redirect("/");
  return;
}
// when we deleted pokemon we put the ID in the params
// but this time were putting in the req.body using a hidden input
User.findByIdAndRemove(req.body.theUserID)
.then(()=>{
  res.redirect("/see-users")
}).catch((err)=>next(err));
});


module.exports = router;