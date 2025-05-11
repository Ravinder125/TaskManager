import React, { useState } from 'react'

const AuthLayout = ({ children }) => {
    return (
        <div className='min-h-screen w-full md:w-[60] p-4 xl:px-12 xl:pt-8 xl:pb-12' >
            <h1 className='text-lg font-medium text-black'>Task Manager</h1>
            {children}
        </div>
    )
}

export default AuthLayout