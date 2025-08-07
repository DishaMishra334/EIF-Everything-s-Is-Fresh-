import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App'; 
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, password });

      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        const receivedToken = response.data.token;

       
        localStorage.setItem('token', receivedToken);

      
        setToken(receivedToken);

      
        axios.defaults.headers.common['token'] = receivedToken;

        toast.success("Login successful!");
      } else {
        toast.error(response.data.message || "Login failed. Please check credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        toast.error(error.response.data.message || 'Server error. Please try again.');
      } else if (error.request) {
        toast.error('No response from server. Check your internet or backend.');
      } else {
        toast.error('Unexpected error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Admin Panel Login</h1>

        <form onSubmit={onSubmitHandler}>
          <div className='mb-4 min-w-72'>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              id="email"
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              type='email'
              placeholder='your@email.com'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-6 min-w-72'>
            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              id="password"
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              type='password'
              placeholder='Enter your password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className='mt-2 w-full py-2 px-4 rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
