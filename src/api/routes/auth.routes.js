const router = require("express").Router()

router.get("/", (req, res) => res.json({ msg: "Yo welcome !" }))

module.exports = router