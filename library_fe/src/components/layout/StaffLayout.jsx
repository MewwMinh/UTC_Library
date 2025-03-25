import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import StaffHeader from "./Header/StaffHeader";
import StaffSidebar from "./SideBar/StaffSideBar";
import StaffFooter from "./Footer/StaffFooter";
import styles from "/src/styles/layout/staff/StaffLayout.module.css";

const { Content } = Layout;

const StaffLayout = () => {
  return (
    <Layout className={styles.layout}>
      <StaffHeader />
      <Layout>
        <StaffSidebar />
        <Layout className={styles.siteLayout}>
          <Content className={styles.siteContent}>
            <div className={styles.contentWrapper}>
              <Outlet />
            </div>
          </Content>
          <StaffFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
