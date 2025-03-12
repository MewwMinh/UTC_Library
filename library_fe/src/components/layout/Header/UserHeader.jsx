import { useEffect, useState } from "react";
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Input,
  Avatar,
  Dropdown,
  Typography,
  message,
  Modal,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, logoutManual } from "/src/redux/features/authSlice";
import {
  fetchUserInfo,
  resetUserInfo,
  selectUserInfo,
  selectUserLoading,
} from "/src/redux/features/userSlice";
import "./UserHeader.css";

const { Header } = Layout;
const { Text } = Typography;

function UserHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Lấy data từ Redux store
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const userInfo = useSelector(selectUserInfo);
  const userLoading = useSelector(selectUserLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch thông tin người dùng khi component được mount và token thay đổi
  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(fetchUserInfo())
        .unwrap()
        .catch((error) => {
          // Xử lý lỗi nếu cần
          if (error.code === 9998 || error.code === 9999) {
            // Token hết hạn hoặc không hợp lệ
            message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            handleLogout();
          } else {
            message.error(
              error.message || "Không thể lấy thông tin người dùng"
            );
          }
        });
    }
  }, [token, isAuthenticated, dispatch]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Dispatch action logout từ Redux
          await dispatch(logout()).unwrap();
          message.success("Đăng xuất thành công");
          navigate("/login");
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
          message.error("Có lỗi xảy ra khi đăng xuất");

          // Nếu có lỗi, thực hiện logout thủ công
          dispatch(logoutManual());
          dispatch(resetUserInfo());
          navigate("/login");
        }
      },
    });
  };

  // Xử lý các action từ menu
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "logout":
        handleLogout();
        break;
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "change-password":
        navigate("/change-password");
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Thông tin cá nhân" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
    { key: "change-password", icon: <LockOutlined />, label: "Đổi mật khẩu" },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <Header
      className={`modern-header ${isScrolled ? "scrolled" : ""}`}
      style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#1565c0",
        color: "#fff",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Logo và tên thư viện */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img
          src="/public/logo-utc.png"
          alt="Library Logo"
          style={{ height: "40px" }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.5px",
          }}
        >
          TRUNG TÂM THÔNG TIN - THƯ VIỆN
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          maxWidth: "400px",
          margin: "0 20px",
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(0, 0, 0, 0.45)" }} />}
          placeholder="Tìm kiếm sách, tác giả..."
          style={{
            borderRadius: "4px",
            backgroundColor: "#ffffff",
          }}
          className="search-input"
        />
      </div>

      {/* Phần xin chào và avatar người dùng */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Text
          style={{ color: "#ffffff", fontSize: "14px", marginRight: "8px" }}
        >
          Xin chào, {userLoading ? "..." : userInfo.userName || "Người dùng"}
        </Text>

        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleMenuClick,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Avatar
            style={{
              backgroundColor: "#ffffff",
              color: "#1565c0",
              cursor: "pointer",
            }}
            src={userInfo.userImage}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
}

export default UserHeader;
