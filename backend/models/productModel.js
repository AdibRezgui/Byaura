import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },
  images: { type: Array, required: true },
  date: { type: Date, default: Date.now }, // ✅ correction ici
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
