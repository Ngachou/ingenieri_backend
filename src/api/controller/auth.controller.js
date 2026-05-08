const { signToken } = require("../../lib/jwt");
const User = require("../../models/user.model");
const axios = require("axios")
exports.signup = async (req, res) => {
    const { name, email, password, matricule } = req.body;
    if (!name || !email || !password || !matricule) return res.status(400).json({ error: true, message: "All fields are required" });
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) return res.status(400).json({ error: true, message: "User already exists" });

    try {
        const { data } = await axios.get(`https://mock-api-university.onrender.com/student?matricule=${matricule}`)
        const { name: n, email: em, level, sex, birthdate, school } = data.user
        if (n.toLowerCase() !== name.toLowerCase() || em.toLowerCase() !== email.toLowerCase()) return res.status(400).json({ error: true, message: "Name or email does not match the matricule" });

        const user = await User.create({ name, email, password, matricule, birthDate: birthdate, sex, school, level })

        //sent email to user to confirm email before sending response 

        res.status(201).json({ error: false, message: "User created successfully", user });
    } catch (e) {
        console.log("Error fetching user from mock API:", e);
        return res.status(400).json({ error: true, message: "Invalid matricule" });
    }
}

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) return res.status(400).json({ error: true, msg: "All fields are required" })
        const user = await User.findOne({ $or: [{ email: identifier }, { matricule: identifier }] });
        if (!user) return res.status(400).json({ error: true, msg: "Invalid credentials" })
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: true, msg: "Invalid credentials" })
        //generate token and send response

        const token = signToken({ id: user._id, email: user.email, role: user.role });

        
        res.status(200).json({ error: false, message: "Login successful", token });

    } catch (e) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
}