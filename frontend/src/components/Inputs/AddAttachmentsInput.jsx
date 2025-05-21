import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
    const [input, setInput] = useState("");

    // Function to handle adding an option
    const handleAddInput = () => {
        if (input.trim()) {
            setAttachments([...attachments, input.trim()]);
            setInput("");
        }
    }

    // Function to handle deleting an option
    const handleDeleteInput = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index)
        setAttachments(updatedArr);
    };
    return (
        <div>
            {attachments.map((attachments, idx) => (
                <div
                    key={idx}
                    className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-sm mb-3 mt-2'
                >
                    <div className='flex-1 flex items-center gap-3 border border-gray-100'>
                        <LuPaperclip className='text-gray-400' />
                        <p className='text-xs text-black'>{attachments}</p>
                    </div>

                    <button
                        className='cursor-pointer'
                        onClick={() => {
                            handleDeleteInput(idx);
                        }}
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>
            ))}

            <div className='flex items-center gap-5 mt-4'>
                <div className='flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>
                    <LuPaperclip className='text-gray-400' />

                    <input
                        type="text"
                        placeholder='Add File Link'
                        value={input}
                        onChange={({ target }) => setInput(target.value)}
                        className='w-full text-[13px] text-black outline-none bg-white py-2'
                    />
                </div>

                <button className='card-btn text-nowrap' onClick={handleAddInput}>
                    <HiMiniPlus className='text-lg' />
                    Add
                </button>
            </div>
        </div>
    )
}

export default AddAttachmentsInput