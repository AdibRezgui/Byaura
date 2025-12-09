import fs from "fs";
import multer from "multer";
import path from "path";
import productModel from "../models/productModel.js";

// === Création automatique du dossier uploads ===
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Dossier '${uploadDir}' créé automatiquement.`);
}

// === Configuration Multer ===
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

export const upload = multer({ storage });

// === Ajouter un produit ===
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // ✅ le frontend envoie un champ "images"
    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    // ✅ correction des tailles
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const product = new productModel({
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: bestseller === "true" || bestseller === true,
      images,
      date: Date.now(),
    });

    await product.save();
    res.json({ success: true, message: "✅ Produit ajouté avec succès", product });
  } catch (error) {
    console.error("Erreur lors de l’ajout du produit :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Lister tous les produits ===
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Supprimer un produit ===
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "🗑️ Produit supprimé avec succès" });
  } catch (error) {
    console.log("Erreur lors de la suppression :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Obtenir un seul produit ===
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product)
      return res.json({ success: false, message: "Produit introuvable" });
    res.json({ success: true, product });
  } catch (error) {
    console.log("Erreur lors de la récupération du produit :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
