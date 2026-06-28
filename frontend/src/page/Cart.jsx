import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, delivery_fee } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const items = [];
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        if (cartItems[id][size] > 0) {
          items.push({ _id: id, size, quantity: cartItems[id][size] });
        }
      }
    }
    setCartData(items);
  }, [cartItems]);

  const total = getCartAmount();

  if (cartData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 border-t border-gray-100 pt-16">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-300">Panier vide</p>
        <Link to="/collection"
          className="text-[11px] tracking-[0.3em] uppercase border-b border-gray-900 pb-0.5 hover:opacity-40 transition-opacity">
          Découvrir la collection →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-24 border-t border-gray-100">

      {/* En-tête */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-5 mb-0">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-1">Mon panier</p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            {cartData.reduce((s, i) => s + i.quantity, 0)} article{cartData.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
          </h1>
        </div>
        <Link to="/collection"
          className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors pb-1 border-b border-transparent hover:border-black">
          Continuer les achats
        </Link>
      </div>

      {/* Articles */}
      <div className="divide-y divide-gray-100">
        {cartData.map((item, i) => {
          const p = products.find(pr => String(pr._id) === String(item._id));
          if (!p) return null;
          const price = p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
          const isOnSale = p.salePrice && p.salePrice > 0;

          return (
            <div key={i} className="py-7 flex items-start gap-5 sm:gap-8">
              {/* Image */}
              <Link to={`/product/${p._id}`} className="flex-shrink-0">
                <div className="w-20 sm:w-28 aspect-[3/4] overflow-hidden bg-gray-50">
                  <img src={p.image || p.images?.[0]} alt={p.name}
                    className="w-full h-full object-cover object-top" />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <Link to={`/product/${p._id}`}>
                  <p className="text-[11px] tracking-widest uppercase text-gray-800 leading-snug">{p.name}</p>
                </Link>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Taille : {item.size}</p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium text-gray-900">{price?.toLocaleString("fr-TN")} {currency}</p>
                  {isOnSale && (
                    <p className="text-xs text-gray-400 line-through">{p.price?.toLocaleString("fr-TN")} {currency}</p>
                  )}
                </div>
              </div>

              {/* Quantité + supprimer */}
              <div className="flex flex-col items-end gap-4 flex-shrink-0">
                <button onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="text-gray-300 hover:text-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center border border-gray-200">
                  <button onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                    className="w-8 h-8 text-gray-400 hover:text-black transition-colors text-lg leading-none">
                    −
                  </button>
                  <span className="w-8 text-center text-sm text-gray-700">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className="w-8 h-8 text-gray-400 hover:text-black transition-colors text-lg leading-none">
                    +
                  </button>
                </div>

                <p className="text-sm font-light text-gray-900">
                  {(price * item.quantity)?.toLocaleString("fr-TN")} {currency}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé commande */}
      <div className="flex justify-end mt-8">
        <div className="w-full sm:w-80 border-t border-gray-900 pt-6 flex flex-col gap-4">
          <div className="flex justify-between text-xs">
            <span className="tracking-widest uppercase text-gray-500">Sous-total</span>
            <span className="text-gray-900">{total.toLocaleString("fr-TN")} {currency}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="tracking-widest uppercase text-gray-500">Livraison</span>
            <span className="text-gray-900">{delivery_fee.toLocaleString("fr-TN")} {currency}</span>
          </div>
          <div className="flex justify-between text-sm pt-4 border-t border-gray-100">
            <span className="tracking-widest uppercase font-medium">Total</span>
            <span className="font-medium">{(total + delivery_fee).toLocaleString("fr-TN")} {currency}</span>
          </div>

          <button onClick={() => navigate("/place-order")}
            className="w-full bg-black text-white py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors mt-2">
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
