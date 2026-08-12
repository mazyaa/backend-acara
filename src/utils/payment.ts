import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
    transaction_details: {
        order_id: string;
        gross_amount: number;
    };
};

export type TypeResponseMidtrans = {
    token: string;
    redirect_url: string;
}

export default async function createLink(payload: Payment): Promise<TypeResponseMidtrans> {
    const result = await axios.post<TypeResponseMidtrans>(MIDTRANS_TRANSACTION_URL, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', // only accept json response
            'Authorization': `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}` // encode server key to base64
        }
    });

    if (result.status !== 201) {
        throw new Error(`failed to create payment link, with status code ${result.status}`);
    };

    return result?.data;
};