const { protect, adminOnly } = require("./src/api/middleware/protect")
const connectDB = require("./src/config/db")
const cors = require("cors")
const app = require("express")()

const PORT = process.env.PORT || 3000

app
    .use(cors({ origin: ["http://192.168.43.13", "http://192.168.43.194"], credentials: true }))
    .use((req, res, next) => {
        console.log("called... ", new Date().getTime().toLocaleString())
        next()
    })
    .use(require("express").json())
    .use("/auth", require("./src/api/routes/auth.routes"))
    .get("/", (req, res) => res.json({ err: false, msg: "Welcome to the API of classroom of the elite ", data: [] }))
    .use(protect)
    .use("/course", require("./src/api/routes/course.routes"))
    .use("/classroom", require("./src/api/routes/classroom.routes"))
    .use(adminOnly)
    .use("/admin", require("./src/api/routes/admin.routes"))


connectDB();

app.listen(PORT, () => console.log(`Classroom of the elite listen http://localhost:${PORT}`))