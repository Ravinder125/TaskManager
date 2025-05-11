import React, { useState } from 'react'
import { AuthLayout, Input, ProfilePhotoSelector } from '../../components/index';
import { validateEmail } from '../../utils/helper';
import { Link } from 'react-router-dom';

const Register = () => {
    const [profilPic, setProfilPic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInviteToken] = useState('');

    const [error, setError] = useState(null);


    const handleRegister = (e) => {
        e.preventDefault();

        if (!fullName) {
            setError('Please enter your full name')
            return;
        }
        if (!password || password.length < 8) {
            setError('Please enter valid email')
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter valid email')
            return;
        }
        setError("")

        const formData = {
            profilPic,
            fullName,
            email,
            password,
            adminInviteToken
        }
        console.log(formData)
    }
    return (
        <AuthLayout>
            <div className='mt-6 mx-auto bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-2xl text-black font-semibold text-center'>Create an Account</h3>
                <p className='text-sm text-gray-600 mt-2 mb-6 text-center'>Join us today by entering your details below</p>

                <form onSubmit={handleRegister} className='space-y-4'>
                    <ProfilePhotoSelector
                        setProfilPic={setProfilPic}
                    />
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
                        placeholder='Admin invite token'
                        type='text'
                        required={true}
                        onChange={({ target }) => setAdminInviteToken(target.value)}
                    />

                    {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

                    <p className='text-center text-sm text-gray-700 mt-3'>
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
