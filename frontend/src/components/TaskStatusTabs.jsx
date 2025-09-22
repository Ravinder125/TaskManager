import { useEffect, useState } from 'react'
import { formatName } from '../utils/helper'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab, }) => {
    const [hovered, setHovered] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Ensure useMotionValueEvent is used inside useEffect
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setScrolled(latest > 20);
            console.log(latest);
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (

        <div className='flex w-full dark:text-gray-300 overflow-x-auto hide-scrollbar dark:shadow-neutral-700 transition-all duration-1000'>
            {tabs.map((tab, idx) => (
                <button
                    key={idx}
                    className={`relative px-3 md:px-4 py-3 text-sm font-medium ${tab.label === formatName(activeTab)
                        ? 'text-primary dark:text-dark-primary'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200'
                        } cursor-pointer`}
                    onClick={() => setActiveTab(formatName(tab.label))}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {hovered === idx && (
                        <motion.span
                            layoutId='hovered-span'
                            className='absolute z-0 inset-0 h-full w-full rounded-md bg-stone-200 dark:bg-stone-700'
                        />
                    )}
                    <div className='relative z-20 flex items-center'>
                        <span className='text-xs'> {tab.label}</span>
                        <span
                            className={`text-xs ml-2 px-2 py-0.5 rounded-full ${tab.label === formatName(activeTab)
                                ? 'bg-primary text-white dark:text-gray-200 dark:bg-[var(--dark-primary)]'
                                : 'bg-gray-200/70 text-gray-600'
                                }`}
                        >
                            {tab.count}
                        </span>
                    </div>
                    {tab.label === formatName(activeTab) && (
                        <div className='absolute z-10 bottom-0 left-0 w-full h-0.5 bg-primary' />
                    )}
                </button>
            ))}

        </div>

    )
}

export default TaskStatusTabs