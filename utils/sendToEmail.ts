import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import 'dotenv/config';

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
}

const sendEmail = async (
    email: string,
    subject: string,
    textContent: string,
    htmlContent: string
): Promise<SentMessageInfo> => {
    const transporter = createTransporter();

    const message = {
        from: `"PayForGame_team" <${ process.env.EMAIL_ADDRESS }>`,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
    };

    await transporter.sendMail(message);

    return `Email to ${ email } has been sent successfully.`;
}

const sendPasswordCodeEmail = async (code: number, email: string): Promise<SentMessageInfo> => {
    const textContent = `Your code to change the password is: ${ code }`;
    const htmlContent = `
        <h2>Your Password Change Code</h2>
        <p>${textContent}</p>
        <p>If you did not request a password change, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your Password Change Code', textContent, htmlContent);
}

const sendEmailConfirmationCode = async (code: number, email: string): Promise<SentMessageInfo> => {
    const textContent = `Your email confirmation code is: ${ code }`;
    const htmlContent = `
        <h2>Your Email Confirmation Code</h2>
        <p>${textContent}</p>
        <p>If you did not request email confirmation, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your Email Confirmation Code', textContent, htmlContent);
}

const sendReportAnswerEmail = async (email: string, answerReporterText: string): Promise<SentMessageInfo> => {
    const textContent = `Your answer to the report is: ${ answerReporterText }`;
    const htmlContent = `
        <h2>Your answer to the report</h2>
        <p>${textContent}</p>
        <p>If you did not answer the report, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your answer to the report', textContent, htmlContent);
}

const sendEmailWithLink = async (link: string, email: string): Promise<SentMessageInfo> => {
    const textContent = `Click on the link to confirm your email: ${ link }`;
    const htmlContent = `
        <h2>Email Confirmation</h2>
        <p><a href="${link}">Click here</a> to confirm your email.</p>
        <p>If you did not request email confirmation, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Email Confirmation Link', textContent, htmlContent);
}

const sendBanNotification = async (email: string, textContent: string): Promise<SentMessageInfo> => {
    const htmlContent = `
        <h2>Hi, your account was restricted by our support</h2>
        <p>${textContent}</p>
        <p>Please email us if you think there’s been a mistake</p>
    `;

    return await sendEmail(email, 'Your answer to the report', textContent, htmlContent);
}

const sendUnBanNotification = async (email: string, textContent: string): Promise<SentMessageInfo> => {
    const htmlContent = `
        <h2>Hi, your account was recovered by our support</h2>
        <p>${textContent}</p>
        <p>Please email us if you think there’s been a mistake</p>
    `;

    return await sendEmail(email, 'Your answer to the report', textContent, htmlContent);
}

export { sendPasswordCodeEmail, sendEmailConfirmationCode, sendReportAnswerEmail, sendEmailWithLink, sendBanNotification, sendUnBanNotification };