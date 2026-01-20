import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const useUserAuth = () => {
    const { isAuthenticated, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (isAuthenticated) return;

        if (!isAuthenticated) {
            clearUser();
            navigate('/login');
        }
    }, [isAuthenticated, loading, clearUser, navigate]);
};

export default useUserAuth;