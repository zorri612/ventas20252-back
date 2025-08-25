import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relación con el usuario que compra
    required: true,
  },
  product: {
    type: String, // o incluso podríamos guardar un ObjectId si luego tienes tabla de productos
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Sale", saleSchema);
