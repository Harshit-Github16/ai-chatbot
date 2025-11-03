'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('tara_user_id');
        if (storedUser) {
            setUser({
                id: storedUser,
                name: localStorage.getItem('tara_user_name') || 'User',
                email: localStorage.getItem('tara_user_email') || '',
                photo: localStorage.getItem('tara_user_photo') || ''
            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        // Store user info in localStorage
        localStorage.setItem('tara_user_id', userData.id);
        localStorage.setItem('tara_user_name', userData.name);
        localStorage.setItem('tara_user_email', userData.email);
        localStorage.setItem('tara_user_photo', userData.photo || '');
    };

    const logout = () => {
        setUser(null);
        // Clear localStorage
        localStorage.removeItem('tara_user_id');
        localStorage.removeItem('tara_user_name');
        localStorage.removeItem('tara_user_email');
        localStorage.removeItem('tara_user_photo');
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};