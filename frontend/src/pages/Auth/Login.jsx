import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input, AuthLayout } from '../../components/index';
import { validateEmail } from '../../utils/helper'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    // Handle login logic
    const handleLogin = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            console.log(error)
        }

        if (!password || !(password > password.length > 8)) {
            setError("Please ensure your password first");
        }

        // setError("");

        // Login API Call


    };
    return (
        <AuthLayout>
            <div className='flex  flex-col justify-center  p-6 rounded-md shadow-md '>
                <h3 className='text-xl font-semibold text-black'>Welcome</h3>
                <p className='text-xs text-slate-700 mt-2 mb-6'>
                    Please Enter your details to log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        label='Email Address'
                        placeholder='john@example.com'
                        type='email'
                        required={true}
                        onChange={({ target }) => setEmail(target.value)}
                    />
                    <Input
                        value={password}
                        label='Password'
                        placeholder='Min 8 Characters'
                        type='password'
                        required={true}
                        onChange={({ target }) => setPassword(target.value)}
                    />

                    {error && <p className='text-red-500 text-xs pb-2-5'>{error}</p>}

                    <p className='text-[13px] text-slate-800 mt-3 mb-3 ' >
                        Don't have an account? {" "}
                        <Link to='/register' className='font-medium text-primary underline ' >
                            Register
                        </Link>

                    </p>

                    <button type="submit" className='btn-primary'>
                        LOGIn
                    </button>

                </form>
            </div>
        </AuthLayout>

    )
}

export default Login