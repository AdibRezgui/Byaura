import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice()

      // filtrer par category
      productsCopy = productsCopy.filter((item) => item.category === category)

      // filtrer par subCategory
      productsCopy = productsCopy.filter((item) => item.subCategory === subCategory)

      // garder max 5
      setRelated(productsCopy.slice(0, 5))
    }
  }, [products, category, subCategory])

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1="VOUS AIMEREZ" text2="AUSSI" />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <div key={index} className="relative">
            <ProductItem
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
              salePrice={item.salePrice}
              sizes={item.sizes}
              color={item.color}
              colorGroup={item.colorGroup}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
