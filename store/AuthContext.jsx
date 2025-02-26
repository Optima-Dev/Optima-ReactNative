import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: (token) => {},
    logout: () => {},
});

function AuthProvider({ children }) {
    const [token, setToken] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('token').then((token) => {
            if (token) {
                setToken(token);
            }
        });
    }, []);

    function authenticate(token) {
        setToken(token);
        AsyncStorage.setItem('token', token);
    }

    function logout() {
        setToken(null);
        AsyncStorage.removeItem('token');
    }

    const value = {
        token,
        isAuthenticated: !!token,
        authenticate,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

