import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// --- Pour les chemins absolus ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(express.json());
app.use(cors());

// ✅ Servir correctement le dossier uploads (chemin absolu)
const uploadsPath = path.resolve("C:/Users/Rezgui/Desktop/aura/backend/uploads");
console.log("🟢 Dossier uploads servi depuis :", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

// --- Routes API ---
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter)

// --- Route test ---
app.get("/", (req, res) => {
  res.send("✅ API Working");
});

// --- Démarrage du serveur ---
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
