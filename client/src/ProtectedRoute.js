import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";


const ProtectedRoute = ({children}) => {
    const {isLoggedIn, loading} = useAuth();
    if(loading) return <p>LOADING...</p>
    return( isLoggedIn ? children : <Navigate to="/auth" />);
};

export default ProtectedRoute;