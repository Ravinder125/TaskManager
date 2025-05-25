import React from 'react'
import { LuTrash2 } from 'react-icons/lu'

const DeleteAlert = ({ content, onDelete }) => {
    return (
        <div className='flex items-center justify-between '>
            <p className='text-sm'>{content}</p>
            <button
                className='flex items-center justify-center gap-1.5 text-xs  rounded-lg md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 px-4 py-2 cursor-pointer'
                onClick={() => onDelete()}
            >
                Delete
            </button>
        </div>
    )
}

export default DeleteAlert