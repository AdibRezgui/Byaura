import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden rounded-xl shadow-sm">
        <img
          className="hover:scale-110 transition ease-in-out w-full h-64 object-cover"
          src={image}
          alt={name}
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/300x300?text=Image+Error")
          }
        />
      </div>
      <p className="pt-3 pb-1 text-sm font-medium text-gray-800">{name}</p>
      <p className="text-sm font-semibold text-gray-600">
        {price} {currency}
      </p>
    </Link>
  );
};

export default ProductItem;
