import { Route, Routes } from "react-router-dom";
import AdminLayout from "/src/components/layout/AdminLayout";
import {
  AdminDashboard,
  LibrarySettings,
  ActivityLogPage,
  EmployeeListPage,
  EmployeeDetailPage,
  EmployeeCreatePage,
} from "/src/pages/admin";
import CreateEmployee from "/src/components/admin/manage-employee/CreateEmployee";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />} path="/">
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeListPage />} />
        <Route
          path="employees/employee-details/:userId"
          element={<EmployeeDetailPage />}
        />
        <Route
          path="employees/create-employee"
          element={<EmployeeCreatePage />}
        />
        <Route path="config-system" element={<LibrarySettings />} />
        <Route path="activity-logs" element={<ActivityLogPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
