import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

const SelectDropdown = ({
    options,
    value,
    onChange,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)
    }
    return (
        <div className='relative w-full '>
            {/* Dropdown Button  */}
            <button
                className='w-full text-sm text-black outline-none bg-inherit border border-neutral-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center dark:border-neutral-600 dark:text-neutral-100'
                onClick={() => setIsOpen(prev => !prev)}
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className='ml-2 transition-all duration-200' style={{ rotate: isOpen ? "180deg" : "0deg" }}>
                    <LuChevronDown />
                </span>
            </button>

            {/* DropdownMenu? */}
            {isOpen && (
                <div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 dark:bg-neutral-800 dark:border-neutral-600'>
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className='px-3 font-medium py-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700'
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SelectDropdown