const nodemailer = require('nodemailer');

const sendEmail = (options) => {
    //TRANSPORTING INIT
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    console.log('transport set')

    //THE MAIL
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    }
    console.log('mail options set')

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err)
            console.log('error send')
        } else {
            console.log(info)
            console.log('success send')
        }
    })
}

module.exports = sendEmail;