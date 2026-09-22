import { useContext, createContext, useEffect, useState } from "react";
import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get("https://localhost:7243/api/Employees/me", { withCredentials: true });
            setUser(res.data?.results ?? null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

         const logout = async () => {
        await axios.post("https://localhost:7243/api/Employees/Logout", {}, { withCredentials: true });
        setUser(null);
        };

        useEffect(()=>{checkAuth();},[]);
    
    return (
        <AuthContext.Provider value={{user, loading, checkAuth, logout : logout(), isLoggedIn : !!user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);