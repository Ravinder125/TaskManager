import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion'
import { todoListAnimation } from '../../utils/motionAnimations';

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
            <AnimatePresence>

                {attachments.map((attachments, idx) => (
                    <motion.div
                        initial={todoListAnimation.initial}
                        animate={todoListAnimation.animate}
                        exit={todoListAnimation.exit}
                        transition={todoListAnimation.transition}
                        key={idx}
                        className='flex justify-between bg-neutral-100 border px-3 py-2 rounded-sm mb-3 mt-2  border-neutral-300 dark:bg-neutral-700 dark:border-dark-border'
                    >
                        <div className='flex-1 flex items-center gap-3 '>``
                            <LuPaperclip className='text-gray-400' />
                            <p className='text-xs text-black dark:text-neutral-200'>{attachments}</p>
                        </div>

                        <button
                            className='cursor-pointer'
                            onClick={() => {
                                handleDeleteInput(idx);
                            }}
                        >
                            <HiOutlineTrash className='text-lg text-red-500 dark:text-red-400' />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className='flex items-center gap-5 mt-4'>
                <div className='flex-1 flex items-center gap-3  rounded-md px-3 border border-neutral-200 dark:border-neutral-600'>
                    <LuPaperclip className='text-gray-400' />

                    <input
                        type="text"
                        placeholder='Add File Link'
                        value={input}
                        onChange={({ target }) => setInput(target.value)}
                        className='w-full text-[13px] text-black outline-none bg-inherit  px-3 py-3 rounded-md dark:text-gray-200   dark:placeholder:text-neutral-400'
                    />
                </div>

                <button className='add-btn text-nowrap' onClick={handleAddInput}>
                    <HiMiniPlus className='text-lg' />
                    Add
                </button>
            </div>
        </div>
    )
}

export default AddAttachmentsInput