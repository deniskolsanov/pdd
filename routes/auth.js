
const {Router} = require('express');
const router = Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/User');


router.post('/register', [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Weak password').isLength(6, 50)
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Some errors checking fieds ' + JSON.stringify(errors)});
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email: email});

        if (candidate) {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email: email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: "User created"});
    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});

router.post('/login', [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Weak password').isString()
    ], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Some errors checking fieds ' + JSON.stringify(errors)});
        }

        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(400).json({message: 'User doesnt exists'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: "Wrong password"});
        }

        const token = jwt.sign({
            userId: user.id
        }, config.secret, {
            expiresIn: '1y'
        });

        res.json({token, userId : user.id});

    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});

function makeId(length) {
    let id = '';
    while (length--) {
        // Generate random integer between 0 and 61, 0|x works for Math.floor(x) in this case
        let rdm62 = 0 | Math.random() * 62;
        // Map to ascii codes: 0-9 to 48-57 (0-9), 10-35 to 65-90 (A-Z), 36-61 to 97-122 (a-z)
        id += String.fromCharCode(rdm62 + (rdm62 < 10 ? 48 : rdm62 < 36 ? 55 : 61))
    }
    return id;
}

router.post('/login_random', async (req, res) => {
    try {
        let user = new User({email: makeId(6), password: ''});
        user = await user.save();

        const token = jwt.sign({
            userId: user.id
        }, config.secret, {
            expiresIn: '1h'
        });

        res.json({token, userId : user.id});

    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});

module.exports = router;