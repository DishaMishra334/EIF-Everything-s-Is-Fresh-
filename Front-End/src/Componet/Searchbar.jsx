import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom'; 

const Searchbar = () => {
    const { serach, setSerach, showSerach, setshowSerach } = useContext(ShopContext);
    const [isCollectionPage, setIsCollectionPage] = useState(false); 
      const location = useLocation(); 

   
    useEffect(() => {
       
        if (location.pathname.includes('/Collection')) {
            setIsCollectionPage(true);
        } else {
            setIsCollectionPage(false);
         
        }
    }, [location, showSerach, setshowSerach]);

   
    return showSerach && isCollectionPage ? (
        <div className='border-t border-b bg-gray-50 text-center'>
            <div className='inline-flex itme-center justify-center border border-gray-400 px-5 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input
                    value={serach}
                    onChange={(e) => setSerach(e.target.value)}
                    className='flex-1 outline-none bg-inherit text-sm'
                    type="text"
                    placeholder='Search'
                />
                <img className='w-4' src={assets.search_icon} alt="" />
            </div>
            <img onClick={() => setshowSerach(false)} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
        </div>
    ) : null;
};

export default Searchbar;