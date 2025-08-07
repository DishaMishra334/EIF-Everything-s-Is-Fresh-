// src/AuthUtils.js

// A simple utility function to get the auth token from local storage.
// This is the most common way to handle authentication tokens on the frontend.
export const getAuthToken = () => {
    // Check if the 'auth-token' exists in local storage
    const token = localStorage.getItem('auth-token');
    return token;
};
