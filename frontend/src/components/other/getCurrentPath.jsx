import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setCurrentPath } from '../../utils/routerTracker';


const GetCurrentPath = () => {
    const location = useLocation();

    useEffect(() => {
        setCurrentPath(location.pathname)
    }, [location.pathname]);

    return null;
}

export default GetCurrentPath