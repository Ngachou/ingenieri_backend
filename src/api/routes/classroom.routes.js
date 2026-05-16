const { adminOnly } = require("../middleware/protect")
const ctrl = require("../controller/classroom.controller")
const router = require("express").Router()

router.post("/create", adminOnly, ctrl.createClassrrom)
module.exports = router