import { useState } from 'react'
import { formatName } from '../utils/helper'
import { hover, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab, }) => {
    const [hovered, setHovered] = useState(null);
    const [scrolled, setScrolled] = useState(false)
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        latest > 20 ? setScrolled(true) : setScrolled(false);
    })

    return (
        <div className='my-2 relative mx-auto'>
            <motion.div
                animate={{
                    boxShadow: scrolled
                        ? `
                        0 2px 4px rgba(0, 0, 0, 0.1),
                        0 4px 8px rgba(0, 0, 0, 0.08),
                        0 8px 16px rgba(0, 0, 0, 0.06),
                        0 16px 32px rgba(0, 0, 0, 0.04),
                        0 0 15px rgba(0, 200, 255, 0.25)
                        `: "",
                    borderRadius: scrolled ? 20 : 0,
                    backdropFilter: scrolled ? "blur(2px)" : ""
                }}
                transition={{
                    duration: 0.3,
                    ease: 'linear'
                }}

                className="flex fixed z-50 sm:top-20 sm:top-45 lg:top-28 xl:top-32 left-10 sm:left-[20%] lg:left-[40%] w-[300px] sm:w-fit overflow-x-auto hide-scrollbar"
            >
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        className={`relative px-3 md:px-4 py-3 text-sm font-medium ${tab.label === formatName(activeTab)
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            } cursor-pointer`}
                        onClick={() => setActiveTab(formatName(tab.label))}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {hovered === idx && (
                            <motion.span
                                layoutId='hovered-span'
                                className='absolute z-0 inset-0 h-full w-full rounded-md bg-neutral-800/6 dark:neutral-400'
                            />
                        )}
                        <div className='relative z-20 flex  items-center'>
                            <span className='text-xs'> {tab.label}</span>
                            <span
                                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${tab.label === formatName(activeTab)
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200/70 text-gray-600'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </div>
                        {tab.label === formatName(activeTab) && (
                            <div className='absolute z-20 bottom-0 left-0 w-full h-0.5 bg-primary' />
                        )}
                    </button>
                ))}
            </motion.div>
        </div >
    )
}

export default TaskStatusTabs