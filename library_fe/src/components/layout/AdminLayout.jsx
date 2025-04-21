import { Layout } from "antd";
import AdminHeader from "./Header/AdminHeader";
import AdminSidebar from "./SideBar/AdminSideBar";
import AdminFooter from "./Footer/AdminFooter";
import styles from "/src/styles/layout/admin/AdminLayout.module.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Layout className={styles.adminLayout}>
      <AdminHeader />
      <Layout className={styles.mainContent}>
        <AdminSidebar />
        <Layout className={styles.contentWrapper}>
          <div className={styles.content}>
            <Outlet />
          </div>
          <AdminFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
