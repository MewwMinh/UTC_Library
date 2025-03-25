import { useEffect } from "react";
import { Layout, Avatar, Dropdown, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "/src/redux/features/authSlice";
import { fetchUserInfo, selectUserInfo } from "/src/redux/features/userSlice";
import styles from "/src/styles/layout/staff/StaffHeader.module.css";

const { Header } = Layout;
const { Title, Text } = Typography;

const StaffHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/staff/profile");
  };

  const items = [
    {
      key: "profile",
      label: <Text>Thông tin cá nhân</Text>,
      icon: <UserOutlined />,
      onClick: handleProfileClick,
    },
    {
      key: "divider",
      type: "divider",
    },
    {
      key: "logout",
      label: <Text>Đăng xuất</Text>,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>
          <img src="/public/logo-utc.png" alt="UTC Logo" />
        </div>
      </div>

      <div className={styles.headerCenter}>
        <Title level={3} className={styles.libraryTitle}>
          Thư viện Trường Đại học Giao thông vận tải
        </Title>
        <div className={styles.englishTitle}>
          UNIVERSITY OF TRANSPORT AND COMMUNICATIONS
        </div>
      </div>

      <div className={styles.headerRight}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <div className={styles.userProfile}>
            <Avatar
              src={userInfo?.userImage}
              size={40}
              icon={!userInfo?.userImage && <UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userName}>
              <Text strong>{userInfo?.userName || "Nhân viên"}</Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default StaffHeader;
