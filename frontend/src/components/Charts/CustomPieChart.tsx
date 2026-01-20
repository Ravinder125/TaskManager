import React from 'react'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import { CustomPieTooltip, CustomPieLegend } from '../index'

function CustomPieChart<T>({ data, label, colors }: {
    data: T | any;
    label?: string;
    colors: string[]
}) {
    return (
        <ResponsiveContainer width='100%' height={331}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey='count'
                    nameKey='status'
                    cx='50%'
                    cy='50%'
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {data?.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend content={<CustomPieLegend />} />
            </PieChart>

        </ResponsiveContainer>
    )
}

export default CustomPieChart