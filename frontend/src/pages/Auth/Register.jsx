import React, { useState } from 'react'
import { AuthLayout, Input, Loading, ProfilePhotoSelector } from '../../components/index';
import { validateEmail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import z from 'zod'

const registerSchema = z.object({
    fullName: z.
        string()
        .nonempty({ message: "Enter you full name" })
        .min(3, { message: "Full name must 3 characters long" }),
    email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .min(8, { message: "Password must be 8 characters long" })
})

const Register = () => {
    // const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInviteToken] = useState('');
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("")

        try {
            const formData = {
                fullName,
                email,
                password,
                adminInviteToken
            }

            const result = registerSchema.safeParse({
                fullName, email, password
            })

            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors
                const firstError = Object
                    .values(fieldErrors)?.[0]?.[0]
                setError(firstError)
                return
            }

            setLoading(true)
            // Registration API logic
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
            if (response?.data?.data) {
                toast.success(response.data.message)
                // Redirect to login page after successfully registration
                navigate('/login')
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(`Error: ${error.response.data.message}`)
                toast.error(error.response.data.message)
            } else {
                setError('Something went wrong')
                toast.error('Something went wrong, please try again')
            }
        } finally {
            setLoading(false)
        }
    }

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
                className='h-full flex flex-col justify-center p-6 rounded-md shadow-md dark:bg-dark-card overflow-auto'
            >
                <h3 className='text-2xl text-black font-semibold text-center dark:text-neutral-200'>Create an Account</h3>
                <p className='text-xs text-neutral-600 mt-2 mb-6 dark:text-neutral-300 text-center'>Join us today by entering your details below</p>

                <form onSubmit={handleRegister} >
                    {/* <ProfilePhotoSelector
                        setProfilePic={setProfilePic}
                    /> */}
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-2 '>

                        <Input
                            label='Full Name'
                            value={fullName}
                            placeholder='John Snow'
                            type='text'
                            required={true}
                            onChange={({ target }) => setFullName(target.value)}
                        />
                        <Input
                            label='Email'
                            value={email}
                            placeholder='john@gmail.com'
                            type='email'
                            required={true}
                            onChange={({ target }) => setEmail(target.value)}
                        />
                        <Input
                            label='Password'
                            value={password}
                            placeholder='Min 8 characters'
                            type='password'
                            required={true}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                        <Input
                            label='Admin Invite Token'
                            value={adminInviteToken}
                            placeholder='Enter invite token if you have one'
                            type='text'
                            required={false}
                            onChange={({ target }) => setAdminInviteToken(target.value)}
                        />

                    </div>
                    {error && <p className='text-red-500 text-xs'>Error: {error}</p>}

                    <p className='text-center text-xs text-neutral-700 mt-3 mb-2 dark:text-neutral-200'>
                        Already have an account?{' '}
                        <Link to='/login' className='font-medium text-blue-600 underline dark:text-dark-primary'>
                            Login here
                        </Link>
                    </p>

                    <button type="submit" className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200'>
                        Register
                    </button>
                </form>
            </motion.div>
        </AuthLayout>
    )
}

export default Register
