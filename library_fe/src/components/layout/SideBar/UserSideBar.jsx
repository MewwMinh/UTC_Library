import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import {
  DashboardOutlined,
  BookOutlined,
  SearchOutlined,
  WarningOutlined,
  ImportOutlined,
  ProductOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./UserSideBar.css";
import { useNavigate } from "react-router-dom";

function UserSideBar() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "borrowReturnBook",
      label: "Mượn & Trả Sách",
      icon: <BookOutlined />,
    },
    { key: "searchBook", label: "Tìm kiếm Sách", icon: <SearchOutlined /> },

    {
      key: "order",
      label: "Đặt sách & đặt chỗ",
      icon: <ProductOutlined />,
    },
    {
      key: "event",
      label: "Sự kiện & hội thảo",
      icon: <TeamOutlined />,
    },
    {
      key: "violation",
      label: "Vi Phạm",
      icon: <WarningOutlined />,
    },
    {
      key: "request",
      label: "Góp ý & Yêu cầu",
      icon: <ImportOutlined />,
    },
  ];

  return (
    <Sider
      className="custom-sider"
      width={250}
      style={{
        top: 64,
        background: "#fff",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        onClick={(e) => {
          setSelectedMenu(e.key);
          navigate(`/user/${e.key}`); // Điều hướng đến /user/key
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

export default UserSideBar;
