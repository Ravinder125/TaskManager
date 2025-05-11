import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/layouts/Inputs/Input'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    // Handle login logic
    const handleLogin = (e) => {
        e.preventDefault();
    };
    return (
        <AuthLayout>
            <div className='lg:w-[70%] h-3/4 w-full h-92 flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Welcome</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Please Enter your details to log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label='Email Address'
                        placeholder='john@example.com'
                        type='email'
                    />
                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label='Password'
                        placeholder='example@23'
                        type='password'
                    />

                    {error && <p className='text-red-500 text-xs pb-2-5'>{error}</p>}

                    <button type="submit" className='btn-primary'>
                        LOGIn
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Don't have an account? {" "}
                        <Link to='/register' className='font-medium text-primary underline' >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>

    )
}

export default Login