import React, { ChangeEvent, useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ setProfilePic, profilePic }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            // Update the image state
            setImage(file);
            setProfilePic(file);

            // Generate preview URL from the file
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        setProfilePic(null)
    }

    const onChooseFile = () => {
        inputRef?.current?.click();
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='mb-6'>
                <input
                    type='file'
                    accept='image/*'
                    ref={inputRef}
                    onChange={handleImageChange}
                    className='hidden'
                />
                {!image ? (
                    profilePic ? (
                        <div className='relative'>
                            <img
                                src={profilePic}
                                alt="profile photo"
                                className='w-20 h-20  rounded-full'
                            />
                            <button
                                type='button'
                                className='w-8 h-8 flex text-white items-center absolute -bottom-1 bg-red-500 rounded-full justify-center -right-1 cursor-pointer'
                                onClick={handleRemoveImage}
                            >
                                <LuTrash />
                            </button>
                        </div>
                    ) : (
                        <div className='w-20 h-20 flex items-center justify-center bg-blue-500/10 rounded-full relative'>
                            <LuUser className='text-4xl text-primary' />
                            <button
                                type='button'
                                className='w-8 h-8 flex text-white items-center absolute -bottom-1 bg-primary rounded-full  justify-center -right-1 cursor-pointer'
                                onClick={onChooseFile}
                            >
                                <LuUpload />
                            </button>
                        </div>
                    )
                ) : (
                    <div className='relative'>
                        {previewUrl === "string" && (
                            <img
                                src={previewUrl}
                                alt="profile photo"
                                className='w-20 h-20 object-cover rounded-full'
                            />
                        )}
                        <button
                            type='button'
                            className='w-8 h-8 flex text-white items-center absolute -bottom-1 bg-red-500 rounded-full  justify-center -right-1 cursor-pointer'
                            onClick={handleRemoveImage}
                        >
                            <LuTrash />
                        </button>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ProfilePhotoSelector