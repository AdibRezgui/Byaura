import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const TotalCart = () => {

  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        
        {/* Subtotal */}
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{getCartAmount().toFixed(2)} {currency}</p>
        </div>

        <hr />

        {/* Shipping Fee */}
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{delivery_fee.toFixed(2)} {currency}</p>
        </div>

        <hr />

        {/* Total */}
        <div className='flex justify-between'>
          <b>Total</b>
          <b>
            {(getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee).toFixed(2)} {currency}
          </b>
        </div>
      </div>
    </div>
  )
}

export default TotalCart
