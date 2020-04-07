const express   = require('express');
const router    = express.Router();
const auth      = require('../../middleware/auth');

const Alert =   require('../../models/alerts');
const User  =   require('../../models/user');

router.post('/add', auth, (req, res) => {

    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if(user.role == "super-admin") {
                const newAlertSystem = new Alert({
                    name_of_alert_system:   req.body.name_of_alert_system,
                    frequency:              req.body.frequency,
                    field_type:             req.body.field_type,
                    field_name:             req.body.field_name,
                    compare:                req.body.compare,
                    thresold_value:         req.body.thresold_value,
                    range_num:              req.body.range_num,
                    range_type:             req.body.range_type,
                    status:                 req.body.status,
                    email:                  req.body.email,
                    mobile_number:          req.body.mobile_number
                }) 
            
                newAlertSystem
                    .save()
                    .then(alert => res.json(alert))
                    .catch(() => 
                    res.status(400).json({msg : 'Something went wrong'})
                )
            }
        }
    )
})

router.get('/get-all', (req, res) => {
    Alert
        .find()
        .then(alert => res.json(alert))
        .catch(() => res.status(400).json({ msg: 'Couldn\'t get the alert system data'}))
})

router.get('/get-active', (req, res) => {
    Alert
        .find({ 'status': true })
        .then(alert => res.json(alert))
        .catch(() => res.status(400).json({ msg: 'Couldn\'t get the active alert system data'}))
})

router.put('/delete-alert', auth, (req, res) => {

    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if(user.role == "super-admin") {
                Alert
                .findByIdAndUpdate(req.body.id, req.body, {new: true})
                .then(alert => res.json(alert))
                .catch(() => res.status(400).json({ msg : 'Couldn\'t delete the alert system' }))
            }
        }
    )
})

module.exports = router;