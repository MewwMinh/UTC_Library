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

function AdminSideBar() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "manage-staff",
      label: "Quản lý nhân viên",
      icon: <BookOutlined />,
    },
    {
      key: "config-system",
      label: "Cấu hình hệ thống",
      icon: <SearchOutlined />,
    },
    {
      key: "activity-logs",
      label: "Nhật ký hoạt động",
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
          navigate(`/admin/${e.key}`);
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

export default AdminSideBar;
