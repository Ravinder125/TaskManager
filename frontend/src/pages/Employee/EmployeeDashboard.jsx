import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext';
import useUserAuth from '../../hooks/useUserAuth';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment'
import { addThousandsSeprator, formatName } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import {
    DashboardLayout,
    TaskListTable,
    CustomPieChart,
    CustomBarChart,
    DashboardSkeleton,
    NotAssigned
} from '../../components/index';
import { motion } from 'motion/react'

const COLORS = ['#8051FF', '#00B8DB', '#7BCE00']

function EmployeeDashboard() {
    useUserAuth();

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const [loading, setLoading] = useState(false);

    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || null;
        const taskPriorityLevels = data?.taskPriorityLevels || null;

        const DistributionData = [
            { status: 'Pending', count: taskDistribution?.pending || 0 },
            { status: 'In Progress', count: taskDistribution?.inProgress || 0 },
            { status: 'Completed', count: taskDistribution?.completed || 0 },
        ]

        setPieChartData(DistributionData);

        const PriorityLevelData = [
            { priority: 'Low', count: taskPriorityLevels?.low || 0 },
            { priority: 'Medium', count: taskPriorityLevels?.medium || 0 },
            { priority: 'High', count: taskPriorityLevels?.high || 0 }
        ]

        setBarChartData(PriorityLevelData)
    }



    const onSeeMore = () => {
        navigate('/admin/tasks')
    }

    const getDashboarData = async () => {
        try {
            setLoading(true);

            const response = await axiosInstance.get(
                API_PATHS.DASHBOARD.GET_USER_DASHBOARD_DATA,
                { withCredentials: true }
            );
            if (response.data) {
                setDashboardData(response.data.data);
                prepareChartData(response.data.data?.charts || null)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDashboarData();
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
                }}
                transition={{
                    duration: 0.3,
                    ease: 'linear'
                }}
            >
                <div className='card my-5'>
                    <div>
                        <div className='flex flex-col sm:flex-row sm:justify-between md:justify-start md:gap-4'>
                            <span className='text-xl md:text-2xl'>Good Morning!</span>
                            <h2 className='text-xl md:text-2xl font-semibold '>
                                {formatName(user?.fullName)}
                            </h2>
                        </div>
                        <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
                            {moment().format('dddd Do MMM YYYY')}
                        </p>
                    </div >

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
                                    <div className='flex items-center justify-bewteen mb-2'>
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
                                    <div className='flex items-center justify-beween mb-2'>
                                        <h5 className='font-medium'>Task Priority Levels</h5>
                                    </div>

                                    <CustomBarChart data={barChartData} c />
                                </div>
                            </div>

                            <div className='md:col-span-2'>
                                <div className='card '>
                                    <div className='flex items-center justify-between'>
                                        <h5 className='text-lg font-medium'>Recent Tasks</h5>

                                        <Link to='/employee/tasks' className='card-btn' onClick={onSeeMore}>
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