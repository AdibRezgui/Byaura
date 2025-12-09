import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// 🛒 1️⃣ Créer une commande (Cash on Delivery)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // ✅ défini par authUser
    const { items, amount, address, paymentMethod } = req.body;

    if (!items || !amount || !address) {
      return res.json({ success: false, message: "Missing order details" });
    }

    const orderData = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await orderData.save();

    // 🧹 Vider le panier de l'utilisateur après la commande
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderData._id,
    });
  } catch (error) {
    console.log("❌ Error placing order:", error);
    res.json({ success: false, message: error.message });
  }
};

// 💳 2️⃣ Méthode Stripe (à implémenter plus tard)
export const placeOrderStripe = async (req, res) => {
  try {
    res.json({
      success: false,
      message: "Stripe payment not implemented yet",
    });
  } catch (error) {
    console.log("❌ Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 💰 3️⃣ Méthode Razorpay (à implémenter plus tard)
export const placeOrderRazorpay = async (req, res) => {
  try {
    res.json({
      success: false,
      message: "Razorpay payment not implemented yet",
    });
  } catch (error) {
    console.log("❌ Razorpay error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 👑 4️⃣ Toutes les commandes (Admin)
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log("❌ Error fetching all orders:", error);
    res.json({ success: false, message: error.message });
  }
};

// 👤 5️⃣ Commandes d’un utilisateur (My Orders)
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // ✅ pris du middleware authUser
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("❌ Error fetching user orders:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🔄 6️⃣ Mise à jour du statut d'une commande (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log("❌ Error updating status:", error);
    res.json({ success: false, message: error.message });
  }
};
