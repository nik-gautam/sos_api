const Pusher = require('pusher');
const request = require('request')

const User = require('../models/user');
const Sos = require('../models/sos');
const Location = require('../models/location');

let pusher = new Pusher({
    appId: '',
    key: '',
    secret: '',
    cluster: '',
    encrypted: true
});

exports.listUsers = (req, res, next) => {

    User.find((err, results) => {
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
}

exports.getUser = (req, res, next) => {
    User.findById(req.query.id, (err, result) => {
        if (!err) {
            if (result) {
                res.json({
                    success: true,
                    result
                });
            } else {
                res.status(404).json({
                    success: false,
                    msg: "User not found"
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
}

exports.postEmergencyList = (req, res, next) => {
    let elist = req.body;

    User.findById(elist.uid, (err, result) => {
        if (!err) {
            if (result) {
                result.emergency_contact.push(...elist.econtacts);

                result.save().then(resultt => {
                    res.json({
                        success: true,
                        msg: "Emergency List successfully updated",
                        uid: resultt._id
                    });
                }).catch(err => {
                    res.status(404).json({
                        success: false,
                        err
                    });
                })
            } else {
                res.status(404).json({
                    success: false,
                    msg: "User not found"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                err
            });
        }
    });
}

// The code below is very in-efficient and slow... But it works.. so f.u.
exports.getSos = (req, res, next) => {
    let id = req.query.uid;
    let lat = req.query.lat;
    let long = req.query.long;
    let max = req.query.max;
    let level = req.query.level;

    Location.find({
        uid: id
    }, (err, loc) => {
        if (!err) {
            if (loc) {

                Sos.findOne({
                    uid: id
                }, (err, result) => {
                    if (!err) {
                        if (result) {
                            console.log(loc.geometry);

                            result.previous_sos.push({
                                date: new Date(),
                                geometry: {
                                    coordinates: [parseFloat(long), parseFloat(lat)]
                                }
                            });

                            result.save()
                                .then(resultt => {
                                    request.get({
                                        method: 'GET',
                                        uri: `https://somewhere.com/loc/nearby?long=${long}&lat=${lat}`,
                                        json: true
                                    }, (error, response, body) => {

                                        if (!error) {
                                            if (max > body.result.length) {
                                                max = body.result.length
                                            }
                                            for (let i = 0; i < max; i++) {

                                                if (body.success === true) {
                                                    // console.log(body.result[i].uid);
                                                    console.log(body.result[i].uid);
                                                    pusher.trigger('nearby-channel', body.result[i].uid, {
                                                        "sos": true,
                                                        "uid": result.uid,
                                                        "coordinates": {
                                                            "long": long,
                                                            "lat": lat
                                                        },
                                                        "level": level
                                                    });
                                                }
                                            }
                                            console.log(result.uid);

                                            pusher.trigger('sos-channel', 'common', {
                                                "sos": true,
                                                "uid": result.uid,
                                                "coordinates": {
                                                    "long": long,
                                                    "lat": lat
                                                },
                                                "level": level
                                            });

                                            res.json({
                                                success: true,
                                                msg: "Previous SOS List successfully updated",
                                                uid: result.uid
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                error
                                            });

                                            return;
                                        }
                                    })

                                }).catch(err => {
                                    res.status(404).json({
                                        success: false,
                                        err
                                    });
                                })


                        } else {
                            let newSos = new Sos({
                                uid: req.query.uid,
                                previous_sos: [{
                                    date: new Date(),
                                    geometry: {
                                        coordinates: [parseFloat(long), parseFloat(lat)]
                                    }
                                }]
                            })

                            newSos.save().then((result) => {
                                request.get({
                                    method: 'GET',
                                    uri: `https://somewhere.com/loc/nearby?long=${long}&lat=${lat}`,
                                    json: true
                                }, (error, response, body) => {

                                    if (max > body.result.length) {
                                        max = body.result.length
                                    }

                                    if (!error) {
                                        for (let i = 0; i < max; i++) {
                                            console.log(body.result[i].uid);

                                            if (body.success === true) {
                                                console.log(body.result[i].uid);

                                                pusher.trigger('nearby-channel', body.result[i].uid, {
                                                    "sos": true,
                                                    "uid": result.uid,
                                                    "coordinates": {
                                                        "long": long,
                                                        "lat": lat
                                                    },
                                                    "level": level
                                                });
                                            }
                                        }
                                        console.log(result.uid);

                                        pusher.trigger('sos-channel', 'common', {
                                            "sos": true,
                                            "uid": result.uid,
                                            "coordinates": {
                                                "long": long,
                                                "lat": lat
                                            },
                                            "level": level
                                        });
                                        res.json({
                                            success: true,
                                            msg: "Previous SOS List successfully updated",
                                            uid: result.uid
                                        });
                                    } else {
                                        res.status(404).json({
                                            success: false,
                                            error
                                        });

                                        return;
                                    }
                                })
                            }).catch(err => {
                                res.status(404).json({
                                    success: false,
                                    msg: "Failed to add user",
                                    err
                                });
                            });

                        }
                    } else {
                        res.status(404).json({
                            success: false,
                            err
                        });
                    }
                })
            } else {
                res.status(404).json({
                    success: false,
                    msg: "User not found!"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                err
            });
        }
    });
}

exports.getAllSos = (req, res, test) => {
    Sos.find((err, results) => {
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
}
