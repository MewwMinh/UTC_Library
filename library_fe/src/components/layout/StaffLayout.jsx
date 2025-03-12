import { Layout } from "antd";
import UserHeader from "./Header/UserHeader";
import "/src/styles/Layout.css";
import AdminSideBar from "./SideBar/AdminSideBar";
import { Outlet } from "react-router-dom";
import StaffSideBar from "./SideBar/StaffSideBar";

const StaffLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Layout className="container">
        <StaffSideBar />
        <Layout className="content">
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
