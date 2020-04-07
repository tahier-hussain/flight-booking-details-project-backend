const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AlertSchema = new Schema({
    name_of_alert_system: {
        type: String,
        required: true
    },
    frequency: {
        type: Number,
        required: true
    },
    field_type: {
        type: String,
        required: true
    },
    field_name: {
        type: String,
        required: true
    },
    compare: {
        type: String,
        required: true
    },
    thresold_value: {
        type: Number,
        required: true
    },
    range_num: {
        type: Number,
        required: true
    },
    range_type: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: false
    },
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Alert = mongoose.model('alert', AlertSchema);