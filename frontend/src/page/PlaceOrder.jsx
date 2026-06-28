import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const inputCls = "w-full border-b border-gray-200 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300";

const PlaceOrder = () => {
  const { navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "", zipcode: "", country: "", phone: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  const set = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const total = getCartAmount();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error("Connectez-vous pour passer une commande"); return; }

    const orderItems = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const p = structuredClone(products.find(pr => String(pr._id) === String(itemId)));
          if (p) { p.size = size; p.quantity = cartItems[itemId][size]; orderItems.push(p); }
        }
      }
    }
    if (orderItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setSubmitting(true);
    try {

      const { data } = await axios.post(
        `${backendURL}/api/order/place`,
        { address: formData, items: orderItems, amount: total + delivery_fee, paymentMethod: "COD" },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Commande passée !");
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(data.message || "Erreur lors de la commande");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-10 pb-24 border-t border-gray-100">

      {/* En-tête */}
      <div className="border-b border-gray-100 pb-5 mb-10">
        <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-1">Commander</p>
        <h1 className="text-2xl font-light text-gray-900 tracking-tight">Finaliser ma commande</h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Livraison */}
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-8">Adresse de livraison</p>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Prénom *</label>
                <input name="firstName" value={formData.firstName} onChange={set} required className={inputCls} placeholder="Marie" />
              </div>
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Nom *</label>
                <input name="lastName" value={formData.lastName} onChange={set} required className={inputCls} placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={set} required className={inputCls} placeholder="marie@example.com" />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Adresse *</label>
              <input name="street" value={formData.street} onChange={set} required className={inputCls} placeholder="12 Rue de la Paix" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Ville *</label>
                <input name="city" value={formData.city} onChange={set} required className={inputCls} placeholder="Tunis" />
              </div>
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Code postal</label>
                <input name="zipcode" value={formData.zipcode} onChange={set} className={inputCls} placeholder="1000" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Pays *</label>
                <input name="country" value={formData.country} onChange={set} required className={inputCls} placeholder="Tunisie" />
              </div>
              <div>
                <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1">Téléphone *</label>
                <input name="phone" value={formData.phone} onChange={set} required className={inputCls} placeholder="+216 xx xxx xxx" />
              </div>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-8">Résumé</p>

          {/* Articles */}
          <div className="flex flex-col gap-4 mb-6">
            {Object.entries(cartItems).map(([itemId, sizes]) =>
              Object.entries(sizes).map(([size, qty]) => {
                if (qty <= 0) return null;
                const p = products.find(pr => String(pr._id) === String(itemId));
                if (!p) return null;
                const price = p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
                return (
                  <div key={`${itemId}-${size}`} className="flex items-center gap-3">
                    <div className="w-12 h-14 overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] tracking-widest uppercase text-gray-700 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{size} · Qté {qty}</p>
                    </div>
                    <p className="text-sm text-gray-900 flex-shrink-0">
                      {(price * qty).toLocaleString("fr-TN")}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Totaux */}
          <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
            <div className="flex justify-between text-xs">
              <span className="tracking-widest uppercase text-gray-500">Sous-total</span>
              <span>{total.toLocaleString("fr-TN")} TND</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="tracking-widest uppercase text-gray-500">Livraison</span>
              <span>{delivery_fee.toLocaleString("fr-TN")} TND</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-3 border-t border-gray-100">
              <span className="tracking-widest uppercase">Total</span>
              <span>{(total + delivery_fee).toLocaleString("fr-TN")} TND</span>
            </div>
          </div>

          {/* Paiement */}
          <div className="mt-8">
            <p className="text-[9px] tracking-widest uppercase text-gray-400 mb-4">Paiement</p>
            <div className="flex items-center gap-3 border border-gray-900 px-4 py-3">
              <div className="w-2 h-2 bg-gray-900 flex-shrink-0" />
              <span className="text-xs tracking-widest uppercase text-gray-700">Paiement à la livraison</span>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full mt-6 bg-black text-white py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-40">
            {submitting ? "Traitement…" : "Confirmer la commande"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
