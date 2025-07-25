import React from 'react'
import moment from 'moment';
import { formatName } from '../../utils/helper';

const TaskListTable = ({ tableData }) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-500 border border-green-200';
            case 'pending': return 'bg-purple-100 text-purple-500 border border-purple-200';
            case 'in-progress': return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
            default: return 'bg-gray-100 text-gray-500 border broder-gray-200';
        }
    }

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-500 border border-green-200'
            case 'medium': return 'bg-orange-100 text-orange-500 border border-orange-200'
            case 'high': return 'bg-red-100 text-red-500 border border-red-200'
            default: return 'bg-gray-100 text-gray-500 border broder-gray-200';
        }
    }
    return (
        <div className='overflow-x-auto p-0 rounded-lg mt-3'>
            <table className='min-w-full'>
                <thead>
                    <tr className='text-left border-b border-gray-200 '>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Priority</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:block md:table-cells'>Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData && tableData.map((task, idx) => (
                        <tr key={idx} className=''>
                            <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden '>{task.title}</td>
                            <td className=' p-4'>
                                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>{formatName(task.status === 'in-progress' ? 'inProgress' : task.status)}</span>
                            </td>
                            <td className=' p-4'>
                                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>{formatName(task.priority)}</span>
                            </td>
                            <td className='p-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.createdAt ? moment(task.createdAt).format('Do MMM YYYY') : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TaskListTable