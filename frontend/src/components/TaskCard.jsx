import React, { useEffect, useState } from 'react'
import { Progress, AvatarGroup } from './index';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';
import { formatName } from '../utils/helper';
import { MdTransitEnterexit } from 'react-icons/md'
import { AnimatePresence, motion } from 'motion/react';


const TaskCard = ({
    title,
    description,
    priority,
    status,
    progress,
    dueDate,
    createdAt,
    assignedTo,
    attachmentCount,
    completedTodoCount,
    todoCheckList,
    onClick,
}) => {
    const [avatars, setAvatars] = useState([]);
    useEffect(() => {
        const getAvatars = assignedTo.map((user) => user.profileImageUrl)
        setAvatars(getAvatars)

    }, [])
    const [isHover, setIsHover] = useState(false);

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'in-progress':
                return 'text-cyan-600 bg-cyan-100 border border-cyan-200';
            case 'completed':
                return 'text-lime-600 bg-lime-100 border border-lime-200';
            default:
                return 'text-violet-600 bg-violet-100 border border-violet-200';
        }
    }

    const getPriorityTagColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'text-emerald-600 bg-emerald-100 border border-emerald-200';
            case 'medium':
                return 'text-amber-600 bg-amber-100 border border-amber-200';
            default:
                return 'text-rose-600 bg-rose-100 border border-rose-200';
        }
    }

    return (
        <div
            className="bg-white relative rounded-lg shadow-md cursor-pointer overflow-hidden"
            onClick={onClick}
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
        >

            <AnimatePresence>
                {isHover && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-center pointer-events-none"
                    >
                        <MdTransitEnterexit className="text-5xl text-neutral-500 opacity-90" />
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="p-5 mb-4">
                {/* Status + Priority */}
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor(status)}`}>
                        {formatName(status).replace('-', ' ')}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor(priority)}`}>
                        {formatName(priority)} Priority
                    </span>
                </div>

                {/* Title + Description */}
                <div
                    className={`px-4 py-2 border-l-4 mb-3 
                        ${status === 'in-progress'
                            ? 'border-cyan-500'
                            : status === 'completed'
                                ? 'border-lime-500'
                                : 'border-violet-500'
                        }`}
                >
                    <h3 className="text-lg md:text-[16px] 2xl:text-lg font-bold mb-1 text-gray-800">{title}</h3>
                    <p className="text-gray-500 overflow-hidden line-clamp-2 text-xs mt-4">{description}</p>
                    <p className="text-[13px] text-gray-700 font-bold mt-2 mb-2 leading-[18px]">
                        Task Done:{' '}
                        <span className="font-semibold text-gray-700">{completedTodoCount}/{todoCheckList?.length || 0}</span>
                    </p>

                    <Progress progress={progress} status={status} />
                </div>

                {/* Dates + Avatars + Attachments */}
                <div className="px-4">
                    <div className="flex justify-between items-center my-1">
                        <div>
                            <label className="text-xs text-gray-500">Start Date</label>
                            <p className="text-sm font-medium text-gray-700">{moment(createdAt).format("Do MMM YYYY")}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Due Date</label>
                            <p className="text-sm font-medium text-gray-700">{moment(dueDate).format("Do MMM YYYY")}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <AvatarGroup avatars={avatars} />
                        {attachmentCount > 0 && (
                            <div className="flex items-center gap-2 text-gray-500 px-2.5 py-1.5 rounded-lg">
                                <LuPaperclip className="w-4 h-4" />
                                <span className="text-xs text-gray-900">{attachmentCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )


}

export default TaskCard
