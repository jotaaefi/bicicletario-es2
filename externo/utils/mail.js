const nodemailer = require('nodemailer');

// Criar o transporter com as configurações SMTP do Zoho
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465, // ou 587 se usar TLS
    secure: true, // true para 465, false para 587
    auth: {
        user: 'bicicletarioamigo@zohomail.com', // seu e-mail Zoho
        pass: process.env.PASSWORD // sua senha ou senha de app
    }
});

// Enviar o e-mail
async function sendMail(email, subject, message) {
    const mailOptions = {
        from: 'Bicicletário amigo <bicicletarioamigo@zohomail.com>',
        to: email,
        subject: subject,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return info.messageId;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send email: " + error.message);
    }
}

// Exemplo de uso


module.exports = { sendMail };