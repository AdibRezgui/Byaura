import React, { useContext, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({ id, image, name, price, salePrice, sizes, color, colorGroup }) => {
  const { currency, addToCart, colorGroups } = useContext(ShopContext);
  const navigate = useNavigate();
  const isOnSale = salePrice && salePrice > 0 && salePrice < price;
  const discount = isOnSale ? Math.round((1 - salePrice / price) * 100) : 0;

  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef(null);

  const availableSizes = sizes
    ? Object.entries(sizes).filter(([, qty]) => qty > 0).map(([s]) => s)
    : [];

  const variants = colorGroup && colorGroups[colorGroup]
    ? colorGroups[colorGroup].filter((p) => String(p._id) !== String(id))
    : [];

  const handlePlus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (availableSizes.length === 0) {
      addToCart(id, "TU");
      flashAdded();
      return;
    }
    setShowSizes((s) => !s);
  };

  const handleSizeClick = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, size);
    setShowSizes(false);
    flashAdded();
  };

  const flashAdded = () => {
    setAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group block text-gray-800 relative">
      <Link to={`/product/${id}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-white aspect-[3/4] flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
            />
          ) : (
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Info row */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${id}`} className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-gray-700 leading-snug line-clamp-1">
              {name}
            </p>
          </Link>

          {/* Quick add button */}
          <button
            onClick={handlePlus}
            className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-200 text-sm leading-none mt-[-2px] ${
              added
                ? "bg-black text-white border-black"
                : "border-gray-300 text-gray-400 hover:border-black hover:text-black"
            }`}
          >
            {added ? "✓" : "+"}
          </button>
        </div>

        {/* Size picker popup */}
        {showSizes && (
          <div className="absolute z-30 mt-1 right-0 bg-white border border-gray-200 shadow-lg rounded-xl p-3 min-w-[180px]">
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">Choisir une taille</p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeClick(e, size)}
                  className="text-xs border border-gray-300 hover:border-black hover:bg-black hover:text-white px-2.5 py-1 rounded-lg transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }}
              className="mt-2 text-[10px] text-gray-400 hover:text-black w-full text-left"
            >
              Annuler
            </button>
          </div>
        )}

        <div className="mt-1 flex items-center gap-2">
          {isOnSale ? (
            <>
              <p className="text-xs font-medium text-gray-900">{salePrice.toLocaleString("fr-TN")} {currency}</p>
              <p className="text-[11px] text-gray-400 line-through">{price.toLocaleString("fr-TN")} {currency}</p>
            </>
          ) : (
            <p className="text-xs text-gray-600">{price?.toLocaleString("fr-TN")} {currency}</p>
          )}
        </div>

        {/* Pastilles couleur — sous le prix */}
        {variants.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className="w-3 h-3 border border-gray-400 flex-shrink-0"
              style={{ backgroundColor: color || "#000" }}
              title="Couleur actuelle"
            />
            {variants.map((v) => (
              <button
                key={v._id}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${v._id}`); }}
                className="w-3 h-3 border border-gray-200 hover:border-gray-600 flex-shrink-0 transition-colors"
                style={{ backgroundColor: v.color || "#ccc" }}
                title={v.name}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductItem;
