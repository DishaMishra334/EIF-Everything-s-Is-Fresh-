// pages/collections.jsx
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets'; // Ensure this path is correct
import Title from '../Componet/Title'; // Ensure this path is correct
import Productitem from '../Componet/Productitem'; // Ensure this path is correct

const Collections = () => {
  const { products, serach, showSerach } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const applyFilterAndSort = () => {
    let productsToProcess = Array.isArray(products) ? products.slice() : [];

    if (showSerach && serach) {
      productsToProcess = productsToProcess.filter(item => item.name.toLowerCase().includes(serach.toLowerCase()))
    }

    if (selectedCategories.length > 0) {
      productsToProcess = productsToProcess.filter(item =>
        selectedCategories.includes(item.category)
      );
    }

    // ⭐ IMPORTANT: Modified sorting logic
    if (sortOption === 'low-high') {
      productsToProcess.sort((a, b) => {
          // Get the lowest price for product 'a'
          const priceA = getLowestPriceForSorting(a.variants);
          // Get the lowest price for product 'b'
          const priceB = getLowestPriceForSorting(b.variants);

          // Handle cases where prices might be null or NaN (treat them as very high for sorting)
          if (priceA === null || isNaN(priceA)) return 1;
          if (priceB === null || isNaN(priceB)) return -1;
          return priceA - priceB;
      });
    } else if (sortOption === 'high-low') {
      productsToProcess.sort((a, b) => {
          // Get the lowest price for product 'a'
          const priceA = getLowestPriceForSorting(a.variants);
          // Get the lowest price for product 'b'
          const priceB = getLowestPriceForSorting(b.variants);

          // Handle cases where prices might be null or NaN (treat them as very low for sorting)
          if (priceA === null || isNaN(priceA)) return -1;
          if (priceB === null || isNaN(priceB)) return 1;
          return priceB - priceA;
      });
    }

    setFilterProducts(productsToProcess);
  };

  // Helper function for sorting, similar to getLowestPrice in Productitem
  const getLowestPriceForSorting = (variants) => {
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
          return null;
      }
      const prices = variants
          .map(variant => parseFloat(variant.new_price))
          .filter(price => !isNaN(price));
      return prices.length > 0 ? Math.min(...prices) : null;
  };

  useEffect(() => {
    applyFilterAndSort();
  }, [products, selectedCategories, sortOption, serach, showSerach]); // Added dependencies

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-300'>
      <div className='min-w-60 p-4 bg-gray-50 rounded-lg shadow-sm'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold text-gray-800'
        >
          FILTER
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon} // Ensure assets.dropdown_icon is correctly defined
            alt="Dropdown Icon"
          />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 rounded-md ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium text-gray-700'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 items-center'>
              <input
                className='w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                type="checkbox"
                value={'vegetables'}
                onChange={toggleCategory}
                checked={selectedCategories.includes('vegetables')}
              />
              vegetables
            </label>
            <label className='flex gap-2 items-center'>
              <input
                className='w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                type="checkbox"
                value={'fruit'} // Ensure this matches your category name in product data
                onChange={toggleCategory}
                checked={selectedCategories.includes('fruit')}
              />
              fruits
            </label>
          </div>
        </div>
      </div>

      <div className='flex-1 p-4 bg-white rounded-lg shadow-sm'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'Products'} />
          <select
            className='border-2 border-gray-300 text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="relevant">sort by: Relevant</option>
            <option value="low-high">sort by: Price: Low to High</option>
            <option value="high-low">sort by: Price: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              // ⭐ IMPORTANT CHANGE: Pass the entire 'item' (product) object as 'product' prop
              <Productitem
                key={item._id || index} // Use _id for key if available, fallback to index
                product={item} // ⭐ PASS THE WHOLE PRODUCT OBJECT HERE ⭐
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">No products found matching your filters. Please check your product data and filter criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;