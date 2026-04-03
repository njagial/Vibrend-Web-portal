import express from "express";
import { initiatePayment, callbackHandler, generateToken } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/stkpush", initiatePayment);
router.post("/callback", callbackHandler);
router.get("/token", generateToken);

export default router;
