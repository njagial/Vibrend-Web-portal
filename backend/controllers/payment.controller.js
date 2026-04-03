import Transaction from "../models/transaction.model.js";
import { stkPush } from "../services/daraja.js";
import axios from "axios";
import { Car } from "../models/car.model.js";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = async (req, res, next) => {
    const secret = process.env.DARAJA_CONSUMER_SECRET;
    const consumer = process.env.DARAJA_CONSUMER_KEY;
    const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

    try {
        const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            headers: { Authorization: `Basic ${auth}` },
        }
        );
        req.token = response.data.access_token;
        next();
    } catch (error) {
        res.status(500).json({ error: "Token generation failed" });
    }
    };


export const initiatePayment = async (req, res) => {
    try {
    const { phone, amount, carId } = req.body;
    const result = await stkPush(phone, amount);

    // Store initial request in DB
    await Transaction.create({
        phone,
        amount,
        carId,
        merchantRequestId: result.MerchantRequestID,
        checkoutRequestId: result.CheckoutRequestID,
        status: "Pending",
    });

    res.json(result);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

export const callbackHandler = async (req, res) => {
    const { Body } = req.body;

    if (!Body) {
        return res.sendStatus(400);
    }

    const {stkCallback} = Body.stkCallback;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    try {
        // 1. Find the transaction initiated by the user
        const transaction = await Transaction.findOne({ checkoutRequestId });
        
        if (transaction) {
            transaction.resultCode = resultCode;
            transaction.resultDesc = stkCallback.ResultDesc;
            transaction.status = resultCode === 0 ? "Success" : "Failed";
            await transaction.save();

            // 2. Update Car Availability ONLY if payment was successful
        if (resultCode === 0 && transaction.carId) {
                        await Car.findByIdAndUpdate(transaction.carId, { available: false });
                        console.log(`Success: Car ${transaction.carId} is now unlisted.`);
                    }
        }

        // Safaricom requires a 200 OK response to stop retrying the callback
        res.status(200).json({ message: "Callback processed successfully" });
        
    } catch (error) {
        console.error("Callback Error:", error);
        res.status(500).json({ error: "Internal server error during callback" });
    }
};