// third party
import { motion } from 'motion/react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment'

// Components
import InfoCard from '../../components/Cards/InfoCard';
import {
    DashboardLayout,
    TaskListTable,
    CustomPieChart,
    CustomBarChart,
    DashboardSkeleton,
    NotAssigned,
} from '../../components/index';

// Hooks
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext';
import useUserAuth from '../../hooks/useUserAuth';
import { Link, useNavigate } from 'react-router-dom';

// Utils
import { addThousandsSeprator, formatName } from '../../utils/helper';

// Types
import { DashboardCharts, DashboardData, DistributionData, PriorityLevelData } from '../../types/dashboard.type';

// Api
import { getEmployeeDashboardData } from '../../features/api/dashboard.api';

const COLORS = ['#8051FF', '#00B8DB', '#7BCE00']

function EmployeeDashboard() {
    useUserAuth();

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [pieChartData, setPieChartData] = useState<DistributionData[]>([]);
    const [barChartData, setBarChartData] = useState<PriorityLevelData[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const prepareChartData = (data: DashboardCharts) => {
        const { taskDistribution, taskPriorityLevels } = data

        const DistributionData: DistributionData[] = [
            { status: "Pending", count: taskDistribution.pending },
            { status: "In Progress", count: taskDistribution.inProgress },
            { status: "Completed", count: taskDistribution.completed },
        ]

        setPieChartData(DistributionData)

        const PriorityLevelData: PriorityLevelData[] = [
            { priority: "Low", count: taskPriorityLevels.low },
            { priority: "Medium", count: taskPriorityLevels.medium },
            { priority: "High", count: taskPriorityLevels.high },
        ]

        setBarChartData(PriorityLevelData)
    }



    const onSeeMore = () => {
        navigate('/admin/tasks')
    }

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data } = await getEmployeeDashboardData()
            setDashboardData(data)

            if (data !== null) {
                prepareChartData(data.charts)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])
    if (loading) return <DashboardSkeleton />
    return (
        <DashboardLayout activeMenu='Dashboard'>
            <motion.div
                initial={{
                    filter: "blur(5px)",
                    opacity: 0,
                }}
                animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                    x: 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: 'linear'
                }}
                className='origin-center mb-5 hide-scrollbar'
            >
                <div className='card my-5'>
                    <div className='flex flex-col sm:flex-row sm:justify-between md:justify-start md:gap-4 dark:text-neutral-100'>
                        <span className='text-xl md:text-2xl'>Good Morning!</span>
                        <h2 className='text-xl md:text-2xl font-semibold '>
                            {formatName(user?.fullName!)}
                        </h2>
                    </div>
                    <p className='text-xs md:text-[13px] text-neutral-400 mt-1.5 dark:text-neutral-300'>
                        {moment().format('dddd Do MMM YYYY')}
                    </p>


                    {dashboardData && dashboardData.charts && dashboardData.charts.taskDistribution && (
                        <div className='grid grid-cols-2 sm:grid-cols-2  gap-3 md:gap-6 mt-5'>
                            <InfoCard
                                label='Total Tasks'
                                value={addThousandsSeprator(
                                    dashboardData.charts.taskDistribution.all || 0
                                )}
                                color='bg-primary'
                            />
                            <InfoCard
                                label='Pending Tasks'
                                value={addThousandsSeprator(
                                    dashboardData.charts.taskDistribution.pending || 0
                                )}
                                color='bg-violet-500'
                            />
                            <InfoCard
                                label='In Progress Tasks'
                                value={addThousandsSeprator(
                                    dashboardData.charts.taskDistribution.inProgress || 0
                                )}
                                color='bg-cyan-500'
                            />
                            <InfoCard
                                label='Complete Tasks'
                                value={addThousandsSeprator(
                                    dashboardData.charts.taskDistribution.completed || 0
                                )}
                                color='bg-lime-500'
                            />
                        </div>
                    )}
                </div>


                {dashboardData?.statistics?.totalTasks === 0
                    ? <NotAssigned className='mt-6' /> : (
                        <div className='grid grid-cols-1  md:grid-cols-2 gap-3 my-4  '>
                            <div >
                                <div className='card '>
                                    <div className='flex items-center justify-between mb-2'>
                                        <h5 className='font-medium'>Task Distribution</h5>
                                    </div>

                                    <CustomPieChart
                                        data={pieChartData}
                                        label='Total Balance'
                                        colors={COLORS}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className='card'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <h5 className='font-medium'>Task Priority Levels</h5>
                                    </div>

                                    <CustomBarChart data={barChartData} />
                                </div>
                            </div>

                            <div className='md:col-span-2 '>
                                <div className='card '>
                                    <div className='flex items-center justify-between'>
                                        <h5 className='text-lg font-medium'>Recent Tasks</h5>

                                        <Link to='/employee/tasks' className='add-btn' onClick={onSeeMore}>
                                            See All <LuArrowRight className='text-base' />
                                        </Link>
                                    </div>
                                    <TaskListTable tableData={dashboardData?.recentTasks || []} />
                                </div>
                            </div>
                        </div >
                    )}
            </motion.div>
        </DashboardLayout >
    )
}

export default EmployeeDashboard