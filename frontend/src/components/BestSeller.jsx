import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const BestSeller = () => {
  const { backendURL } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    axios.get(`${backendURL}/api/product/bestsellers`)
      .then(({ data }) => {
        if (data.success && data.products.length > 0) {
          const mapped = data.products.map((p) => {
            const images = Array.isArray(p.images) ? p.images.map((img) => {
              const cleaned = img.replace(/\\/g, '/');
              if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned;
              return `${backendURL}${cleaned.startsWith('/') ? cleaned : '/uploads/' + cleaned}`;
            }) : [];
            return { ...p, image: images[0] || '' };
          });
          setBestSeller(mapped);
        }
      })
      .catch(() => {});
  }, [backendURL]);

  if (bestSeller.length === 0) return null;

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'MEILLEURES'} text2={'VENTES'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Les articles les plus appréciés et commandés par nos clients.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item) => (
          <div key={item._id} className="relative">
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              salePrice={item.salePrice}
              sizes={item.sizes}
              color={item.color}
              colorGroup={item.colorGroup}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
