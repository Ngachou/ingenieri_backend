const { signToken } = require("../../lib/jwt");
const Classrooms = require("../../models/classroom.model");
const Enrollment = require('../../models/enrollment.model');
const User = require("../../models/user.model");
const axios = require("axios")
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
exports.signup = async (req, res) => {
    const { name, email, password, matricule, classId } = req.body;
    if (!name || !email || !password || !matricule || !classId) return res.status(400).json({ error: true, message: "All fields are required" });
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) return res.status(400).json({ error: true, message: "User already exists" });
    const classExist = await Classrooms.findOne({ joinCode: classId })
    if (!classExist) return res.status(404).json({ error: true, message: "Classroom not exist yet !" })

    try {
        const { data } = await axios.get(`https://mock-api-university.onrender.com/student?matricule=${matricule}`)
        const { name: n, email: em, level, sex, birthdate, school } = data.user
        if (n.toLowerCase() !== name.toLowerCase() || em.toLowerCase() !== email.toLowerCase()) return res.status(400).json({ error: true, message: "Name or email does not match the matricule" });

        const user = await User.create({ name, email, password, matricule, birthDate: birthdate, sex, school, level })
        const isEnrolled = await Enrollment.findOne({ user: user._id, classroom: classExist._id })
        if (isEnrolled) return res.status(409).json({
            error: true, message: isEnrolled.status == "active" ? "Your already in this classroom !"
                : isEnrolled.status == "banned" ? "You can't join this class because you have been ban of it !"
                    : isEnrolled.status == "left" ? "You can't join this class because you have been left of it !"
                        : "Your enrollment is pending. Please wait a replied from teacher"
        })

        await Enrollment.create({ user: user._id, classroom: clr._id })

        //sent email to user to confirm email before sending response 

        res.status(201).json({ error: false, message: "User created successfully", user });
    } catch (e) {
        console.log("Error fetching user from mock API:", e);
        return res.status(400).json({ error: true, message: "Invalid matricule" });
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: true, msg: 'Token is required' });

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            return res.status(400).json({ error: true, msg: 'Invalid or expired confirmation link' });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: true, msg: 'User not found' });
        if (user.isEmailConfirmed) return res.status(409).json({ error: true, msg: 'Email already confirmed' });

        user.isEmailConfirmed = true;
        await user.save();

        return res.status(200).json({ error: false, msg: 'Email confirmed successfully' });
    } catch (err) {
        return res.status(500).json({ error: true, msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("trying to login ....")
        const { identifier, password } = req.body;
        if (!identifier || !password) return res.status(400).json({ error: true, msg: "All fields are required" })
        const user = await User.findOne({ $or: [{ email: identifier }, { matricule: identifier }] });
        if (!user) return res.status(400).json({ error: true, msg: "Invalid credentials" })
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: true, msg: "Invalid credentials" })
        //generate token and send response

        const token = signToken({ id: user._id, email: user.email, role: user.role });

        res.cookie('token', token, cookieOptions);
        
        res.status(200).json({ error: false, message: "Login successful", token });
    } catch (e) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
}