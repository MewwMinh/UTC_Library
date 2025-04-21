import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/layout/admin/AdminSidebar.module.css";

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Cấu hình hệ thống",
    },
    {
      key: "4",
      icon: <FileTextOutlined />,
      label: "Nhật ký hoạt động",
    },
    {
      key: "5",
      icon: <BarChartOutlined />,
      label: "Báo cáo & Thống kê",
    },
  ];

  return (
    <Sider width={250} className={styles.sidebar}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className={styles.menu}
        onClick={(e) => setSelectedKey(e.key)}
      />

      <div className={styles.sidebarFooter}>
        <div className={styles.footerItem}>
          <Text className={styles.version}>Phiên bản 1.0.0</Text>
        </div>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
