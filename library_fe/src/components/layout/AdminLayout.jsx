import { Layout } from "antd";
import UserHeader from "./Header/UserHeader";
import "/src/styles/Layout.css";
import AdminSideBar from "./SideBar/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Layout className="container">
        <AdminSideBar />
        <Layout className="content">
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
