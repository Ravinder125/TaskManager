// Third-party
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Hooks
import { type FormEvent, useState } from 'react';

// Components
import {
    AuthLayout,
    Input,
    Loading,
    // ProfilePhotoSelector,
    SelectDropdown,
} from '../../components/index';

// Utils
import axiosInstance from '../../utils/axiosInstance';

// API
import { API_PATHS } from '../../utils/apiPaths';
import { registerSchema } from '../../features/zodSchemas/Auth/auth.schema';
import { validateFields } from '../../utils/validateFields';
import { RegisterFormData, RoleOptions } from '../../types/auth.type';





const InitialData: RegisterFormData = {
    email: "",
    fullName: "",
    password: "",
    role: ""
}


const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}


const roleOptions: RoleOptions[] = [
    {
        value: "admin",
        label: "Admin"
    },
    {
        value: "employee",
        label: "Employee"
    },
]


const Register = () => {
    // const [profilePic, setProfilePic] = useState(null);
    const [formData, setFormData] = useState<RegisterFormData>(InitialData)
    // const [fullName, setFullName] = useState<string>("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [role, setRole] = useState('');
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")

        try {
            const { success, data, message } = validateFields(formData, registerSchema)
            if (!success) {
                setError(message!)
                toast.error(message!)
                return;
            }

            setLoading(true)
            // Registration API logic
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, data);
            if (response?.data?.data) {
                toast.success(response.data.message)
                // Redirect to login page after successfully registration
                navigate('/login')
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
                <h3 className='text-2xl text-black font-semibold text-center dark:text-neutral-100'>Create an Account</h3>
                <p className='text-xs text-neutral-600 mt-2 mb-6 dark:text-neutral-400 text-center'>Join us today by entering your details below</p>

                <form onSubmit={handleRegister} >
                    {/* <ProfilePhotoSelector
                        setProfilePic={setProfilePic}
                    /> */}
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-2 '>

                        <Input
                            label='Full Name *'
                            value={formData.fullName}
                            placeholder='John Snow'
                            type='text'
                            required={true}
                            onChange={(value) => handleInputChange("fullName", value)}
                        />
                        <Input
                            label='Email *'
                            value={formData.email}
                            placeholder='john@gmail.com'
                            type='email'
                            required={true}
                            onChange={(value) => handleInputChange("email", value)}
                        />
                        <Input
                            label='Password *'
                            value={formData.password}
                            placeholder='Min 8 characters'
                            type='password'
                            required={true}
                            onChange={(value) => handleInputChange("password", value)}
                        />
                        {/* <Input
                            label={`I'm a *`}
                            value={role}
                            placeholder='Enter invite token if you have one'
                            type='select'
                            required={false}
                            onChange={({ target }) => setRole(target.value)}
                        /> */}

                        <SelectDropdown
                            options={roleOptions}
                            onChange={(value) => handleInputChange("role", value)}
                            placeholder="Select role"
                            value={formData.role}
                            label="role *"
                        // style={{ "marginTop": 4 }}
                        />

                    </div>
                    {error && <p className='text-red-500 text-xs'>Error: {error}</p>}

                    <p className='text-center text-xs text-neutral-600 mt-3 mb-2 dark:text-neutral-200'>
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
