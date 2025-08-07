import React from 'react'
import Title from '../Componet/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../Componet/NewsletterBox'
const Contect = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
     <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" srcset="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>Our Stor</p>
        <p className='text-gray-500'>54709 Willms Station <br/> Suite 350,Washington DC,USA</p>
        <p className='text-gray-500'>+91 99308 91228 <br/> Email:- dishamishra335@gmail.com</p>
        <p className='font-semibold text-xl text-gray-600'>Careers at EIF</p>
        <p className='text-gray-500'>Learn more about our team  and job openings</p>
        
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs</button> 
          <p  className='w-full md:w-2/3 text-gray-600 break-words leading-relaxed'>
         This website is made by Disha Jayendra Mishra. If you have any issues with the website or its 
         services, please contact us using the given mobile number and Email</p>
     </div>
     <NewsletterBox/>
      </div>
    </div>
  )
}

export default Contect
