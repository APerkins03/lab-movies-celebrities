const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");
const uploader   = require('../config/cloudinary');

router.get("/movies/create", (req, res) => {
  Celebrity.find()
  .then((allCelebs) => {
    res.render('movies/new-movie', {celebrities: allCelebs});
  })
});

router.get("/movies", (req, res) => {
  Movie.find()
  .then((allMovies) =>{
    res.render('movies/movies', {movies: allMovies});
  }).catch((err)=> console.log(err))
});

router.post("/movies/create", uploader.single("img"), (req, res) => {
  Movie.create({
    title: req.body.movieTitle,
    genre: req.body.movieGenre,
    plot: req.body.moviePlot,
    img: req.file.path,
    cast: req.body.theCast
  }).then((err, response)=>{
    req.flash('success', 'Movie Successfully Created')
    res.redirect('/movies');
  }).catch((err)=> res.redirect('/movies'))
});

router.get("/movies/:theID", (req, res)=>{
  // the .populate method in mongoose can noly be done after running something like .find or .findbyID
  // and what it does is it looks at the pokemon that have been found, and then does a subsequent .find on the related model
  // the string that goes inside the .populate as the argument must match
  // the key in the model that you are finding
  // so if Pokemon model has a key called trainer (lowercase)
  // then that is what you need to put inside .populate
  // (.populate should always have a lower case argument because keys 
  // on models should always be lower cased)
  Movie.findById(req.params.theID).populate("cast")
  .then((theMovie)=>{
      // the .populate method, if it works, it finds the .trainer field on each pokemon and transforms it from an ID to an actual trainer object
      console.log(theMovie);
      res.render("movies/movie-details", {theMovie: theMovie})
  }).catch((err)=> console.log(err))
})

router.post("/movie/:theID/delete", (req, res)=>{
  Movie.findByIdAndRemove(req.params.theID)
  .then(()=>{
      req.flash('success', 'Movie Successfully Deleted')
      res.redirect("/movies");
  }).catch((err)=> console.log(err));
});

router.get("/movie/:id/edit", (req, res)=>{
  Movie.findById(req.params.id)
  .then((theMovie)=>{
      Celebrity.find().then((allCast)=>{

          allCast.forEach((actor) => {
            if((actor._id).equals(theMovie.cast)) {
              actor.matchesMovie = true;
            }
          })

          res.render("movies/edit-movie", {theMovie: theMovie, cast: allCast})
      })
  }).catch((err)=> console.log(err));
});

router.post("/movie/:theID/update", uploader.single("img"), (req, res)=>{
  let theUpdate = {
    title: req.body.movieTitle,
    genre: req.body.movieGenre,
    plot: req.body.moviePlot,
    cast: req.body.theCast
  }
  
  if(req.file) theUpdate.img = req.file.path;

  Movie.findByIdAndUpdate(req.params.theID, theUpdate).then(()=>{
      req.flash('success', 'Movie Successfully Updated')
      res.redirect("/movies/"+req.params.theID)
  }).catch((err)=> console.log(err));

})


module.exports = router;