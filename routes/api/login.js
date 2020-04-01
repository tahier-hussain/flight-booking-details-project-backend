const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//User model
const User = require('../../models/user');

// @route POST api/auth
router.post('/', (req, res) => {
    const { email, password } = req.body;

    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all the fields ' });
    }

    //Check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist ' });

            //Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                        if (err) throw err;
                            res.json({
                                token,
                                users: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    message: "Logged in successfully"
                                }
                            });
                        }
                    )
                })
        })
});

module.exports = router;