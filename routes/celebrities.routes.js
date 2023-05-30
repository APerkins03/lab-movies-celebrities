const express = require("express");
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");
const router = express.Router();


/* GET home page */
router.get("/", (req, res) => {
  res.render('index');
});

router.get("/celebrities/create", (req, res) => {
  Movie.find()
  .then((allMovies) => {
    res.render('celebrities/new-celebrity');
  }).catch((err)=> console.log(err))
});


router.get("/celebrities", (req, res) => {
  Celebrity.find()
  .then((allCelebs) =>{
    res.render('celebrities/celebrities', {celebrities: allCelebs});
  }).catch((err)=> console.log(err))
});

router.post("/celebrities/create", (req, res) => {
  Celebrity.create({
    name: req.body.celebName,
    occupation: req.body.celebOccupation,
    catchPhrase: req.body.catchPhrase
  }).then((err, response)=>{
    req.flash('success', 'Celebrity Successfully Created')
    res.redirect('/celebrities');
  }).catch((err)=> res.render('celebrities/new-celebrity'))
});

router.get("/celebrities/:theID", (req, res)=>{
  Celebrity.findById(req.params.theID)
  .then((theCeleb)=>{
      // the .populate method, if it works, it finds the .trainer field on each pokemon and transforms it from an ID to an actual trainer object
      res.render("celebrities/celebrity-details", {celebrity: theCeleb})
  }).catch((err)=> console.log(err))
})

//post delete here:
router.post("/celebrity/:theID/delete", (req, res)=>{
  Celebrity.findByIdAndRemove(req.params.theID)
  .then(()=>{
      req.flash('success', 'Celebrity Successfully Deleted')
      res.redirect("/celebrities");
  }).catch((err)=> console.log(err));
});

//edit page here
router.get("/celebrity/:id/edit", (req, res)=>{
  Celebrity.findById(req.params.id)
  .then((theCeleb)=>{
          res.render("celebrities/edit-celebrity", {theCeleb})
      }).catch((err)=> console.log(err));
  })


//post and update
router.post("/celebrity/:theID/update", (req, res)=>{
  Celebrity.findByIdAndUpdate(req.params.theID,{
    name: req.body.celebName,
    occupation: req.body.celebOccupation,
    catchPhrase: req.body.catchPhrase
  }).then(()=>{
      req.flash('success', 'Celebrity Successfully Updated')
      res.redirect("/celebrities/"+req.params.theID)
  }).catch((err)=> console.log(err));

})

module.exports = router;