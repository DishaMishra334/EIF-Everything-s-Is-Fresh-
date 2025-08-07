import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import Productitem from './Productitem';

const LetestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestproducts, setLatestProducts] = useState([]);

    useEffect(() => {
        // Ensure products array is available and not empty
        if (!products || products.length === 0) {
            setLatestProducts([]);
            return;
        }

        // Sort products by the 'date' property (which is a Number/timestamp)
        const sortedProducts = [...products].sort((a, b) => {
            // Sort in descending order to get the latest first
            // If 'date' is a Number (timestamp), direct subtraction works.
            return b.date - a.date;
        });

        // Slice the sorted products to get the latest 10
        setLatestProducts(sortedProducts.slice(0, 10));
    }, [products]); // Re-run when 'products' data changes

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'VEGGIES'} text2={' and FRUITS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-800'>
                    Cultivating and Curating Veggies and Fruits Packed with Bioactive Compounds, Ensuring Every Bite Fuels Your Well-being.
                </p>
            </div>
            {/* Rendering Product */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    latestproducts.map((item) => (
                        <Productitem key={item._id} product={item} />
                    ))
                }
            </div>
        </div>
    );
};

export default LetestCollection;