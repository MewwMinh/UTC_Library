import { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  DashboardOutlined,
  BookOutlined,
  SwapOutlined,
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/layout/staff/StaffSidebar.module.css";

const { Sider } = Layout;

const StaffSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { scope } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const isLibrarian = scope === "LIBRARIAN";
  const isCoordinator = scope === "COORDINATOR";

  // Get the current selected key based on path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/staff/dashboard")) return "dashboard";
    if (path.includes("/staff/books")) return "books";
    if (path.includes("/staff/borrow")) return "borrow";
    if (path.includes("/staff/violations")) return "violations";
    if (path.includes("/staff/reading-room")) return "reading-room";
    if (path.includes("/staff/seat-reservations")) return "seat-reservations";
    if (path.includes("/staff/events")) return "events";
    if (path.includes("/staff/members")) return "members";
    if (path.includes("/staff/support-requests")) return "support-requests";
    if (path.includes("/staff/reports")) return "reports";
    if (path.includes("/staff/profile")) return "profile";
    return "dashboard";
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "dashboard":
        navigate("/staff/dashboard");
        break;
      case "books":
        navigate("/staff/books");
        break;
      case "borrow":
        navigate("/staff/borrow-return");
        break;
      case "violations":
        navigate("/staff/violations");
        break;
      case "reading-room":
        navigate("/staff/reading-room");
        break;
      case "seat-reservations":
        navigate("/staff/seat-reservations");
        break;
      case "events":
        navigate("/staff/events");
        break;
      case "members":
        navigate("/staff/members");
        break;
      case "support-requests":
        navigate("/staff/support-requests");
        break;
      case "reports":
        navigate("/staff/reports");
        break;
      default:
        navigate("/staff/dashboard");
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className={styles.sidebar}
      width={256}
      theme="light"
      trigger={null}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        onClick={handleMenuClick}
        className={styles.menu}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },

          // Các menu dành cho Thủ thư
          ...(isLibrarian
            ? [
                {
                  key: "librarian-group",
                  type: "group",
                  label: "Quản lý sách",
                },
                {
                  key: "books",
                  icon: <BookOutlined />,
                  label: "Danh mục sách",
                },
                {
                  key: "borrow",
                  icon: <SwapOutlined />,
                  label: "Mượn & trả sách",
                },
                {
                  key: "violations",
                  icon: <WarningOutlined />,
                  label: "Quản lý vi phạm",
                },
              ]
            : []),

          // Các menu dành cho Nhân viên phòng đọc
          ...(isCoordinator
            ? [
                {
                  key: "coordinator-group",
                  type: "group",
                  label: "Quản lý phòng đọc",
                },
                {
                  key: "reading-room",
                  icon: <HomeOutlined />,
                  label: "Phòng đọc",
                },
                {
                  key: "events",
                  icon: <CalendarOutlined />,
                  label: "Sự kiện",
                },
                {
                  key: "members",
                  icon: <TeamOutlined />,
                  label: "Quản lý thành viên",
                },
              ]
            : []),

          // Menu chung
          {
            key: "common-group",
            type: "group",
            label: "Chung",
          },
          {
            key: "support-requests",
            icon: <QuestionCircleOutlined />,
            label: "Yêu cầu hỗ trợ",
          },
          {
            key: "reports",
            icon: <BarChartOutlined />,
            label: "Báo cáo thống kê",
          },
        ]}
      />
    </Sider>
  );
};

export default StaffSidebar;
