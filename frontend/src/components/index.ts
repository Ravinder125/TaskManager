import AuthLayout from "./layouts/AuthLayout";
import Input from "./Inputs/Input";
import ProfilePhotoSelector from "./Inputs/ProfilePhotoSelector";
import DashboardLayout from "./layouts/DashboardLayout";
import Navbar from "./layouts/Navbar";
import SideMenu from "./layouts/SideMenu";
import TaskListTable from './layouts/TaskListTable';
import CustomPieChart from "./Charts/CustomPieChart";
import { CustomPieLegend } from "./Charts/CustomLegend";
import CustomBarChart from "./Charts/CustomBarChart";
import { CustomBarTooltip, CustomPieTooltip } from "./Charts/CustomTooltip";
import SelectDropdown from "./Inputs/SelectDropdown";
import Loading from "./layouts/Loading";
import SelectUsers from "./common/SelectUsers";
import Modal from './common/Modal';
import AvatarGroup from "./common/AvatarGroup";
import TodoListInput from "./Inputs/TodoListInput";
import AddAttachmentsInput from "./Inputs/AddAttachmentsInput";
import TaskStatusTabs from "./common/TaskStatusTabs";
import TaskCard from "./common/TaskCard";
import Progress from "./common/Progress";
import DeleteAlert from "./common/DeleteAlert";
import UserCard from "./common/UserCard";
import SubmitButton from "./Inputs/SubmitButton";
import DashboardSkeleton from "./Skeletons/DashboardSkeleton"
import CreateTaskSkeleton from "./Skeletons/CreateTaskSkeleton"
import ManageTasksSkeleton from "./Skeletons/ManageTasksSkeleton"
import ManageEmployeeSkeleton from "./Skeletons/ManageEmployeeSkeleton"
import NotAssigned from "./common/NotAssigned";

export {
    Loading,
    AuthLayout,
    Input,
    ProfilePhotoSelector,
    DashboardLayout,
    Navbar,
    SideMenu,
    TaskListTable,
    CustomPieChart,
    CustomPieTooltip,
    CustomBarTooltip,
    CustomPieLegend,
    CustomBarChart,
    SelectDropdown,
    SelectUsers,
    Modal,
    AvatarGroup,
    TodoListInput,
    AddAttachmentsInput,
    TaskStatusTabs,
    TaskCard,
    Progress,
    DeleteAlert,
    UserCard,
    SubmitButton,
    DashboardSkeleton,
    ManageEmployeeSkeleton,
    CreateTaskSkeleton,
    ManageTasksSkeleton,
    NotAssigned,
}