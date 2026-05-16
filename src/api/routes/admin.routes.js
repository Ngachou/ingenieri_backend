const router = require("express").Router()
const ctrl = require("../controller/admin.controller")
router.post("/create-teacher", ctrl.CreateTeacher)

module.exports = router