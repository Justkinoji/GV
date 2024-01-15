import paypal from 'paypal-rest-sdk';

if (process.env.NODE_ENV === 'production') {
    paypal.configure({
        'mode': 'live',
        'client_id': process.env.PAYPAL_CLIENT_ID as string,
        'client_secret': process.env.PAYPAL_CLIENT_SECRET as string
    });
} else {
    paypal.configure({
        'mode': 'sandbox',
        'client_id': process.env.PAYPAL_CLIENT_ID as string,
        'client_secret': process.env.PAYPAL_CLIENT_SECRET as string
    });
}

export default paypal;
