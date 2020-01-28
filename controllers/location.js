const Location = require('../models/location');

exports.postLatLong = (req, res, next) => {
    let loct = req.body;

    Location.update({
        uid: loct.uid
    }, {
        $set: {
            "uid": loct.uid,
            "geometry.coordinates": [parseFloat(loct.long), parseFloat(loct.lat)]
        }
    }, {
        upsert: true
    }, (err, result) => {
        if (err) {
            res.status(404).send({
                success: false,
                err
            });
            return;
        }

        res.json({
            success: true,
            msg: "Location Updated"
        });
        return;
    });
}


// Ye code jisne chuu diya usse,usse kalle ki baahu ka shraap lagega 
exports.getNearby = (req, res, next) => {
    let coor = req.query;

    Location.createIndexes({
        "point": "2dsphere"
    });

    Location.aggregate().near({
        near: {
            type: 'Point',
            coordinates: [parseFloat(coor.long), parseFloat(coor.lat)]
        },
        maxDistance: 100000,
        spherical: true,
        distanceField: "dis"
    }).then(result => {
        res.json({
            success: true,
            result
        });
    }).catch(err => {
        res.status(404).send({
            success: false,
            err
        });
    });
}