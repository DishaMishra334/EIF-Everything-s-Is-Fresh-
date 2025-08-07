import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import { ShopContext } from '../Context/ShopContext';
import Productitem from './Productitem'; // Assuming Productitem might contain images

const BestSeller = () => {

  const { products } = useContext(ShopContext);
  const [bestseller, setBestseller] = useState([]);

  useEffect(() => {
    // Filters products marked as 'bestseller'
    const bestProduct = products.filter((item) => (item.bestseller));
    // Takes the first 10 bestseller products
    setBestseller(bestProduct.slice(0,10))
  }, [products]) // Added products to dependency array to re-run if products data changes

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        {/* Updated text with correct grammar and spelling */}
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 break-words'>
          Best Sellers are always the ones which are good in price and also good for health.
          These are the ones which are frequently ordered.
        </p>
      </div>
      {/* Displays the grid of bestseller products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
        {
          bestseller.map((item,index) => (
            // Renders each bestseller product using the Productitem component
            // ⭐ FIX: Pass the entire 'item' object as 'product' prop to Productitem.
            // Productitem should then extract id, name, image, and calculate price from variants.
            <Productitem key={item._id} product={item} />
          ))
        }
      </div>
    </div>
  )
}

export default BestSeller;