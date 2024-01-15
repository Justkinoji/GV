import sgMail from "@sendgrid/mail";
import 'dotenv/config';

const SG_API_KEY = process.env.SG_API_KEY;
const SG_EMAIL_ADDRESS = process.env.SG_EMAIL_ADDRESS;

if (!SG_API_KEY) {
    throw new Error("Missing SendGrid API Key in environment variables");
}

if (!SG_EMAIL_ADDRESS) {
    throw new Error("Missing SendGrid email address in environment variables");
}

sgMail.setApiKey(SG_API_KEY);

const sendEmail = async (
    email: string,
    subject: string,
    textContent: string,
    htmlContent: string
) => {
    const message = {
        from: SG_EMAIL_ADDRESS,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
    };

    await sgMail.send(message);

    return `Email to ${email} has been sent successfully.`;
};

const sendPasswordCodeEmail = async (code: number, email: string) => {
    const textContent = `Your code to change the password is: ${code}`;
    const htmlContent = `
        <h2>Your Password Change Code</h2>
        <p>${textContent}</p>
        <p>If you did not request a password change, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your Password Change Code', textContent, htmlContent);
}

const sendEmailConfirmationCode = async (code: number, email: string) => {
    const textContent = `Your email confirmation code is: ${code}`;
    const htmlContent = `
        <h2>Your Email Confirmation Code</h2>
        <p>${textContent}</p>
        <p>If you did not request email confirmation, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your Email Confirmation Code', textContent, htmlContent);
}

const sendReportAnswerEmail = async (email: string, answerReporterText: string) => {
    const textContent = `Your answer to the report is: ${answerReporterText}`;
    const htmlContent = `
        <h2>Your answer to the report</h2>
        <p>${textContent}</p>
        <p>If you did not answer the report, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Your answer to the report', textContent, htmlContent);
}

const sendEmailWithLink = async (link: string, email: string) => {
    const textContent = `Click on the link to confirm your email: ${link}`;
    const htmlContent = `
        <h2>Email Confirmation</h2>
        <p><a href="${link}">Click here</a> to confirm your email.</p>
        <p>If you did not request email confirmation, please ignore this email.</p>
    `;

    return await sendEmail(email, 'Email Confirmation Link', textContent, htmlContent);
}

export { sendPasswordCodeEmail, sendEmailConfirmationCode, sendReportAnswerEmail, sendEmailWithLink };