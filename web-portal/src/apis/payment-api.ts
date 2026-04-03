import axios from "axios";
import dotenv from 'dotenv';


dotenv.config();

const API_BASE = process.env.Backend_url || "http://localhost:3000/api";

/**
 * Initiates an STK Push payment
 */
export const initiatePayment = async (phone: string, amount: number): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE}/payments/stkpush`, { 
            phone, 
            amount: amount * 129 
        });
        return response.data;
    } catch (error) {
        console.error("Payment initiation failed:", error);
        throw error;
    }
};

/**
 * Polls or checks the status of a specific transaction
 */
export const checkPaymentStatus = async (checkoutRequestId: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE}/status/${checkoutRequestId}`);
        return response.data;
    } catch (error) {
        console.error("Status check failed:", error);
        throw error;
    }
};