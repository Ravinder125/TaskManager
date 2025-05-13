import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setCurrentPath } from '../../utils/routerTracker';


const getCurrentPath = () => {
    const location = useLocation();

    useEffect(() => {
        setCurrentPath(location.pathname)
    }, [location.pathname])
    // return (

    // )
}

export default getCurrentPath