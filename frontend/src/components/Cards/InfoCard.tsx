import React from 'react'
import { IconType } from 'react-icons/lib'

interface InfoCardProps {
    icon?: IconType;
    label?: string;
    value?: string;
    color?: string
}

const InfoCard = ({ icon, label, value, color }: InfoCardProps) => {
    return (
        <div className='flex items-center gap-3'>
            <div className={`w-2 md:w-2 h-3 md:h-5 rounded-full ${color} `} />

            <p className='text-xs md:text-[14px] text-gray-500 dark:text-gray-200'>
                <span className='text-sm md:text-[15px] text-black font-semibold mr-1 dark:text-white'>{value}</span>
                {label}
            </p>
        </div>
    )
}

export default InfoCard