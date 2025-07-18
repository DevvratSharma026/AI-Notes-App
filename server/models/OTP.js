const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender')

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 60*5
        }
    }
);

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            'Verification Email',
            `<h1>Your OTP is: ${otp}</h1>`
        );
        console.log('email sent successfully', mailResponse?.response);
    } catch (err) {
        console.log('error occurred while sending mail', err);
        throw err;
    }
}

OTPSchema.post('save', async function (doc, next) {
    console.log('new document has been savedt to DB');
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (err) {
        console.log('Error sending OTP email:', err);
        next(err);
    }
});

module.exports = mongoose.model('OTP', OTPSchema);