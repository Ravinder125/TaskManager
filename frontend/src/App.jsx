import { useContext, lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'
import { Loading } from './components'
import { AnimatePresence } from 'framer-motion'


// Lazy load Pages
const Start = lazy(() => import('./pages/Start'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Logout = lazy(() => import('./pages/Auth/Logout'))
const Profile = lazy(() => import('./pages/Profile'))

const Dashboard = lazy(() => import('./pages/Admin/Dashboard'))
const ManageTasks = lazy(() => import('./pages/Admin/ManageTasks'))
const CreateTasks = lazy(() => import('./pages/Admin/CreateTasks'))
const ManageEmployees = lazy(() => import('./pages/Admin/ManageEmployees'))

const EmployeeDashboard = lazy(() => import('./pages/Employee/EmployeeDashboard'))
const Mytasks = lazy(() => import('./pages/Employee/MyTasks'))
const ViewTaskDetails = lazy(() => import('./pages/Employee/ViewTaskDetails'))



const AuthRedirect = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Loading />

  if (!user) {
    return <Start />
  }

  return user.role === 'admin'
    ? <Navigate to='/admin/dashboard' />
    : <Navigate to='/employee/dashboard' />;
}

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path='/' element={<AuthRedirect />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />} >
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTasks />} />
              <Route path='/admin/employees' element={<ManageEmployees />} />
            </Route>

            {/* Employee Routes */}
            <Route element={<PrivateRoute allowedRoles={['employee']} />} >
              <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
              <Route path='/employee/tasks' element={<Mytasks />} />
              {/* <Route path='/employee/profile' element={<ManageEmployees />} /> */}
              <Route path='/employee/task-details/:taskId' element={<ViewTaskDetails />} />
            </Route>

            {/* Both Admin and Employee Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'employee']} />} >
              <Route path='/logout' element={<Logout />} />
              <Route path='/profile' element={<Profile />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>

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
