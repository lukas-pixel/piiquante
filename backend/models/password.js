const passwordSchema = require('../models/passwordValidator');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, ('Password Invalid !'), {
            "content-type": "application/json",
        });
        res.end(" Incorrect Password !");
    } else {
        next();
    }
};