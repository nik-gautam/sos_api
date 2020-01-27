const mongoose = require('mongoose')

const User = require('../models/user');

exports.postSignUp = (req, res, next) => {
    let user = req.body;

    User.findOne({
        email: user.email
    }, (err, result) => {
        if (!err) {

            if (!result) {
                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    phone: parseInt(user.phone, 10),
                    address: user.address,
                    sos: {
                        isTrue: false,
                        previous_sos: []
                    },
                    password: user.password,
                    emergency_contact: []
                });

                newUser.save().then((result) => {
                    res.json({
                        success: true,
                        uid: newUser._id,
                        msg: "User added Sucessfully"
                    });
                }).catch(err => {
                    res.json({
                        success: false,
                        msg: "Failed to add user",
                        err
                    });
                });

            } else {
                res.json({
                    success: false,
                    uid: result._id,
                    msg: "User already exits",
                });
            }
            // res.json(result);
        } else {
            res.json({
                success: false,
                msg: "User already exits",
                err
            });
        }
    })
}

exports.listUsers = (req, res, next) => {

    User.find((err, results) => {
        if (!err) {
            res.json(results);
            return;
        } else {
            res.json({
                success: false,
                err
            });

            return;
        }
    });
}