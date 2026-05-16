const User = require("../../models/user.model")

exports.CreateTeacher = async (req, res) => {
    try {
        const { name, email, matricule, birthDate } = req.body
        if (!name || !email || !matricule || !birthDate) return res.status(400).json({ message: "Please provide all  the fields !" })
        const bd = new Date(birthDate).getTime()
        const diff = Math.floor((new Date().getTime() - bd) / 24 * 60 * 60)
        if (diff < 21) return res.status(400).json({ message: "Teacher  of this platform can't have age under 21s" })
        const exist = await User.findOne({ email, matricule })
        if (exist) return res.status(409).json({ message: "Teacher Already exist !" })

        const user = await User.create({ name, email, matricule, birthDate, role: "teacher", password: "warano02" })

        res.json({ message: "User created succesfully !", user })

    } catch (e) {
        console.log("Error occured while trying to create teacher ", e)
        res.status(500).json({ error: true, message: "Internal Server Error s" })
    }
}