import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext'; // Ensure this path is correct
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed and configured in your App.js/main file

const Login = () => {
    const [currentState, setCurrentState] = useState('Sign Up'); 
    const { setToken, navigate } = useContext(ShopContext); // Removed token as it's not directly used in the JSX or logic here

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // State for validation errors
    const [passwordError, setPasswordError] = useState('');

    // Function to validate password complexity
    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(pwd)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(pwd)) {
            return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            return "Password must contain at least one special character.";
        }
        return ""; // No error
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Client-side password validation for 'Sign Up'
        if (currentState === 'Sign Up') {
            const pwdValidationMessage = validatePassword(password);
            if (pwdValidationMessage) {
                setPasswordError(pwdValidationMessage);
                toast.error(pwdValidationMessage);
                return; // Stop submission if password is not valid
            }
        }
        setPasswordError(''); // Clear any previous password errors

        let url = "";
        let data = {};

        if (currentState === 'Sign Up') {
            url = '/api/user/register'; 
            data = { name, email, password };
        } else { // Current state is 'Login'
            url = '/api/user/login'; 
            data = { email, password }; 
        }

        try {
            const response = await axios.post(url, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token); 
                toast.success(response.data.message || `${currentState} successful!`);
                
                // Clear form fields
                setName('');
                setEmail('');
                setPassword('');
                
                navigate('/'); 
            } else {
                // Display error message from backend, which should include uniqueness errors
                toast.error(response.data.message || `Failed to ${currentState.toLowerCase()}.`);
            }
        } catch (error) {
            console.error("Authentication Error:", error);
            if (error.response) {
                // The server responded with a status code outside of 2xx
                // This is where uniqueness errors from the backend would be caught
                toast.error(error.response.data.message || `An error occurred: ${error.response.status}`);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("No response from server. Please check your network connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
            </div>
            {/* Render name input only if in 'Sign Up' state */}
            {currentState === 'Login' ? null : (
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    className='w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500' 
                    placeholder='Name' 
                    required
                />
            )}
            <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className='w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500' 
                placeholder='Email' 
                required 
            />
            <input 
                onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear password error as user types
                    if (passwordError) setPasswordError(''); 
                }} 
                value={password} 
                type="password" 
                className='w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500' 
                placeholder='Password' 
                required 
            />
            {passwordError && (
                <p className="text-red-500 text-xs mt-[-10px] w-full text-left">{passwordError}</p>
            )}
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <Link to="/forgot-password" className='cursor-pointer text-blue-600 hover:underline'>
                    Forgot your password?
                </Link>
                {
                    currentState === 'Login'
                    ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
                    : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                }
            </div>
            <button type="submit" className='bg-black text-white font-light px-8 py-2 mt-4 rounded-md hover:bg-gray-800 transition duration-300'>
                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
        </form>
    );
};

export default Login;
