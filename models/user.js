const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sos: {
        isTrue: {
            type: Boolean,
            required: true
        },
        previous_sos: [{
            date: {
                type: String,
            },
            time: {
                type: Number,
            }
        }]
    },
    password: {
        type: String,
        required: true
    },
    emergency_contact: [{
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('User', userSchema);