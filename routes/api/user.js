//dependencies
const express = require('express')
const passport = require("passport");
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var DBConnection = require('../../config/DBConnection');

var registerService = require('../../services/register-service');
var loginService = require('../../services/login-service');


const router = express.Router();

router.post("/api/login", [
    check("email").notEmpty(),
    check("password").notEmpty()
], async (req, res) => {
    console.log(req.body)
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.mapped() })
    }

    try {
        let userId = await loginService.handleLogin(req.body.email, req.body.password)
        let token = jwt.sign({ userId }, "secret")
        return res.json({ token })
    } catch (err) {
        return res.status(400).json({ errors: err });
    }
});

router.post("/api/register", [
    check("email").notEmpty(),
    check("password", "Invalid password. Password must be at least 2 chars long").isLength({ min: 2 }),
    check("passwordConfirmation", "Password confirmation does not match password").custom((value, { req }) => {
        console.log(req.body.password)
        return value === req.body.password
    })
], async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.mapped() })
    }

    //create a new user
    let newUser = {
        email: req.body.email,
        user_name: req.body.user_name,
        user_password: req.body.password,
        user_pokemon: null,
        //user_game_list: null,
    };

    try {
        let userId = await registerService.createNewUser(newUser);
        let token = jwt.sign({ userId }, "secret")
        return res.json({ token })
    } catch (err) {
        return res.status(400).json({ errors: err });
    }
});


router.get("/api/user", passport.authenticate('jwt', { session: false }), function (req,res ) {
    DBConnection.query('SELECT * FROM `users`', function (err, rows) {
        if (err) {throw err}
        res.json(rows)
    })
});

module.exports = router