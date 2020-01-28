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

const locationSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    geometry: geoSchema
});

module.exports = mongoose.model('Location', locationSchema);