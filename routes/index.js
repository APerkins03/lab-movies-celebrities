const router = require("express").Router();

const moviesRoutes = require("./movies.routes");
router.use("/movies", moviesRoutes)

const celebsRoutes = require("./celebrities.routes");
router.use("/celebrities", celebsRoutes)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});




module.exports = router;