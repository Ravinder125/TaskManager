import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContextType, UserType } from '../types/user.type';
import { UpdateUserPayload } from '../types/api.type';




export const UserContext = createContext<UserContextType>({
    user: null,
    clearUser: () => { },
    error: "",
    isAuthenticated: false,
    loading: false,
    updateUser: (user: UserType) => user
});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile on mount
    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const { data } = await axiosInstance.get(
                    API_PATHS.AUTH.GET_PROFILE,
                );
                if (isMounted) {
                    setUser(data.data);
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
    }, [setUser]);

    // Update user info (e.g. after profile edit)
    const updateUser = useCallback((userData: UserType) => {
        setUser(prev => ({ ...prev!, ...{ ...userData } }))
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
