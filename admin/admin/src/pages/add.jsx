import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'; 

const Add = ({token}) => { 

    // Initialize image states with null, not false.
    // When no file is selected, it should be null or undefined.
    const [image1, setImage1] = useState(null)
    const [image2, setImage2] = useState(null)
    const [image3, setImage3] = useState(null)
    const [image4, setImage4] = useState(null)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("Vegetables")
    const [bestseller, setBestseller] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("bestseller", bestseller)

            // Only append the image to formData if it exists (is not null/false)
            if (image1) formData.append("image1", image1);
            if (image2) formData.append("image2", image2);
            if (image3) formData.append("image3", image3);
            if (image4) formData.append("image4", image4);
            
            const response = await axios.post(backendUrl + "/api/product/add", formData, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })

            console.log(response.data)

            if (response.data.success) {
                toast.success(response.data.message);
                
                // Reset image states to null after successful upload
                setImage1(null);
                setImage2(null);
                setImage3(null);
                setImage4(null);
                setName("");
                setDescription("");
                setPrice("");
                setCategory("Vegetables"); 
                setBestseller(false);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error("Error adding product:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while adding the product.");
            }
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
            <div>
                <p className='mb-2'>Upload Image</p>
                <div className='flex gap-2'>
                    <label htmlFor='image1'>
                        {/* Use null check for image display */}
                        <img className='w-20' src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="Upload area" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor='image2'>
                        <img className='w-20' src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="Upload area" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor='image3'>
                        <img className='w-20' src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="Upload area" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor='image4'>
                        <img className='w-20' src={image4 ? URL.createObjectURL(image4) : assets.upload_area} alt="Upload area" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='type here' id="" />
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product description</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='write here contant' id="" />
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8' >
                <div>
                    <p>Product Category</p>
                    <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Vegetables</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Product Price</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type='Number' placeholder='25' />
                </div>
            </div>

            <div className='flex gap-2 mt-2'>
                <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type='checkbox' id='bestseller' />
                <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
            </div>

            <button type="submit" className='w-28 py-3 mt-4 bg-[#61f328] text-black'>ADD</button>
        </form>
    )
}

export default Add
