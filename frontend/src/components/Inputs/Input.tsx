import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    type: string;
    required?: boolean;
}

const Input = ({
    value,
    onChange,
    label,
    placeholder,
    type,
    required = false,
}: InputProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div className='flex flex-col gap-y-2'>
            <label
                htmlFor={label}
                className='text-[13px] text-neutral-800 dark:text-neutral-100'
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
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