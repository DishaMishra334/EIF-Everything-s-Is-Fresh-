import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      {/* Added 'max-w-full' to the logo image to ensure it scales down if needed */}
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32 max-w-full' alt="Company Logo" />
          {/* Added 'break-words' to ensure long text content wraps */}
          <p className='w-full md:w-2/3 text-gray-600 break-words'>
         EIF is the only platform where you can get fresh vegetables and fruits.
          The sole reason behind creating this website is to deliver fresh vegetables
           to your home. If you have any complaints or reviews, 
           you can add them in that particular product's review box.
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>HOME</li>
            <li>ABOUT US</li>
            <li>DELIVERY</li>
            <li>PRIVACY POLICY</li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600' >
            <li>+91 93260 43529</li>
            <li>dishamishra335@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2025@ EIF.com -All right Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer
