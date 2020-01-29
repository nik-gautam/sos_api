const User = require('../models/user');

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