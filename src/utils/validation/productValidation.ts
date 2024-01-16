import * as yup from 'yup';
import { Language } from "../../constants/Language";
import { Platform } from "../../constants/Platform";
import { ProductCreateInput } from "../../inputs/productInterfaces";

const languageDescriptionShape: Record<keyof typeof Language, yup.StringSchema> =
    Object.fromEntries(
        Object.values(Language).map(lang => {
            if (lang === Language.EN) {
                return [lang, yup.string().min(10, `${lang} description should be at least 10 characters long.`).required(`${lang} description is required.`)];
            } else {
                return [lang, yup.string().min(10, `${lang} description should be at least 10 characters long.`)];
            }
        })
    ) as Record<keyof typeof Language, yup.StringSchema>;

const languageShortDescriptionShape: Record<keyof typeof Language, yup.StringSchema> =
    Object.fromEntries(
        Object.values(Language).map(lang => {
            if (lang === Language.EN) {
                return [lang, yup.string().min(2, `${lang} short description should be at least 2 characters long.`).required(`${lang} short description is required.`)];
            } else {
                return [lang, yup.string().min(2, `${lang} short description should be at least 2 characters long.`)];
            }
        })
    ) as Record<keyof typeof Language, yup.StringSchema>;

const productValidationSchema = yup.object().shape({
    price: yup.number().min(1, 'Price should be greater than 0').required('Price is required.'),
    categoryId: yup.string().required('Category ID is required.'),
    sectionId: yup.string().required('Section ID is required.'),
    description: yup.object().shape(languageDescriptionShape),
    shortDescription: yup.object().shape(languageShortDescriptionShape),
    platform: yup.string().oneOf(Object.values(Platform), 'Invalid platform').required('Platform is required.')
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

export function validateProductInput(data: ProductCreateInput): Promise<void> {
    return validateInput(data, productValidationSchema);
}
