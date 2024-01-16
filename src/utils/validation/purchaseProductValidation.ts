import * as yup from 'yup';
import { PurchaseProductInput } from "../../inputs/purchaseProductTypes";

const purchaseProductValidationSchema = yup.object().shape({
    productId: yup.string().required('Product ID is required.'),
    soldBy: yup.string().required('Seller ID is required.'),
    payment: yup.object().shape({
        method: yup.string().required('Payment method is required.'),
        paymentCode: yup.string().nullable(),
    }).required('Payment info is required.'),
    status: yup.string().min(2, 'Status should be at least 2 characters long.').required('Status is required.'),
    received: yup.boolean().required('Received status is required.'),
    price: yup.number().min(1, 'Price should be greater than 0').required('Price is required.'),
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

export function validatePurchaseProductInput(data: PurchaseProductInput): Promise<void> {
    return validateInput(data, purchaseProductValidationSchema);
}
