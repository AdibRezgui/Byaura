import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ImageTiles from "./ui/ImageTiles";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products, navigate } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sorted = [...products].reverse();
      setLatestProducts(sorted.slice(0, 3));
    }
  }, [products]);

  if (latestProducts.length === 0) return null;

  const p = latestProducts;
  const get = (i) => p[i] || p[0];

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Découvrez notre dernière collection ! Ces produits ont été récemment ajoutés à la boutique.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative w-[520px] h-[360px] flex items-center justify-center">
          <ImageTiles
            leftImage={get(0).image}
            middleImage={get(1).image}
            rightImage={get(2).image}
            onClickLeft={() => navigate(`/product/${get(0)._id}`)}
            onClickMiddle={() => navigate(`/product/${get(1)._id}`)}
            onClickRight={() => navigate(`/product/${get(2)._id}`)}
          />
        </div>

        <Link
          to="/collection"
          className="text-sm tracking-widest text-gray-500 hover:text-black border-b border-gray-300 hover:border-black pb-0.5 transition-colors"
        >
          VOIR TOUTE LA COLLECTION →
        </Link>
      </div>
    </div>
  );
};

export default LatestCollection;
