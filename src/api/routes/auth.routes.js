const router = require("express").Router()
const { signup, login, confirmEmail } = require("../controller/auth.controller")
router.get("/", (req, res) => res.json({ msg: "Yo welcome !" }))
router.post("/signup", signup)
router.post("/login", login)
router.patch("/confirm-email", confirmEmail)
module.exports = router