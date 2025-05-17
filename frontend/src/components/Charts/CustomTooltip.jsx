import React from 'react'

const CustomTooltip = ({ active, payload, duration }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white shadow-md  rounded-lg p-2 border-gray-300'>
                <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].fullName}</p>
                <p className='text-sm text-gray-600'>
                    Count: <span className='text-sm font-medium text-gray-900' >{payload[0].value}</span>
                </p>
            </div>
        )
    }
}

export default CustomTooltip