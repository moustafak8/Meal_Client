import { createContext, useContext, useState, useEffect, type JSX, type ReactNode } from "react";

interface User {
    id: number;
    user_type_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface LoginContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const loginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({children}: {children: ReactNode}): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                // If parsing fails, clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (userData: User, authToken: string): void => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!token && !!user;

    return (
        <loginContext.Provider value={{user, token, isAuthenticated, login, logout}}>
            {children}
        </loginContext.Provider>
    );
};

export const useLogin = (): LoginContextType => {
    const context = useContext(loginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};
