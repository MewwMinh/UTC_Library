import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import {
  DashboardOutlined,
  BookOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "/src/styles/Sider.css";
import { useNavigate } from "react-router-dom";

function StaffSideBar() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "manage-patron",
      label: "Quản lý người dùng",
      icon: <BookOutlined />,
    },
    {
      key: "create-user",
      label: "Tạo người dùng mới",
      icon: <SearchOutlined />,
    },
    {
      key: "handle-support-request",
      label: "Xử lý yêu cầu hỗ trợ",
      icon: <WarningOutlined />,
    },
    {
      key: "manage-reading-room",
      label: "Check-in / Check-out",
      icon: <WarningOutlined />,
    },
    {
      key: "lib-used-history",
      label: "Lịch sử sử dụng thư viện",
      icon: <WarningOutlined />,
    },
    {
      key: "",
      label: "Mượn / Trả sách",
      icon: <WarningOutlined />,
    },
    {
      key: "manage-violation",
      label: "Quản lý vi phạm nội quy",
      icon: <WarningOutlined />,
    },
    {
      key: "activity-logs",
      label: "Phân tích & Báo cáo",
      icon: <WarningOutlined />,
    },
    {
      key: "lib-event",
      label: "Sự kiện Thư viện",
      icon: <WarningOutlined />,
    },
    {
      key: "manage-book",
      label: "Quản lý Sách",
      icon: <WarningOutlined />,
    },
    {
      key: "activity-logs",
      label: "Phê duyệt Tài liệu Đặc biệt",
      icon: <WarningOutlined />,
    },
  ];

  return (
    <Sider className="side-bar" width={250}>
      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        onClick={(e) => {
          setSelectedMenu(e.key);
          navigate(`/staff/${e.key}`);
        }}
        items={menuItems}
        style={{
          fontSize: "16px",
          fontWeight: "500",
          borderRight: "none",
        }}
      />
    </Sider>
  );
}

export default StaffSideBar;
