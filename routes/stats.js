import express from "express";
import { getSalesSummary, getSalesByProduct, getSalesByMonth } from "../controllers/statsController.js";

const router = express.Router();

router.get("/summary", getSalesSummary);
router.get("/products", getSalesByProduct);
router.get("/monthly", getSalesByMonth);

export default router;
