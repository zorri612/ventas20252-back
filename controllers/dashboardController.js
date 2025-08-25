import Sale from "../models/Sale.js";

// Total de ventas
export const getTotalSales = async (req, res) => {
  try {
    const total = await Sale.countDocuments();
    res.json({ totalSales: total });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo total de ventas", error });
  }
};

// Ingresos totales
export const getTotalRevenue = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const total = result[0]?.totalRevenue || 0;
    res.json({ totalRevenue: total });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ingresos totales", error });
  }
};

// Ventas por día (últimos 7 días)
export const getSalesByDay = async (req, res) => {
  try {
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);

    const sales = await Sale.aggregate([
      { $match: { date: { $gte: last7days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: 1 },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ventas por día", error });
  }
};
