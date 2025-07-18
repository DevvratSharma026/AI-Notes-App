const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');

//login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate the fields
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //check if user present in DB or not
        const user = await User.findOne({ email });

        if (!user) {
            //return with response of no user in DB
            return res.status(404).json({
                success: false,
                message: 'Signup first before login.',
            });
        }

        //create the payload of the jwt token
        const payload = {
            email: user.email,
            userId: user._id
        }

        if (await bcryptjs.compare(password, user.password)) {
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
            //insert token in user model's token
            user.token = token;
            user.password = undefined;
    
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,// Only secure in production
                sameSite: 'none' // Allow cross-origin in production
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        }else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot login right now.'
        });
    }
};

//signup controller
exports.signup = async (req, res) => {
    try {
        //destructutring
        const {firstName, lastName, email, password, confirmPassword, otp} = req.body;

        //validation on req.body
        if(!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(404).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //check if password and confirm password are equal or not
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password are different.',
            });
        }

        //check if user present in DB or not
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists, please login'
            });
        }

        //find the most recent otp
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP is invalid',
            });
        } else if (otp !== otpRecord.otp) {
            return res.status(400).json({
                success: false,
                message: 'OTP is invalid',
            });
        }

        //hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        //create the user in DB
        const user = await User.create({firstName, lastName, email, password: hashedPassword});

        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot signup right now.'
        });
    }
};

//sendOTP
exports.sendOTP = async (req, res) => {
    try {
        //fetch the user
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already exists',
            });
        }

        //generate the otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        //save otp to DB
        await OTP.create({email, otp});

        //response
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp
        })

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: err
        });
    }
}
