const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.MAIL_HOST,
            service:'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'Notes App',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });
        console.log(info.response);
        return info;

    } catch (err) {
        console.log('mail error', err);
        throw err;
    }
}

module.exports = mailSender;