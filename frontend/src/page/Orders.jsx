import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const STATUS_FR = {
  "Order Placed":     "Commande reçue",
  "Packing":          "En préparation",
  "Shipped":          "Expédiée",
  "Out for delivery": "En livraison",
  "Delivered":        "Livrée",
  "Cancelled":        "Annulée",
};

const STEPS = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"];

const Orders = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = async () => {
    try {
      if (!token) return;
      const { data } = await axios.post(`${backendURL}/api/order/userorders`, {}, { headers: { token } });
      if (data.success) setOrders([...data.orders].reverse());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, [token]);
  useEffect(() => {
    const t = setInterval(loadOrders, 30000);
    return () => clearInterval(t);
  }, [token]);

  if (loading) return (
    <div className="pt-32 text-center text-xs tracking-widest uppercase text-gray-300">
      Chargement…
    </div>
  );

  return (
    <div className="pt-16 pb-24">

      {/* En-tête */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-5 mb-0">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">Mon compte</p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">Commandes</h1>
        </div>
        <button onClick={loadOrders}
          className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors pb-1 border-b border-transparent hover:border-black">
          Actualiser
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="pt-24 text-center">
          <p className="text-xs tracking-widest uppercase text-gray-300">Aucune commande</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const isOpen = expanded === order._id;
            const isCancelled = order.status === "Cancelled";
            const stepIdx = STEPS.indexOf(order.status);
            const statusLabel = STATUS_FR[order.status] || order.status;
            const firstItem = order.items?.[0];

            return (
              <div key={order._id} className="border-b border-gray-100">

                {/* Ligne principale */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  className="w-full text-left py-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors px-1">

                  {/* Image produit */}
                  <div className="w-14 h-16 flex-shrink-0 bg-gray-100 overflow-hidden">
                    {firstItem?.image ? (
                      <img src={firstItem.image} alt={firstItem.name}
                        className="w-full h-full object-cover object-top"
                        onError={e => e.target.style.display = "none"} />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* Nom + date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.items.length === 1 ? firstItem?.name : `${order.items.length} articles`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  {/* Statut */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? "bg-red-400" : stepIdx === STEPS.length - 1 ? "bg-black" : "bg-gray-400"}`} />
                    <span className={`text-xs tracking-wide ${isCancelled ? "text-red-500" : "text-gray-600"}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Montant */}
                  <p className="text-sm font-light text-gray-900 flex-shrink-0 w-24 text-right">
                    {order.amount} {currency}
                  </p>

                  {/* Flèche */}
                  <svg className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Détails expandés */}
                {isOpen && (
                  <div className="px-1 pb-8 pt-2">

                    {/* Progression (sauf annulé) */}
                    {!isCancelled && stepIdx !== -1 && (
                      <div className="mb-8">
                        <div className="flex items-center">
                          {STEPS.map((step, i) => {
                            const done = i <= stepIdx;
                            const active = i === stepIdx;
                            return (
                              <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full transition-all ${
                                    active ? "bg-black scale-125" : done ? "bg-black" : "bg-gray-200"
                                  }`} />
                                  <p className={`text-[8px] tracking-wide uppercase text-center leading-tight w-12 break-words ${
                                    active ? "text-black font-medium" : done ? "text-gray-500" : "text-gray-300"
                                  }`}>
                                    {STATUS_FR[step]}
                                  </p>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div className={`flex-1 h-px mb-4 ${i < stepIdx ? "bg-black" : "bg-gray-200"}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                      {/* Articles */}
                      <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">Articles</p>
                        <div className="flex flex-col gap-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-12 h-14 flex-shrink-0 bg-gray-100 overflow-hidden">
                                <img src={item.image} alt={item.name}
                                  className="w-full h-full object-cover object-top"
                                  onError={e => e.target.style.display = "none"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {item.size && <span>{item.size} · </span>}
                                  Qté {item.quantity} · {item.salePrice && item.salePrice > 0 ? item.salePrice : item.price} {currency}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Livraison */}
                      <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">Livraison</p>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          <p className="font-medium text-gray-900">
                            {order.address?.firstName} {order.address?.lastName}
                          </p>
                          <p className="mt-1">{order.address?.street}</p>
                          <p>{order.address?.city}{order.address?.zipcode ? `, ${order.address.zipcode}` : ""}</p>
                          {order.address?.country && <p>{order.address.country}</p>}
                          {order.address?.phone && (
                            <p className="mt-2 text-gray-400 text-xs">{order.address.phone}</p>
                          )}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400 uppercase tracking-wide">Paiement</span>
                            <span className={`font-medium ${order.payment ? "text-gray-900" : "text-gray-400"}`}>
                              {order.payment ? "Confirmé" : "En attente"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400 uppercase tracking-wide">Méthode</span>
                            <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between text-xs pt-2 border-t border-gray-100 mt-1">
                            <span className="text-gray-400 uppercase tracking-wide">Total</span>
                            <span className="font-medium text-gray-900">{order.amount} {currency}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
