import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    phone: String,
    amount: Number,
    merchantRequestId: String,
    checkoutRequestId: String,
    resultCode: String,
    resultDesc: String,
    status: { type: String, default: "Pending" }, // Pending | Success | Failed
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);