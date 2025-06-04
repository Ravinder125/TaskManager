import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input, AuthLayout, Loading } from '../../components/index';
import { validateEmail } from '../../utils/helper'
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const { updateUser, setInviteToken } = useContext(UserContext);

    // Handle login logic
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password || !(password.length >= 8)) {
            setError("Please ensure your password first");
            return;
        }

        setError("")

        // Login API Call
        try {
            setLoading(true)

            const response = await axiosInstance.post(
                API_PATHS.AUTH.LOGIN,
                { email, password }
            );

            if (response?.data?.data) {
                const { message, data } = response.data;
                updateUser(data?.user);
                setInviteToken(data?.inviteToken)
                console.log(message || 'User successfully logged in');

                // Redirect Based on role
                if (data.role === 'admin') {
                    console.log(data.role)
                    navigate('/admin/dashboard')
                } else {
                    navigate('/employee/dashboard')
                }
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(`Error: ${error.response.data.message}`)
            } else {
                setError('Something went wrong. Please try again')
                console.error('Error:', error)
            }
        } finally {
            setLoading(false)
        }

    };

    if (loading) return <Loading />
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

                    <p className='text-center text-xs text-gray-700 mt-3 mb-2'>
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