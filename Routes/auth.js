const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { loginValidation, userValidation } = require('../validations');
router.post('/register', async (req, res) => {

    try {
        let valid = userValidation(req.body)
        const emailExist = await User.findOne({ email: req.body.email })
        if (emailExist) return res.status(400).json({ message: "Email already exists!" })
        if (valid.fails()) return res.status(400).json(valid.errors)
        // Hash passwords
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        let result = (await user.save()).toJSON()
        res.status(200).json(result)

    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})

router.post('/authenticate', async (req, res) => {
    let user_email = req.body.email;
    let password = req.body.password;
    let logger = true;
    try {
        let valid = loginValidation(req.body)
        const user = await User.findOne({ email: user_email })
        if (!user) return res.status(400).json({ message: "Email or Password is incorrect!" })
        if (valid.fails()) return res.status(400).json(valid.errors)
        // Password checker
        let passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return res.status(400).json({ message: "Email or Password is incorrect!" })
        }
        // Create and assign token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.status(201).header('auth-token', token).send(token)

    } catch (err) {
        res.status(400).json({ message: err.message })
    }


});
module.exports = router