import React, { useState, useContext, useEffect } from 'react'
import { DashboardLayout } from '../../components/index';
import { UserContext } from '../../context/userContext';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment'
import { addThousandsSeprator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';

function Dashboard() {
    useUserAuth();

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const getDashboarData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.DASHBOARD.GET_DASHBOARD_DATA,
                { withCredentials: true }
            );
            if (response.data) {
                setDashboardData(response.data.data);
                console.log('dashboard data:', response.data.data)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        }
    }

    useEffect(() => {
        getDashboarData();
    }, [])
    return (
        <DashboardLayout activeMenu='Dashboard'>
            <div className='card my-5'>
                <div>
                    <div className=''>
                        <h2 className='text-xl md:text-2xl'>Good Morning! {user?.fullName}</h2>
                        <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
                            {moment().format('dddd Do MMM YYYY')}
                        </p>
                    </div>
                </div>

                {dashboardData && dashboardData.charts && dashboardData.charts.taskDistribution ? (
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
                            color='bg-lime-500'
                        />
                        <InfoCard
                            label='Complete Tasks'
                            value={addThousandsSeprator(
                                dashboardData.charts.taskDistribution.completed || 0
                            )}
                            color='bg-cyan-500'
                        />
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-5 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
                        <p className='col-span-4 text-center text-gray-400'>Loading...</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default Dashboard