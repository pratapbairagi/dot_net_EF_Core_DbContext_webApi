import { useContext, createContext, useEffect, useState } from "react";
import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try{
            
            const res = await axios.get("https://localhost:7243/api/Employees/me", {
                headers : {
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            });

            if(res.status === 200){
                setUser(res.data?.results?? null);
            }
            else{
                setUser(null);
            }
        }
        catch(error){
            setUser(null);
        }
        finally{
            setLoading(false);
        };

        useEffect(()=>{checkAuth();},[]);

        const logout = async () => {
            try{
                await axios.post("https://localhost:7243/api/Employees/logout", {}, {
                    withCredentials : true
                });

                setUser(null);
            }
            catch(error){
                setUser(null);
            }
            finally{
                setUser(null);
            }
        }
    }
    return (
        <AuthContext.Provider value={{user, loading, checkAuth, logout : logout(), isLoggedIn : !!user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = useContext(AuthContext);