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
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case 'low':
                return '$00BC7D'

            case 'medium':
                return '#FE9900'

            case 'high':
                return '#FF1F57'

            default:
                return '#00BC7D'
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