import express from "express";
import Sale from "../models/Sale.js";

const router = express.Router();

// Ventas agrupadas por día (últimos 30 días)
router.get("/sales/last30days", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          totalRevenue: { $sum: "$price" },
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ventas agrupadas por producto
router.get("/sales/by-product", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$product",
          totalRevenue: { $sum: "$price" },
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Totales globales y últimos 30 días
router.get("/sales/summary", async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));

    const totalAll = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    const total30days = await Sale.aggregate([
      { $match: { purchaseDate: { $gte: last30Days } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalRevenue: totalAll[0]?.totalRevenue || 0,
      totalSales: totalAll[0]?.totalSales || 0,
      revenueLast30Days: total30days[0]?.totalRevenue || 0,
      salesLast30Days: total30days[0]?.totalSales || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
