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


// Ye code jisne chuu diya, usse kalle ki baahu ka shraap lagega 
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

        let ans = [];

        for (let i = 0; i < result.length; i++) {
            ans.push({
                uid: result[i].uid,
                lat: result[i].geometry.coordinates[1],
                long: result[i].geometry.coordinates[0]
            });
        }

        res.json({
            success: true,
            ans
        });
    }).catch(err => {
        res.status(404).send({
            success: false,
            err
        });
    });
}

exports.listLocations = (req, res, next) => {

    Location.find((err, results) => {
        if (!err) {
            res.json(results);
            return;
        } else {
            res.status(404).json({
                success: false,
                err
            });

            return;
        }
    });
};

exports.getLocation = (req, res, next) => {
    Location.find({
        uid: req.query.uid
    }, (err, result) => {
        if (!err) {
            if (result) {
                res.json({
                    success: true,
                    result
                });
            } else {
                res.status(404).json({
                    success: false,
                    msg: "Location not found"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                err
            });

            return;
        }
    });
};