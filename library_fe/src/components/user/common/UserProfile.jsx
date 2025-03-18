// src/components/UserProfile.js
import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Divider,
  Badge,
  Avatar,
  Skeleton,
  Typography,
  Tag,
  notification,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  TrophyOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import patronService from "/src/services/patronService";

const { Title, Text } = Typography;

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Function to format date string from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Function to get badge color based on membership type
  const getMembershipColor = (type) => {
    switch (type) {
      case "Vàng":
        return "#FFD700";
      case "Bạc":
        return "#C0C0C0";
      case "Đồng":
        return "#CD7F32";
      default:
        return "#CD7F32";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated) {
          setLoading(false);
          notification.warning({
            message: "Chưa đăng nhập",
            description: "Vui lòng đăng nhập để xem thông tin cá nhân",
          });
          return;
        }

        const response = await patronService.getPatronInfo();

        if (response.success) {
          setUserData(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải thông tin người dùng",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Calculate days remaining until expiration
  const calculateDaysRemaining = (expirationDate) => {
    if (!expirationDate) return 0;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = Math.abs(expDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          loading={loading}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          {loading ? (
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          ) : (
            <>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                  padding: "20px",
                  marginTop: "-24px",
                  marginLeft: "-24px",
                  marginRight: "-24px",
                  color: "white",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Avatar
                      size={120}
                      src={userData?.userImage || null}
                      icon={!userData?.userImage && <UserOutlined />}
                      style={{
                        boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.4)",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={18} lg={18}>
                    <Title level={3} style={{ color: "white", margin: 0 }}>
                      {userData?.userName || "N/A"}
                    </Title>
                    <Row gutter={[16, 8]} style={{ marginTop: "8px" }}>
                      <Col>
                        <Badge
                          color={getMembershipColor(userData?.membershipType)}
                          text={
                            <Text style={{ color: "white" }}>
                              Hạng thành viên:{" "}
                              {userData?.membershipType || "N/A"}
                            </Text>
                          }
                        />
                      </Col>
                      <Col>
                        <Text style={{ color: "white" }}>
                          <IdcardOutlined /> Mã bạn đọc:{" "}
                          {userData?.userID || "N/A"}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>

              <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
                <Col xs={24} md={16}>
                  <Title level={4}>Thông tin cá nhân</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <UserOutlined /> Vai trò:
                      </Text>
                      <Text>{userData?.role || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <UserOutlined /> Giới tính:
                      </Text>
                      <Text>{userData?.gender || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <CalendarOutlined /> Ngày sinh:
                      </Text>
                      <Text>{formatDate(userData?.dateOfBirth) || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <MailOutlined /> Email:
                      </Text>
                      <Text>{userData?.email || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <CalendarOutlined /> Ngày tạo tài khoản:
                      </Text>
                      <Text>{formatDate(userData?.creationDate) || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong style={{ marginRight: "8px" }}>
                        <CalendarOutlined /> Ngày hết hạn:
                      </Text>
                      <Text>
                        {formatDate(userData?.expirationDate) || "N/A"}
                      </Text>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} md={8}>
                  <Card
                    style={{
                      background: "#f5f5f5",
                      borderRadius: "8px",
                    }}
                  >
                    <Statistic
                      title={<Title level={5}>Điểm thành viên</Title>}
                      value={userData?.memberPoints || 0}
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: "#1677ff" }}
                    />
                    <Divider style={{ margin: "16px 0" }} />
                    <Statistic
                      title={<Title level={5}>Còn lại</Title>}
                      value={calculateDaysRemaining(userData?.expirationDate)}
                      suffix="ngày"
                      valueStyle={{
                        color:
                          calculateDaysRemaining(userData?.expirationDate) < 30
                            ? "#ff4d4f"
                            : "#52c41a",
                      }}
                    />
                    {calculateDaysRemaining(userData?.expirationDate) < 30 && (
                      <Tag color="error" style={{ marginTop: "8px" }}>
                        Sắp hết hạn
                      </Tag>
                    )}
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default UserProfile;
