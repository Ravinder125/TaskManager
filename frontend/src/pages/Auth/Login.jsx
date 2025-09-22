import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input, AuthLayout, Loading } from '../../components/index';
import { validateEmail } from '../../utils/helper'
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from 'framer-motion';
import z from 'zod'
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"


const loginSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .nonempty({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
})

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const { updateUser } = useContext(UserContext);

    // Handle login logic
    const handleLogin = async (e) => {

        e.preventDefault();
        setError("")

        const result = loginSchema.safeParse({
            email, password
        })
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            const firstError = Object
                .values(fieldErrors)?.[0]?.[0]
            setError(firstError)
            return
        }

        // Login API Call
        try {
            setLoading(true)

            const response = await axiosInstance.post(
                API_PATHS.AUTH.LOGIN,
                { email, password }
            );

            if (response?.data?.data) {
                const { data } = response.data;
                updateUser(data);

                // Redirect Based on role
                if (data?.role === 'admin') {
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

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    }



    if (loading) return <Loading />
    return (
        <AuthLayout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className='flex flex-col justify-center p-6 rounded-md shadow-md dark:bg-dark-card '
            >
                <h3 className='text-xl font-semibold text-black dark:text-neutral-200'>Welcome</h3>
                <p className='text-xs text-neutral-700 mt-2 mb-6 dark:text-neutral-300'>
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

                    {error && <p className='text-red-500 text-xs pb-2-5'>Error: {error}</p>}

                    <p className='text-center text-xs text-neutral-700 mt-3 mb-2 dark:text-neutral-100'>
                        Don't have an account? {" "}
                        <Link to='/register' className='font-medium text-primary underline dark:text-dark-primary' >
                            Register
                        </Link>
                    </p>

                    <button type="submit" className='btn-primary'>
                        LOGIn
                    </button>

                </form>
                {/* <SignedIn >
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut> */}
            </motion.div>
        </AuthLayout>

    )
}

export default Login