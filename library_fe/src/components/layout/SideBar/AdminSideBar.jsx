import { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "/src/styles/layout/admin/AdminSidebar.module.css";

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  // Các đường dẫn tương ứng với các menu item
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
      path: "/manager/dashboard",
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
      path: "/manager/employees",
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Cấu hình hệ thống",
      path: "/manager/config-system",
    },
    {
      key: "4",
      icon: <FileTextOutlined />,
      label: "Nhật ký hoạt động",
      path: "/manager/activity-logs",
    },
    {
      key: "5",
      icon: <BarChartOutlined />,
      label: "Báo cáo & Thống kê",
      path: "/manager/reports",
    },
  ];

  // Cập nhật selectedKey dựa trên đường dẫn hiện tại
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );

    if (currentMenuItem) {
      setSelectedKey(currentMenuItem.key);
    }
  }, [location.pathname, menuItems]);

  // Xử lý khi click vào menu item
  const handleMenuClick = (e) => {
    const { key } = e;
    setSelectedKey(key);

    // Tìm và chuyển hướng đến đường dẫn tương ứng
    const targetMenuItem = menuItems.find((item) => item.key === key);
    if (targetMenuItem) {
      navigate(targetMenuItem.path);
    }
  };

  return (
    <Sider width={250} className={styles.sidebar}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
        className={styles.menu}
        onClick={handleMenuClick}
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
