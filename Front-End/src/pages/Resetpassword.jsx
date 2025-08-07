// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Extract token from URL query parameters (e.g., /reset-password?token=YOUR_TOKEN)
        const queryParams = new URLSearchParams(location.search);
        const resetToken = queryParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError('Invalid or missing reset token.');
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('No reset token found.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) { // Example: enforce minimum password length
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            // Replace with your actual backend API endpoint for reset password
            const response = await fetch('http://localhost:4000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message || 'Your password has been reset successfully!');
                // Optionally redirect to login page after a delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            console.error('Reset password request error:', err);
            setError('Failed to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!token && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
                <div className="text-center text-gray-700">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

                {error && !token ? ( // Display error if no token found initially
                    <p className="mt-4 text-center text-red-600 bg-red-100 border border-red-200 rounded-md p-3">
                        {error}
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold text-lg shadow-md"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                {message && (
                    <p className="mt-4 text-center text-green-600 bg-green-100 border border-green-200 rounded-md p-3">
                        {message}
                    </p>
                )}
                {error && token && ( // Display error if token is present but other errors occur
                    <p className="mt-4 text-center text-red-600 bg-red-100 border border-red-200 rounded-md p-3">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
