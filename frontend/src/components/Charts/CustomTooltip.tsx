interface CustomTooltipProps {
    active?: boolean;
    payload?: any;
    duration?: number;
}

const CustomPieTooltip = ({ active = false, payload }: Omit<CustomTooltipProps, 'duration'>) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white shadow-md  rounded-lg p-2 border-gray-300'>
                <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].fullName}</p>
                <p className='text-sm text-gray-600'>
                    Count: <span className='text-sm font-medium text-gray-900' >{payload[0].value}</span>
                </p>
            </div>
        )
    }
}

const CustomBarTooltip = ({ active = false, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                <p className='text-xs font-semibold text-purple-800 mb-1'>
                    {payload[0].payload.priority}
                </p>
                <p className='text-sm text-gray-600'>
                    Count: {' '}
                    <span className='text-sm font-medium text-gray-900'>
                        {payload[0].payload.count}
                    </span>
                </p>
            </div>
        )
    }
    return null;
}

export {
    CustomBarTooltip,
    CustomPieTooltip,
}