import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
    return (
        <div >
            <div>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </div>
        </div>
    )
}

export default Start