import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DARAJA_BASE_URL =
    process.env.DARAJA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

/**
 * Generate OAuth token from Safaricom Daraja API
 */
export const generateToken = async () => {
    const auth = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
    ).toString("base64");

    const response = await axios.get(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
        headers: {
        Authorization: `Basic ${auth}`,
        },
    }
);

    return response.data.access_token;
};

/**
 * Initiates STK Push request
 * @param {string} phone - Customer phone number (e.g. 2547XXXXXXXX)
 * @param {number} amount - Payment amount
 */
export const stkPush = async (phone, amount) => {
    const token = await generateToken();

    const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14); // format: YYYYMMDDHHMMSS

    const password = Buffer.from(
    `${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.DARAJA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        AccountReference: "VibrendAgency",
        TransactionDesc: "Tour booking payment",
    };

    const response = await axios.post(
        `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    );

    return response.data;
};

/**
 * Utility: format Kenyan phone numbers into Safaricom expected format
 * Input: 0712345678 → Output: 254712345678
 */
export const formatPhoneNumber = (phone) => {
    if (phone.startsWith("0")) {
        return "254" + phone.substring(1);
    }
    if (phone.startsWith("+")) {
        return phone.substring(1);
    }
    return phone;
};
