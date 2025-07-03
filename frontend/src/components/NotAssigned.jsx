import React from 'react'

const NotAssigned = ({ text, className = '' }) => {
    return (
        <div className={`text-center text-slate-500  flex items-center justify-center font-semibold text-2xl ${className}`}>
            {text || 'No task assigned yet!'}
        </div>
    )
}

export default NotAssigned