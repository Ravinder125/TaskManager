import React from 'react'
import {
    CustomBarTooltip
} from '../index'
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts'

const CustomBarChart = ({ data }) => {

    // Function to alternate colors
    // Returns a distinct color for each priority level
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case 'low':
                return '#4CAF50'    // Green for low priority
            case 'medium':
                return '#FFC107'    // Amber for medium priority
            case 'high':
                return '#F44336'    // Red for high priority
            default:
                return '#90A4AE'    // Grey as fallback
        }
    }


    return (
        <div className='bg-white mt-6'>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />

                    <XAxis
                        dataKey='priority'
                        tick={{ fontSize: 12, fill: '$555' }}
                        stroke='none'
                    />

                    <Tooltip content={CustomBarTooltip} cursor={{ fill: 'transparent' }} />

                    <Bar
                        dataKey='count'
                        nameKey='priority'
                        fill='#FF8042'
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: 'yellow' }}
                        activeStyle={{ fill: 'green' }}
                    >
                        {data.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={getBarColor(entry)} />
                        ))}
                    </Bar>
                </BarChart>

            </ResponsiveContainer>
        </div >
    )
}

export default CustomBarChart