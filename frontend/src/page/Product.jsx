import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [tab, setTab] = useState('description');

  const productsSafe = products || [];

  // 🔎 Recherche du produit correspondant à l'ID
  useEffect(() => {
    if (!productId || productsSafe.length === 0) return;

    const found = productsSafe.find((p) => String(p._id) === String(productId));
    if (found) {
      setProductData(found);
      const first = Array.isArray(found.images) && found.images.length > 0 ? found.images[0] : '';
      setImage(first);
    } else {
      setProductData(null);
      setImage('');
    }
  }, [productId, productsSafe]);

  if (!productData) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* 🖼️ Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Miniatures */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {Array.isArray(productData.images) && productData.images.length > 0 ? (
              productData.images.map((imgSrc, idx) => (
                <img
                  key={idx}
                  onClick={() => setImage(imgSrc)}
                  src={imgSrc}
                  alt={`${productData.name} thumbnail ${idx + 1}`}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded hover:opacity-80"
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm">No image available</p>
            )}
          </div>

          {/* Image principale */}
          <div className="w-full sm:w-[80%] flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt={productData.name}
                className="w-full h-auto object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* 🧾 Infos produit */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <img key={i} src={assets.star} alt="star" className="w-3.5" />
              ))}
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {productData.price} {currency}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* 🪡 Taille */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes &&
                productData.sizes.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 rounded-md transition ${
                      item === size
                        ? 'border-orange-500 bg-orange-100'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>↩ Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* 📄 Description & Avis */}
      <div className="mt-12 border rounded-lg shadow-sm bg-white">
        <div className="border-b flex gap-6 text-sm px-6 pt-4">
          <button
            onClick={() => setTab('description')}
            className={`pb-3 ${
              tab === 'description'
                ? 'border-b-2 border-black font-medium'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab('reviews')}
            className={`pb-3 ${
              tab === 'reviews'
                ? 'border-b-2 border-black font-medium'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Reviews (122)
          </button>
        </div>

        <div className="p-6 text-gray-600 leading-relaxed text-sm flex flex-col gap-4">
          {tab === 'description' ? (
            <>
              <p>
                By Aura is a clothing brand that combines modern style and comfort, with a strong
                focus on quality and unique design in every piece.
              </p>
              <p>
                Each By Aura collection reflects an elegant and trendy identity, designed to bring
                durability and sophistication to your everyday wardrobe.
              </p>
            </>
          ) : (
            <>
              <p>
                Customers love By Aura for its perfect mix of fashion-forward design and everyday
                comfort.
              </p>
              <p>
                Our clothing is praised for its durability, style, and the confidence it gives to
                those who wear it.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Produits similaires */}
      <div className="mt-10">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
