import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { MapPin, Phone, Mail } from 'lucide-react' // icônes modernes

const Contact = () => {
  return (
    <div className='bg-gradient-to-b from-white to-gray-50'>
      {/* Section Title */}
      <div className='text-center text-3xl pt-16 border-t border-gray-200'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Main Section */}
      <div className='max-w-6xl mx-auto my-16 flex flex-col md:flex-row items-center gap-16 px-6'>

        {/* Left - Image */}
        <div className='w-full md:w-1/2 relative'>
          <div className='rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500'>
            <img
              src={assets.contactcover}
              alt='Contact'
              className='w-full object-cover'
            />
          </div>
        </div>

        {/* Right - Info */}
        <div className='w-full md:w-1/2 flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-gray-800 tracking-wide'>
            Our Store
          </h2>

          <div className='flex items-start gap-3 text-gray-600'>
            <MapPin className='w-5 h-5 mt-1 text-black' />
            <p>
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>
          </div>

          <div className='flex items-start gap-3 text-gray-600'>
            <Phone className='w-5 h-5 mt-1 text-black' />
            <p>(415) 555-0132</p>
          </div>

          <div className='flex items-start gap-3 text-gray-600'>
            <Mail className='w-5 h-5 mt-1 text-black' />
            <p>admin@forever.com</p>
          </div>

          <div className='border-t border-gray-300 pt-6 mt-2'>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Careers at Forever
            </h3>
            <p className='text-gray-600 mb-6'>
              Learn more about our teams, culture, and exciting job openings.
            </p>
            <button className='relative group border border-black px-8 py-3 text-sm font-medium text-gray-800 rounded-full overflow-hidden transition-all duration-500'>
              <span className='absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500'></span>
              <span className='relative z-10 group-hover:text-white transition-colors duration-300'>
                Explore Jobs
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
