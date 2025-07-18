const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        //fetch the token from the req body
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        //validate the token
        if(!token) {
            return res.status(404).json({
                success: false,
                message: 'Invalid token'
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decode);

            req.user = decode;
            next();
        } catch(err) {
            return res.status(401).json({
                success: false, 
                message: "Invalid token"
            });
        }
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while validating the token',
            error: err
        });
    }
}