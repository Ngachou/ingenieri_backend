const router = require("express").Router()
const { signup, login } = require("../controller/auth.controller")
router.get("/", (req, res) => res.json({ msg: "Yo welcome !" }))
router.post("/signup", signup)
router.post("/login", login)

module.exports = router