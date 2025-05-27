import React, { useContext } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Logout from './pages/Auth/Logout'

import Profile from './pages/Profile'

import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTasks from './pages/Admin/CreateTasks'
import ManageEmployees from './pages/Admin/ManageEmployees'

import EmployeeDashboard from './pages/Employee/EmployeeDashboard'
import Mytasks from './pages/Employee/MyTasks'
import ViewTaskDetails from './pages/Employee/ViewTaskDetails'
import { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={'admin'} />} >
          <Route path='/logout' element={<Logout />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/tasks' element={<ManageTasks />} />
          <Route path='/admin/create-task' element={<CreateTasks />} />
          <Route path='/admin/employees' element={<ManageEmployees />} />
        </Route>

        {/* Employee Routes */}
        <Route element={<PrivateRoute allowedRoles={'employee'} />} >
          <Route path='/logout' element={<Logout />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
          <Route path='/employee/tasks' element={<Mytasks />} />
          {/* <Route path='/employee/profile' element={<ManageEmployees />} /> */}
          <Route path='/employee/task-details/:id' element={<ViewTaskDetails />} />
        </Route>
      </Routes>

      <Toaster
        toastOptions={{
          className: 'font-medium bg-black/50',
          style: {
            fontSize: '13px',
            //     backgroundColor: 'lightgoldenrodyellow'
            //   },
            //   iconTheme: {
            //     primary: '#000000',
            //     secondary: '#FFD700'
          }
        }
        }
      />
    </>
  )
}

export default App

const Routee = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to='/login' />
  }

  return user.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/user/dashboard' />;
}
