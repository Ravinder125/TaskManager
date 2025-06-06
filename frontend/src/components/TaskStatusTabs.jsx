import { formatName } from '../utils/helper'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab, }) => {
    return (
        <div className='my-2 mx-auto'>
            <div className='flex w-[300px] sm:w-full  overflow-x-auto hide-scrollbar'>
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        className={`relative px-3 md:px-4 py-2 text-sm font-medium ${tab.label === formatName(activeTab)
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            } cursor-pointer`}
                        onClick={() => setActiveTab(formatName(tab.label))}
                    >
                        <div className='flex items-center'>
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
                            <div className='absolute bottom-0 left-0 w-full h-0.5 bg-primary' />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TaskStatusTabs