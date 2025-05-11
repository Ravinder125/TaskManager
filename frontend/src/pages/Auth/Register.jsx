import React, { useState } from 'react'
import { AuthLayout, Input, ProfilePhotoSelector } from '../../components/index';
import { validateEmail } from '../../utils/helper';

const Register = () => {
    const [profilPic, setProfilPic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken] = useState('');

    const [error, setError] = useState(null);


    const handleRegister = () => {
        e.preventDefault();

        if (!fullName) {
            setError('Please enter your full name')
        }
        if (!password || password.length < 8) {
            setError('Please enter valid email')
        }
        if (!validateEmail(email)) {
            setError('Please enter valid email')
        }
    }
    return (
        <AuthLayout>
            <div className='h-92 mt-6'>
                <h3 className='text-xl text-black font-semibold'>Create an Account</h3>
                <p className='text-xs text-slate-700 mt-2 mb-6'>Join us today by entering your details below</p>

                <form onSubmit={handleRegister}>
                    <ProfilePhotoSelector

                    />
                    <Input
                        label='Full Name'
                        value={fullName}
                        placeholder='Johan Snow'
                        type='email'
                        required={true}
                    />
                    <Input
                        label='email'
                    />
                </form>

            </div>
        </AuthLayout>
    )
}

export default Register
