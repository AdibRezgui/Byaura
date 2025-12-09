import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  upload,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

/* ========================= 🟢 Ajouter un produit (admin) ========================= */
productRouter.post("/add", adminAuth, upload.array("images", 4), addProduct);

/* ========================= 🟢 Supprimer un produit ========================= */
productRouter.post("/remove", removeProduct);

/* ========================= 🟢 Obtenir un seul produit ========================= */
productRouter.post("/single", singleProduct);

/* ========================= 🟢 Lister tous les produits ========================= */
productRouter.get("/list", listProducts);

export default productRouter;
