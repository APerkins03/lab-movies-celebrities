const router = require("express").Router();
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');

router.get("/signup", (req, res, next)=>{
    res.render("users/signup");
});

router.post("/signup", (req, res, next)=>{
    const numberOfRounds = 10;
    // this variable is what were going to use for the number of rounds of encyption
    const username = req.body.username;
    
    
    const password = req.body.password;
    // activate bcrypt to create the salt which will act as a signature that will be attached to the scrambled password
    // bcrypt will use this later to compare the password hash to the user's input
    bcryptjs
    .genSalt(numberOfRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {

        User.create({username:username, passwordHash: hashedPassword})
        .then(()=>{
            res.redirect("/");
        })
    })
    .catch(error => console.log(error));
});

router.get("/login", (req, res)=>{
    res.render("users/login");
});

router.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log("heres the session", req.session);

    // the first thing we do is just to simply search through our databse and see if we find a user with a username matching what the person just typed in
    User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        console.log("no user found");
        // for now we'll just console log an error message if we cant find a user with that username
        // we will add a package for error messages later
        res.redirect("/");
        return;
      } else if (bcryptjs.compareSync(password, foundUser.passwordHash)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = foundUser;
        // req.session exists as soon as I use the express-session package
        // but right now I am created req.session.currentUser and saving foundUser's info there in the session
        // logging somebody in is really nothing more than saving their user info to the session
        res.redirect('/');
      } else {
        console.log("sorry passwords dont match");
        res.redirect("/");
        
      }
    })
    .catch(error => next(error));
});


router.post("/logout", (req, res, next)=>{
  req.session.destroy();
  res.redirect("/");
})


module.exports = router;