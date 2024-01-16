import twilio from 'twilio';

const sendSMS = async (to: string, body: string) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = twilio(accountSid, authToken);

    await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
    });
}

const sendPasswordCodeSMS = async (confirmCode: number, phoneNumber: string) => {
    const message = `Your phone verification code is: ${ confirmCode }`;
    await sendSMS(phoneNumber, message);

    return { message: `SMS to ${ phoneNumber } has been sent successfully.` };
}

export { sendPasswordCodeSMS };