import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import salesRoutes from "./routes/sales.js";
import dashboardRoutes from "./routes/dashboard.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import statsRoutes from "./routes/stats.js";
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/stats", statsRoutes);

// Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Servidor corriendo en puerto ${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => console.error(err));
