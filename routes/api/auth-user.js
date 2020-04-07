const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//User model
const User = require('../../models/user');

// access private
// GET api/auth/user
router.post('/one', auth, async (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if(user.role == "super-admin") {
                const { name, email, password, confirm_password, role} = req.body;

                if(!name || !email || !password || !confirm_password || !role) {
                    return res.status(400).json({ msg: 'Please enter all the fields ' });
                }

                if(password != confirm_password) {
                    return res.status(400).json({ msg: 'Password Didn\'t match'})
                }

                User
                .findOne({ email })
                .then(user => {
                    if(user) res.status(400).json({ msg: 'User already exists '})
                })

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


                const newAdmin = new User({
                    name,
                    email,
                    password,
                    role
                });
                //Create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if(err) throw err;
                        newAdmin.password = hash;
                        newAdmin.save()
                            .then(data => {
                                jwt.sign(
                                    { id: data.id },
                                    config.get('jwtSecret'),
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                        if(err) throw err;
                                        res.json({
                                            token,
                                            user: {
                                                id: data.id,
                                                name: data.name,
                                                email: data.email,
                                                role: data.role
                                            }
                                        });
                                    }
                                )
                            }
                        );
                    })
                })
            }
        })
        .catch(() => res.status(400).json({ "msg" : "error"}))
})

module.exports = router;