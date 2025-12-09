import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      console.log("🔑 Token envoyé :", token);

const response = await axios.post(
  `${backendURL}/api/order/userorders`,
  {},
  {
    headers: { Authorization: `Bearer ${token}` }, // ✅ correct
  }
);




      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        console.log("⚠️ Pas de commandes :", response.data.message);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des commandes :", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            You have no orders yet.
          </p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* ---- Left Section ---- */}
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image} alt={item.name} onError={(e) => (e.target.src = "/placeholder.png")} />

                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>

                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p>
                      {item.price} {currency}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: M</p>
                  </div>

                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* ---- Right Section ---- */}
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-500"
                        : item.status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
