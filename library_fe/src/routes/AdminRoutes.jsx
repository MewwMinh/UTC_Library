import { Route, Routes } from "react-router-dom";
import AdminLayout from "/src/components/layout/AdminLayout";
import {
  AdminDashboard,
  ManageStaff,
  ConfigSystem,
  ActivityLogs,
} from "/src/pages/admin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />} path="/">
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-staff" element={<ManageStaff />} />
        <Route path="config-system" element={<ConfigSystem />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
