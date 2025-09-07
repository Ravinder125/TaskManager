
import useTheme from '../../hooks/useTheme'
import {
    CustomBarTooltip, CustomBarLegend
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
    YAxis,
} from 'recharts'

const CustomBarChart = ({ data }) => {
    const { theme } = useTheme()
    // Function to alternate colors
    // Returns a distinct color for each priority level
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case 'Low':
                return '#4CAF50'    // Green for low priority
            case 'Medium':
                return '#FFC107'    // Amber for medium priority
            case 'High':
                return '#F44336'    // Red for high priority
            default:
                return '#90A4AE'    // Grey as fallback
        }
    }

    return (
        <div className='bg-white dark:bg-inherit mt-6'>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data} dataKey='priority' nameKey='count'>
                    <CartesianGrid stroke='none' />

                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'transparent' }} />
                    <XAxis
                        dataKey='priority'
                        nameKey='count'
                        tick={{
                            fontSize: 13,
                            fontWeight: 600,
                            fill: theme === "light" ? '#555' : "white"
                        }}
                        stroke='none'
                    />
                    <YAxis />
                    <Bar
                        dataKey='count'
                        fill={theme === "light" ? "#FF8042" : "white"}
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: 'yellow' }}
                        activeStyle={{ fill: 'green' }}
                    >
                        {data.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={getBarColor(entry)} />
                        ))}
                    </Bar>
                    {/* <Legend content={CustomBarLegend} /> */}
                </BarChart>
            </ResponsiveContainer>
        </div >
    )
}

export default CustomBarChart