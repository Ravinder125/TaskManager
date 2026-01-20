import React, { useEffect, useState } from 'react'
import { Progress, AvatarGroup } from '../index';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';
import { formatName } from '../../utils/helper';
import { MdTransitEnterexit } from 'react-icons/md'
import { AnimatePresence, motion } from 'motion/react';
import { StatusValueType, TaskCardProps } from '../../types/task.type';
import { AssignedUser } from '../../types/user.type';


const TaskCard = ({
    title,
    description,
    priority,
    status,
    progress,
    dueTo,
    createdAt,
    assignedTo,
    attachmentCount,
    completedTodoCount,
    todoList,
    onClick,
}: TaskCardProps) => {
    const [avatars, setAvatars] = useState<(string | undefined)[]>([]);

    useEffect(() => {
        const getAvatars = assignedTo.map((user: AssignedUser) => user?.profileImageUrl)
        setAvatars(getAvatars)

    }, [])
    const [isHover, setIsHover] = useState<boolean>(false);

    const getStatusTagColor = (status: StatusValueType) => {
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
            className="bg-white relative rounded-lg shadow-md cursor-pointer overflow-hidden dark:bg-neutral-800"
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
                        className="absolute inset-0 bg-gradient-to-t from-neutral-500 to-transparent flex justify-center items-center pointer-events-none dark:bg-gradient-to-t dark:from-neutral-800 dark:to-transparent"
                    >
                        <MdTransitEnterexit className="text-5xl text-neutral-500 opacity-90 dark:text-neutral-200" />
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="p-5 mb-4">
                {/* Status + Priority */}
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor(status)}`}>
                        {formatName(status)!.replace('-', ' ')}
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
                    <h3 className="text-lg md:text-[16px] 2xl:text-lg font-bold mb-1 text-neutral-800 dark:text-neutral-100">{title}</h3>
                    <p className="text-neutral-500 overflow-hidden line-clamp-2 text-xs mt-4 dark:text-neutral-300">{description}</p>
                    <p className="text-[13px] text-neutral-700 font-bold mt-2 mb-2 leading-[18px] dark:text-neutral-100">
                        Task Done:{' '}
                        <span className="font-semibold text-neutral-700 dark:text-neutral-100">{completedTodoCount}/{todoList?.length || 0}</span>
                    </p>

                    <Progress progress={progress} status={status} />
                </div>

                {/* Dates + Avatars + Attachments */}
                <div className="px-4">
                    <div className="flex justify-between items-center my-1">
                        <div>
                            <label className="text-xs text-neutral-500 dark:text-neutral-300">Start Date</label>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-100">{moment(createdAt).format("Do MMM YYYY")}</p>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 dark:text-neutral-300">Due Date</label>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-100">{moment(dueTo).format("Do MMM YYYY")}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <AvatarGroup avatars={avatars} />
                        {attachmentCount > 0 && (
                            <div className="flex items-center gap-2 text-neutral-500 px-2.5 py-1.5 rounded-lg">
                                <LuPaperclip className="w-4 h-4" />
                                <span className="text-xs text-neutral-900 dark:text-neutral-100">{attachmentCount}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )


}

export default TaskCard
