const connectDB = require("./src/config/db")

const app = require("express")()

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => res.json({ err: false, msg: "Welcome to the API of classroom of the elite ", data: [] }))


connectDB()

app.listen(PORT, () => console.log(`Classroom of the elite listen http://localhost:${PORT}`))