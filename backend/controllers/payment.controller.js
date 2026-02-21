import Transaction from "../models/transaction.model.js";
import { stkPush } from "../services/daraja.js";

export const initiatePayment = async (req, res) => {
    try {
    const { phone, amount } = req.body;
    const result = await stkPush(phone, amount);

    // Store initial request in DB
    await Transaction.create({
        phone,
        amount,
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

    const transaction = await Transaction.findOne({ checkoutRequestId });
    if (transaction) {
    transaction.resultCode = stkCallback.ResultCode;
    transaction.resultDesc = stkCallback.ResultDesc;
    transaction.status = stkCallback.ResultCode === 0 ? "Success" : "Failed";
    await transaction.save();
    }

    res.sendStatus(200);
};