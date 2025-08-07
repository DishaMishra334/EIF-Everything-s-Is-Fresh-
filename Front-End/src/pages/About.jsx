import React from 'react'
import Title from '../Componet/Title';
import { assets } from '../assets/assets';
import NewsletterBOX from '../Componet/NewsletterBox'

const About = () => {
  return (
    <div>
      {/* ABOUT US Section */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px] rounded-lg shadow-lg' src={assets.about_img} alt="Fresh produce" srcSet="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p className='w-full md:w-2/3 text-gray-600 break-words leading-relaxed'>
            EIF stands for Everything is Fresh. This website was created to make things easy for
            customers. It serves as a direct communication channel between customers and farmers,
            ensuring no third party is involved in the business. We are committed to customer
            satisfaction with our service and guarantee that all products will be fresh and pure.
            Should you have any issues, please do not hesitate to contact us.
          </p>
          <b className='text-gray-800 text-xl'>Our Mission</b> {/* Increased font size for emphasis */}
          <p className='w-full md:w-2/3 text-gray-600 break-words leading-relaxed mb-10'> {/* Added mb-10 for consistent spacing */}
            We're on a mission to bring fresh, organic produce to every home in Maharashtra and across India.
            You can be a part of this! Your support, through choosing our products, directly contributes to a healthier India.
            We guarantee our fruits and vegetables are cultivated 100% chem
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US Section - Grouped Title and Paragraph */}
      <div className='py-8 mt-10 md:mt-20'> {/* Consistent spacing and centering for the whole section */}
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>why choose us</h3>
        <p className='w-full md:w-2/3 mx-auto text-gray-600 break-words leading-relaxed mt-4'> {/* Added mt-4 for spacing between title and paragraph */}
          Choosing us means choosing **freshness, health, and a sustainable future**. We deliver the purest, most wholesome fruits
           and vegetables, cultivated right here in **Maharashtra** and across India, **100% chemical-free**. Every purchase supports
            our mission to make high-quality, organic produce accessible to everyone. Experience the difference of true freshness and 
            nourish your family with food that's good for you, and good for the planet.
        </p>
      </div>

      {/* Quality Assurance Section */}
      <div className='py-8 mt-10 md:mt-20'>
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>Quality Assurance</h3>
        <p className='w-full md:w-2/3 mx-auto text-gray-600 break-words leading-relaxed'>
          At EIF, **quality is our promise and our priority**. From seed to your doorstep, we implement rigorous quality control
           measures at every stage. Our dedicated team meticulously inspects each fruit and vegetable to ensure it meets our exacting
            standards for freshness, appearance, and ripeness. We partner exclusively with certified organic farms, 
            guaranteeing that every product is **100% chemical-free and sustainably grown**. Your satisfaction is paramount,
             and we are committed to delivering only the finest, most wholesome produce, consistently and reliably.
        </p>
      </div>

      {/* Convenience Section - NEW */}
      <div className='py-8 mt-10 md:mt-20'>
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>Convenience</h3>
        <p className='w-full md:w-2/3 mx-auto text-gray-600 break-words leading-relaxed'>
           We believe in making healthy eating effortless and accessible for everyone. Our intuitive, user-friendly platform has
            been designed with your busy lifestyle in mind, ensuring a seamless shopping experience from the moment you start browsing our
             wide selection of fresh produce. With just a few clicks, you can place your order, and we'll handle the rest, bringing the freshest, 
             farm-to-table goodness directly to your doorstep with unparalleled ease and efficiency. Enjoy the simplicity of healthy living, 
             delivered right to you.
        </p>
      </div>

      {/* Exceptional Customer Service Section - NEW */}
      <div className='py-8 mt-10 md:mt-20'>
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>Exceptional Customer Service</h3>
        <p className='w-full md:w-2/3 mx-auto text-gray-600 break-words leading-relaxed'>
         Beyond just delivering premium products, our commitment extends to providing truly exceptional customer service that sets us apart. 
         Our dedicated and knowledgeable team is always ready to assist you with any queries, concerns, or special requests you may have. 
         We strive to ensure every interaction is positive, efficient, and leaves you with complete satisfaction,
          fostering a delightful and trustworthy experience with EIF every single time.
        </p>
      </div>
        <NewsletterBOX/>
    </div>
  )
}

export default About