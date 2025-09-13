const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require('../models/user.models');
const { JsonWebTokenError } = require("jsonwebtoken");
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    const user = await userModel.create({
        username, password

    })
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(201).json({
        message: "user registered successfully",
        user,
        
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await userModel.findOne({
        username: username
    })
    if (!user) {
        return res.status(401).json({
            message: 'user account not found [invalid user]'
        })
    }
    const pass = password == user.password;
    if (!pass) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

})

router.get('/user', async (req, res) => {
    try {
      const token = req.cookies.token; // cookie se token lo
        if (!token) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id)
            .select("-password -__v")
            .lean();

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user); // response send karna important hai
    } catch (err) {
        return res.status(401).json({ message: "unauthorized - invalid token" });
    }
});


module.exports = router;