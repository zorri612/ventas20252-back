import express from "express";
import Sale from "../models/Sale.js";
import jwt from "jsonwebtoken";
import  {getDashboardStats } from "../controllers/ventaController.js";

const router = express.Router();

// Middleware simple para validar token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

// Registrar una venta
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { product, price } = req.body;

    if (!product || !price) {
      return res.status(400).json({ msg: "Faltan datos de la venta" });
    }

    const newSale = new Sale({
      user: req.user.id,
      product,
      price,
    });

    await newSale.save();

    res.json({ msg: "Venta registrada con éxito", sale: newSale });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Listar ventas (para el dashboard admin)
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate("user", "email");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/ventas/dashboard", getDashboardStats);

export default router;
