const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

const sosSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    previous_sos: [{
        date: {
            type: String,
        },
        geometry: geoSchema
    }]
});

module.exports = mongoose.model('Sos', sosSchema);