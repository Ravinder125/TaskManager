import { useState } from 'react'
import { formatName } from '../../utils/helper'
import { motion } from 'framer-motion'
import { Tab } from '../../types/task.type'
import { FilterStatus } from '../../pages/Admin/ManageTasks'

interface TaskStatusTabsProps {
    tabs: Tab[]
    activeTab: FilterStatus
    setActiveTab: React.Dispatch<React.SetStateAction<FilterStatus>>
}

const TaskStatusTabs = ({
    tabs,
    activeTab,
    setActiveTab,
}: TaskStatusTabsProps) => {
    const [hovered, setHovered] = useState<number | null>(null)

    return (
        <div
            className="
                flex w-full overflow-x-auto hide-scrollbar
                bg-white dark:bg-neutral-900
                dark:text-neutral-300
                shadow-sm
            "
        >
            {tabs.map((tab, idx) => (
                <button
                    key={idx}
                    className={`
                        relative px-3 md:px-4 py-3 text-sm font-medium
                        ${tab.label === formatName(activeTab)
                            ? 'text-primary dark:text-dark-primary'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white'
                        }
                        cursor-pointer
                    `}
                    onClick={() =>
                        setActiveTab(formatName(tab.label) as FilterStatus)
                    }
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {hovered === idx && (
                        <motion.span
                            layoutId="hovered-span"
                            className="absolute z-0 inset-0 h-full w-full rounded-md bg-stone-200 dark:bg-stone-700"
                        />
                    )}

                    <div className="relative z-20 flex items-center">
                        <span className="text-xs">{tab.label}</span>
                        <span
                            className={`
                                text-xs ml-2 px-2 py-0.5 rounded-full
                                ${tab.label === formatName(activeTab)
                                    ? 'bg-primary text-white dark:bg-dark-primary'
                                    : 'bg-gray-200/70 dark:bg-gray-600 text-neutral-600 dark:text-neutral-200'
                                }
                            `}
                        >
                            {tab.count}
                        </span>
                    </div>

                    {tab.label === formatName(activeTab) && (
                        <div className="absolute z-10 bottom-0 left-0 w-full h-0.5 bg-primary" />
                    )}
                </button>
            ))}
        </div>
    )
}

export default TaskStatusTabs
