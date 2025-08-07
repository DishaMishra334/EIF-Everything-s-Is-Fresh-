import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = 'http://localhost:4000';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setList(response.data.products || []);
        console.log("Fetched products:", response.data.products);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error("Error fetching product list:", err);
      toast.error('Network error or server unreachable');
      setError('Network error or server unreachable');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id: productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Re-fetch the list to update the UI
      } else {
        toast.error(response.data.message || 'Failed to remove product');
      }
    } catch (err) {
      console.error("Error removing product:", err);
      toast.error('Error removing product');
    }
  };

  // Filter the list based on the searchTerm
  const filteredList = useMemo(() => {
    if (!searchTerm) {
      return list;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return list.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.category.toLowerCase().includes(lowerCaseSearchTerm)
      // You can add more fields here if you want to search by description, etc.
    );
  }, [list, searchTerm]); // Re-calculate only when list or searchTerm changes

  useEffect(() => {
    if (token) {
      fetchList();
    } else {
      setLoading(false);
      setError("Please log in to view products.");
      toast.error("Please log in to view products.");
    }
  }, [token]);

  return (
    <div className='p-4 md:p-8 flex flex-col items-center w-full min-h-screen bg-gray-50 font-sans'>
      <div className='w-full max-w-4xl bg-white shadow-xl rounded-lg p-4 md:p-8'>
        <p className='text-2xl font-bold mb-6 text-gray-800 text-center'>ALL Products List</p>

        {/* Search Input Field */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-4'>
          {/* Desktop/Tablet Header Row */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_0.8fr] items-center py-3 px-4 border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 rounded-md shadow-sm'>
            <b className="truncate">IMAGE</b>
            <b className="truncate">NAME</b>
            <b className="truncate">CATEGORY</b>
            <b className="truncate">PRICE</b>
            <b className="truncate text-center">ACTION</b>
          </div>

          {/* Conditional Rendering based on loading/error/data */}
          {loading && (
            <div className="text-center text-gray-600 py-10 text-lg">Loading products...</div>
          )}

          {error && (
            <div className="text-center text-red-500 py-10 text-lg">Error: {error}</div>
          )}

          {/* Display message if no products found after filtering */}
          {!loading && !error && filteredList.length === 0 && searchTerm !== '' && (
            <div className="text-center text-gray-600 py-10 text-lg">No products found matching "{searchTerm}".</div>
          )}

          {/* Display message if no products exist at all */}
          {!loading && !error && list.length === 0 && searchTerm === '' && (
            <div className="text-center text-gray-600 py-10 text-lg">No products added yet.</div>
          )}


          {/* Product List Items - now mapping over filteredList */}
          {!loading && !error && filteredList.length > 0 && filteredList.map((item, index) => {
            const imageUrl = Array.isArray(item.image) && item.image.length > 0
              ? item.image[0]
              : `https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image`;

            return (
              <div
                key={item._id || index}
                className='grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_0.8fr] gap-y-3 md:gap-y-0 items-center py-4 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-base text-gray-800 rounded-lg shadow-sm transition-all duration-200'
              >
                {/* Mobile: Image at the top, then details */}
                <div className="flex justify-center md:hidden mb-2">
                  <img
                    src={imageUrl}
                    alt={item.name || 'Product Image'}
                    className='w-24 h-24 object-cover rounded-lg shadow-md'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100/E0E0E0/333333?text=Error";
                    }}
                  />
                </div>

                {/* Desktop/Tablet: Image in grid */}
                <div className="hidden md:flex justify-center">
                  <img
                    src={imageUrl}
                    alt={item.name || 'Product Image'}
                    className='w-16 h-16 object-cover rounded-lg shadow-sm'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100/E0E0E0/333333?text=Error";
                    }}
                  />
                </div>

                {/* Product Name - Always visible, potentially bolder on mobile */}
                <p className="font-bold md:font-medium text-gray-900 truncate text-lg md:text-base">
                  <span className="md:hidden">Name: </span>{item.name}
                </p>

                {/* Category - Always visible */}
                <p className="text-gray-600 truncate text-sm md:text-base">
                  <span className="md:hidden">Category: </span>{item.category}
                </p>

                {/* Price - Always visible, formatted */}
              <p className="text-gray-800 font-bold md:font-semibold truncate text-lg md:text-base">
  <span className="md:hidden">Price: </span>
  ₹{item.variants && item.variants.length > 0 && item.variants[0].new_price
    ? item.variants[0].new_price.toFixed(2) // Access price from the first variant
    : 'N/A'}
</p>

                {/* Action Button - Always visible, centered on mobile too */}
                <div className="flex justify-center mt-2 md:mt-0">
                  <button
                    onClick={() => removeProduct(item._id)}
                    className='bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium shadow-md w-full md:w-auto'
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default List;