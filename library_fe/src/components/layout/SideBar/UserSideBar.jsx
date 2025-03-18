import { useState, useEffect } from "react";
import { Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import CustomMenuItem from "../Menu/CustomMenuItem";
import "./UserSideBar.css";

const { Sider } = Layout;

function UserSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("dashboard");

  // Xác định menu đang được chọn dựa trên đường dẫn hiện tại
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const currentPath = pathSegments[pathSegments.length - 1];

    if (
      currentPath === "" ||
      currentPath === "user" ||
      currentPath === "dashboard"
    ) {
      setSelectedKey("dashboard");
    } else {
      setSelectedKey(currentPath);
    }
  }, [location]);

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/user/dashboard",
    },
    {
      key: "borrowReturnBook",
      label: "Mượn & Trả Sách",
      icon: <BookOutlined />,
      path: "/user/borrowReturnBook",
    },
    {
      key: "searchBook",
      label: "Tìm kiếm Sách",
      icon: <SearchOutlined />,
      path: "/user/searchBook",
    },
    {
      key: "order",
      label: "Đặt sách & Đặt chỗ",
      icon: <ShoppingCartOutlined />,
      path: "/user/order",
    },
    {
      key: "event",
      label: "Sự kiện & Hội thảo",
      icon: <CalendarOutlined />,
      path: "/user/event",
    },
    {
      key: "achievement",
      label: "Thành tựu",
      icon: <TrophyOutlined />,
      path: "/user/achievement",
    },
    {
      key: "request",
      label: "Góp ý & Yêu cầu",
      icon: <CommentOutlined />,
      path: "/user/request",
    },
  ];

  // Xử lý khi click vào menu
  const handleMenuClick = (item) => {
    setSelectedKey(item.key);
    navigate(item.path);
  };

  return (
    <Sider
      className="custom-sider"
      width={250}
      style={{
        top: 64,
        overflowX: "hidden",
      }}
    >
      <div className="sidebar-container">
        {menuItems.map((item) => (
          <CustomMenuItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            selected={selectedKey === item.key}
            onClick={() => handleMenuClick(item)}
          />
        ))}
      </div>
    </Sider>
  );
}

export default UserSideBar;
