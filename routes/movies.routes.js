const router = require("express").Router();

const Movie = require("../models/Movie.model")

const Celebrity = require("../models/Celebrity.model")

// all your routes here
router.get("/", (req, res, next) => {
    Movie.find()
        .then(movie => {
            res.render("movies/movies", { movie })
            console.log(movie[0]._id)
        })
        .catch(err => next(err))

})

router.get("/create", (req, res, next) => {
    Celebrity.find()
        .then(celebrity => {
            res.render("movies/new-movie", { celebrity })
        })
        .catch(err => { next(err) })
})

router.post("/create", (req, res, next) => {
    // console.log("req.body: ", req.body)
    let { title, genre, plot, cast } = req.body
    Movie.create({ title, genre, plot, cast })   //populate va despues de find no despues de create
        .then(result => {
            // console.log("result: ", result)     //creo que en result estan los resultados de populate de cast
            res.redirect("/movies")
        })
        .catch(res.render("movies/new-movie"))
})

router.get("/:id", (req, res, next) => {
    let idMovie = req.params.id
    Movie.findById(idMovie)
        .populate("cast")
        .then(result => {
            res.render("movies/movie-details", { result })
            // console.log("console.log luego de populate:", result)
        })
        .catch(err => next(err))
})


router.post("/:id/delete", (req, res, next) => {
    let idMovie = req.params.id
    Movie.findByIdAndRemove(idMovie)
        .then(result => {
            res.redirect("/movies")
        })
        .catch(err => next(err))
})

router.get("/:id/edit", (req, res, next) => {
    let idMovie = req.params.id
    Movie.findById(idMovie)
        .then(result => {
            let film = result;
            Celebrity.find()
                .then(result => {
                    let actors = result;
                    console.log("result edit.get: ", result)
                    res.render("movies/edit-movie", { film, actors })
                })
        })
        .catch(err => next(err))
})

router.post("/:id/edit", (req, res, next) => {
    const { title, genre, plot, cast } = req.body
    let idMovie = req.params.id
    Movie.findByIdAndUpdate(idMovie, { title, genre, plot, cast })
        .then(result => {
            console.log("update result: ", result)

            res.redirect(`/movies/${idMovie}`)
        })
        .catch(err => next(err))

})



module.exports = router;
