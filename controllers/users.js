const User = require('../models/user');

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