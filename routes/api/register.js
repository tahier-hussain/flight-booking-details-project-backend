const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//User model
const User = require('../../models/user');

//Common register for all three roles
router.post('/', (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    //Simple validation
    if(!name || !email || !password || !confirm_password) {
        return res.status(400).json({ msg: 'Please enter all the fields '});
    }
    //Check for existing user
    User
        .findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg: 'User already exists '});

            if(password != confirm_password) {
                return res.status(400).json({ msg: 'Password Didn\'t match'})
            }

            if(password.length < 8) {
                return res.status(400).json({ msg : 'Password should be atleast 8 characters'})
            }

            var number = 0;
            var low_alph = 0;
            var up_alph = 0;
            var spl_char = 0;
            for(var i = 0; i < password.length; i++) {
                var ascii = password.charCodeAt(i);
                if(ascii >= 48 && ascii <= 57) {
                    number = 1
                }
                else if(ascii >= 65 && ascii <= 90) {
                    up_alph = 1
                }
                else if(ascii >= 97 && ascii <= 122) {
                    low_alph = 1
                }
                else {
                    spl_char = 1
                }
            }

            if(number != 1 || low_alph != 1 || up_alph != 1 || spl_char != 1) {
                return res.status(400).json({ msg : 'Password not efficient' })
            }

            const newUser = new User({
                name,
                email,
                password,
                role
            });

            newUser.role = "normal-user"

            //Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if(err) throw err;
                                    res.json({
                                        token,
                                        users: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email,
                                            role: user.role
                                        }
                                    });
                                }
                            )
                        }
                    );
                })
            })
        })
    });

module.exports = router;