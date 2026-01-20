
import useTheme from '../../hooks/useTheme'
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
    YAxis,
} from 'recharts'

const priorities = ["Low", "Medium", "High"]
type Priority = typeof priorities[number]

type BarChartData = {
    priority: Priority
    count: number
}

interface CustomBarChartProps {
    data: BarChartData[]
}

const CustomBarChart = ({ data }: CustomBarChartProps) => {
    const { theme } = useTheme()
    // Function to alternate colors
    // Returns a distinct color for each priority level
    const getBarColor = (entry: { priority: Priority }) => {
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
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />

                    <Tooltip content={(props) => <CustomBarTooltip {...props} />} cursor={{ fill: 'transparent' }} />
                    <XAxis
                        dataKey='priority'
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
                    >
                        {data.map((entry: BarChartData, idx: number) => (
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