import { useEffect, useState } from "react";
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Input, Avatar, Dropdown, message, Modal } from "antd";
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

function SimplifiedLibraryHeader() {
  const [searchValue, setSearchValue] = useState("");

  // Obtener datos de Redux
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const userInfo = useSelector(selectUserInfo);
  const userLoading = useSelector(selectUserLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manejar búsqueda
  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/user/searchBook?q=${encodeURIComponent(value.trim())}`);
    }
  };

  // Obtener información del usuario
  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(fetchUserInfo())
        .unwrap()
        .catch((error) => {
          if (error.code === 9998 || error.code === 9999) {
            message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            handleLogout();
          } else {
            message.error(
              error.message || "Không thể lấy thông tin người dùng"
            );
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthenticated, dispatch]);

  // Manejar cierre de sesión
  const handleLogout = () => {
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(logout()).unwrap();
          message.success("Đăng xuất thành công");
          navigate("/login");
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
          message.error("Có lỗi xảy ra khi đăng xuất");

          dispatch(logoutManual());
          dispatch(resetUserInfo());
          navigate("/login");
        }
      },
    });
  };

  // Menú de usuario
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
    <Header className="library-header">
      {/* Logo y nombre de la biblioteca */}
      <div className="header-logo">
        <img
          src="/public/logo-utc.png"
          alt="Library Logo"
          className="logo-image"
        />
        <div className="library-name">TRUNG TÂM THÔNG TIN - THƯ VIỆN</div>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          prefix={
            <SearchOutlined style={{ color: "rgba(255, 255, 255, 0.6)" }} />
          }
          placeholder="Tìm kiếm sách, tác giả..."
          className="search-input"
          onSearch={handleSearch}
          enterButton
        />
      </div>

      {/* Thông tin người dùng */}
      <div className="user-info">
        <span className="welcome-text">
          Xin chào, {userLoading ? "..." : userInfo?.userName || "Người dùng"}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              className="user-avatar"
              src={userInfo?.userImage}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </span>
      </div>
    </Header>
  );
}

export default SimplifiedLibraryHeader;
