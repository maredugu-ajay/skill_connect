const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For production, use a real SMTP service like SendGrid, Mailgun, or Gmail
    // For development (if no env vars), we can use Ethereal (boilerplate below) or just log it.

    let transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    } else {
        // Fallback for development if no SMTP vars
        // valid for previewing emails in console or using Ethereal
        console.log('No SMTP config found. Using Ethereal for testing.');
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${options.subject}</h2>
        <p>${options.message}</p>
        <p>If you did not request this email, please ignore it.</p>
      </div>
    `
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    if (!process.env.SMTP_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
