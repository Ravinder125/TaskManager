import React from 'react'

const Loading = () => {
    return (
        <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
            <svg className="animate-spin h-12 w-12 text-primary mb-4" viewBox="0 0 50 50">
                <circle
                    className="opacity-25"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M25 5a20 20 0 0 1 20 20"
                />
            </svg>
            <span className='text-2xl text-primary font-semibold'>Loading...</span>
        </div>
    )
}

export default Loading