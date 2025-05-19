import React, { useState } from 'react'
import { AuthLayout, Input, Loading, ProfilePhotoSelector } from '../../components/index';
import { validateEmail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import { uploadImage } from '../../utils/uploadImag';
import axiosInstance from '../../utils/axiosInstance';

const Register = () => {
    const [profilPic, setProfilPic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInviteToken] = useState('');
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullName) {
            setError('Please enter your full name')
        }
        if (!password || password.length < 8) {
            setError('Please ensure password')
        }
        if (!validateEmail(email)) {
            setError('Please enter valid email')
        }

        if (!profilPic) {
            setError('Profile image is required')
        }

        if (error) return;
        setError("")

        try {
            const formData = {
                fullName,
                email,
                password,
                adminInviteToken
            }
            setLoading(true)
            // Regiseration API logic
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
            console.log(response.data.message)
            if (profilPic && response) {
                const imageUploadRes = await uploadImage(profilPic);
                console.log(imageUploadRes.message)
            }
            // Redirect to login page after successfull registeration
            navigate('/login')
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(`Error: ${error.response.data.message}`)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }
    if (loading) return <Loading />
    return (
        <AuthLayout>
            <div className='mt-6 mx-auto bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-2xl text-black font-semibold text-center'>Create an Account</h3>
                <p className='text-sm text-gray-600 mt-2 mb-6 text-center'>Join us today by entering your details below</p>

                <form onSubmit={handleRegister} >
                    <ProfilePhotoSelector
                        setProfilPic={setProfilPic}
                    />
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
                            placeholder='6 digit token'
                            type='text'
                            required={false}
                            onChange={({ target }) => setAdminInviteToken(target.value)}
                        />

                    </div>
                    {error && <p className='text-red-500 text-xs text-center'>{error}</p>}

                    <p className='text-center text-xs text-gray-700 mt-3 mb-2'>
                        Already have an account?{' '}
                        <Link to='/login' className='font-medium text-blue-600 underline'>
                            Login here
                        </Link>
                    </p>

                    <button type="submit" className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200'>
                        Register
                    </button>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Register
