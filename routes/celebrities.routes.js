// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model")

// all your routes here
router.get("/", (req, res, next) => {
    Celebrity.find()
        .then(celebrity => {
            res.render("celebrities/celebrities", { celebrity: celebrity })
        })
        .catch(err => next(err))
})

router.get("/create", (req, res, next) => {
    res.render("celebrities/new-celebrity")
})

router.post("/create", (req, res, next) => {
    let celeb = {
        name: req.body.name,
        occupation: req.body.occupation,
        catchPhrase: req.body.catchPhrase
    }
    Celebrity.create(celeb)
        .then(result => {
            res.redirect("/celebrities")
        })
        .catch(res.render("celebrities/new-celebrity"))
})

router.get('/all-celebrities', (req, res) => {
    Celebrity.find()
    .then((allCelebrities) => {
      res.render('celebrities/celebrities', {celebrities: allCelebrities})
    })
    .catch((err) => {
      console.log(err);
    })
  })
module.exports = router;