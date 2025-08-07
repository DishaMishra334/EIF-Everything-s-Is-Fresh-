import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
    <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>refund and Exchange </p>
        <p className='text-gray-400'>we offer hassle free Exchange</p> 
    </div>
        <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>24 hours return Policy</p>
        <p className='text-gray-400'>we provide 24 hr free return policy</p> 
    </div>
        <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Best customer support</p>
        <p className='text-gray-400'>we provide 24/7 customer support</p> 
    </div>
    </div>
  )
}

export default OurPolicy
