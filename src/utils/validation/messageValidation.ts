import * as yup from 'yup';
import { SendMessageInput } from "../../inputs/messageMutationTypes";

const stringRequired = yup.string().required();
const longText = yup.string()
    .min(1, 'Text is too short.')
    .max(1000, 'Text is too long. Maximum length is 1000 characters.')
    .required('Text is required.');

const messageValidationSchema = yup.object().shape({
    recipientId: stringRequired.label('Recipient ID'),
    message: longText.label('Message')
});

const reportTextValidationSchema = yup.object().shape({
    reportText: longText.label('Report text')
});

async function validateInput(data: any, schema: any): Promise<void> {
    try {
        await schema.validate(data);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new Error(error.message);
        } else {
            throw error;
        }
    }
}

function validateMessageInput(data: SendMessageInput): Promise<void> {
    return validateInput(data, messageValidationSchema);
}

function validateReportText(data: { reportText: string }): Promise<void> {
    return validateInput(data, reportTextValidationSchema);
}

export { validateMessageInput, validateReportText };
