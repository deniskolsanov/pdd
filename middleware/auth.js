const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: 'No auth'});
        }

        req.user = jwt.decode(token, config.secret);
    } catch (e) {
        return res.status(401).json({message: 'No auth ' + e.message});
    }
    /*try {
        const token = JSON.parse(req.headers.authorization);

        if (!token) {
            return res.status(401).json({message: 'No auth'});
        }

        req.user = token;
    } catch (e) {
        return res.status(401).json({message: 'No auth ' + e.message});
    }*/
    next();
};