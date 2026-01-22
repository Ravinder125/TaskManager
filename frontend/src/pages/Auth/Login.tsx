import { useState, useContext, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input, AuthLayout, Loading } from '../../components/index';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from 'framer-motion';
import { loginSchema } from '../../features/zodSchemas/auth.schema';
import { validateFields } from '../../utils/validateFields';



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const { updateUser } = useContext(UserContext);

    // Handle login logic
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError("")

        const payload = { email, password }

        const { success, data, message } = validateFields(payload, loginSchema)

        if (!success) {
            setError(message!)
            return
        }

        // Login API Call
        try {
            setLoading(true)

            const response = await axiosInstance.post(
                API_PATHS.AUTH.LOGIN,
                data
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
                        onChange={(value: string) => setEmail(value)}
                    />
                    <Input
                        value={password}
                        label='Password'
                        placeholder='Min 8 Characters'
                        type='password'
                        required={true}
                        onChange={(value: string) => setPassword(value)}
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
            </motion.div>
        </AuthLayout>

    )
}

export default Login