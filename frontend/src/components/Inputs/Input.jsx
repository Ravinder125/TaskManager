import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({
    value,
    onChange,
    label,
    placeholder,
    type,
    required,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div className='flex flex-col gap-y-2'>
            <label
                htmlFor="Email"
                className='text-[13px] text-slate-800'
            >
                {label}
            </label>

            <div className='input-box'>
                <input
                    type={
                        type == 'password' ? (showPassword ? 'text' : 'password') : type
                    }
                    placeholder={placeholder}
                    className='w-full bg-transparent outline-none'
                    value={value}
                    onChange={e => onChange(e)}
                    required={required}
                />
                {type === 'password' && (
                    <>
                        {
                            showPassword ? (
                                <FaRegEye
                                    size={22}
                                    className='cursor-pointer'
                                    onClick={() => toggleShowPassword()}
                                />
                            ) : (
                                <FaRegEyeSlash
                                    size={22}
                                    className='cursor-pointer'
                                    onClick={() => toggleShowPassword()}
                                />
                            )
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default Input