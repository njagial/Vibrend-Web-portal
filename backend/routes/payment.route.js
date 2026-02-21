import express from "express";
import { initiatePayment, callbackHandler } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/stkpush", initiatePayment);
router.post("/callback", callbackHandler);

export default router;
