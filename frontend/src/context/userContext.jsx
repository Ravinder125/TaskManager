import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inviteToken, setInviteToken] = useState("")

    // Fetch user profile on mount
    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const { data } = await axiosInstance.get(
                    API_PATHS.AUTH.GET_PROFILE,
                );
                if (isMounted) {
                    setUser(data.data.user);
                    setInviteToken(data.data.inviteToken)
                    console.log(data.data.inviteToken)
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                    clearUser(); // logout or session expired
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUser();
        return () => {
            isMounted = false;
        };
    }, []);

    // Update user info (e.g. after profile edit)
    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    // Clear user session (e.g. on logout)
    const clearUser = useCallback(() => {
        setUser(null);
        setLoading(false);

    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                error,
                updateUser,
                clearUser,
                isAuthenticated: !!user,
                inviteToken,
                setInviteToken,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
