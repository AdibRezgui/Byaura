import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [method, setMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error("Vous devez être connecté pour passer une commande !")
      return
    }

    try {
      const orderItems = []

      for (const itemsId in cartItems) {
        for (const size in cartItems[itemsId]) {
          if (cartItems[itemsId][size] > 0) {
            const productInfo = structuredClone(products.find(p => p._id === itemsId))
            if (productInfo) {
              productInfo.size = size
              productInfo.quantity = cartItems[itemsId][size]
              orderItems.push(productInfo)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method.toUpperCase()
      }

      const response = await axios.post(
        `${backendURL}/api/order/place`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success('Commande passée avec succès !')
        setCartItems({})
        navigate('/orders')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <form className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]' onSubmit={onSubmitHandler}>
      {/* Left: Delivery Info */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'><Title text1='DELIVERY' text2='INFORMATION' /></div>
        <div className='flex gap-3'>
          <input name='firstName' value={formData.firstName} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First Name'/>
          <input name='lastName' value={formData.lastName} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last Name'/>
        </div>
        <input name='email' value={formData.email} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email'/>
        <input name='street' value={formData.street} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street'/>
        <div className='flex gap-3'>
          <input name='city' value={formData.city} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City'/>
          <input name='state' value={formData.state} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State'/>
        </div>
        <div className='flex gap-3'>
          <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Zipcode'/>
          <input name='country' value={formData.country} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country'/>
        </div>
        <input name='phone' value={formData.phone} onChange={onChangeHandler} required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone'/>
      </div>

      {/* Right: Payment & Cart */}
      <div className='mt-8 min-w-[80%] sm:min-w-[480px]'>
        <CartTotal />
        <div className='mt-12'>
          <Title text1='PAYMENT' text2='METHOD'/>
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-green-400':''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
        </div>
        <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
