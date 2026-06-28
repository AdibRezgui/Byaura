import React from 'react'
import Hero from '../components/Hero'
import PromoBlock from '../components/PromoBlock'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
     <Hero/>
     <PromoBlock prefix="promo" />
     <PromoBlock prefix="block2" />
     <BestSeller/>
     <OurPolicy/>
     <NewsletterBox/>
    </div>
  )
}

export default Home
