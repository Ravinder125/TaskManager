import React from 'react'
import { DashboardLayout } from '../../components/index';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';

const CreateTasks = () => {
    return (
        <DashboardLayout activeMenu='Create Task' />
    )
}

export default CreateTasks