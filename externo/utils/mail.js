const nodemailer = require('nodemailer');
const { MailtrapTransport } = require("mailtrap");
const transport = nodemailer.createTransport(
    MailtrapTransport({
        token: process.env.MAILTOKEN,
    })
);

//enviar um email. Pode ser que não funcione por causa do provedor.

async function sendMail(email, emailSubject, emailBody) {

    const sender = {
        address: "hello@bicicletarioamigo.com",
        name: "Mailtrap Test",
    };
    const recipients = [
        email,
    ];

    try {
        let info = await transport.sendMail({
            from: sender, // sender address
            to: recipients, // recipient email
            subject: emailSubject, // email subject
            text: emailBody, // plain text body
        });
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = { sendMail };