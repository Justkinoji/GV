import * as yup from 'yup';

const stringRequired = yup.string().required();

const nameValidation = yup.string()
    .min(2, 'Name is too short.')
    .max(30, 'Name is too long. Maximum length is 30 characters.')
    .required('Name is required.');

const descriptionValidation = yup.string()
    .min(3, 'Description is too short.')
    .max(160, 'Description is too long. Maximum length is 160 characters.')
    .required('Description is required.');

const criteriaSchema = yup.array().of(
    yup.object().shape({
        field: stringRequired.label('Field'),
        count: yup.number().min(1, 'Count must be at least 1.').required('Count is required.').label('Count')
    })
).required('Criteria is required.');

const achievementValidationSchema = yup.object().shape({
    name: nameValidation.label('Name'),
    image: stringRequired.label('Image'),
    description: descriptionValidation.label('Description'),
    criteria: criteriaSchema
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

function validateAchievementInput(data: { name: string; image: string; description: string; criteria: { field: string; count: number }[] }): Promise<void> {
    return validateInput(data, achievementValidationSchema);
}

export { validateAchievementInput };
