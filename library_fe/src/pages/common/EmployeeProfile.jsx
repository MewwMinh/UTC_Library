import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Typography,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Spin,
  Tooltip,
  Card,
  Statistic,
  List,
  Tag,
  Progress,
  Tabs,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
  CameraOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SmileOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  CheckCircleOutlined,
  ClockCircleTwoTone,
  BookOutlined,
  FileDoneOutlined,
  BellOutlined,
  LineChartOutlined,
  SettingOutlined,
  FireOutlined,
} from "@ant-design/icons";
import userService from "/src/services/authService.js";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EmployeeProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [, setActiveTab] = useState("1");

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Format date-time function
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString(
      "vi-VN"
    )}`;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getStaffDetails();

        if (response.success) {
          setUserData(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải thông tin người dùng",
            placement: "topRight",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle password change
  const handlePasswordChange = async (values) => {
    try {
      setSubmitting(true);
      const response = await userService.changePassword(
        values.oldPassword,
        values.newPassword
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Đổi mật khẩu thành công!",
          placement: "topRight",
        });
        setChangePasswordVisible(false);
        changePasswordForm.resetFields();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể đổi mật khẩu",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        placement: "topRight",
      });
      return;
    }

    try {
      const response = await userService.changeAvatar(file);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Thay đổi ảnh đại diện thành công!",
          placement: "topRight",
        });

        // Update user data with new avatar
        setUserData((prev) => ({
          ...prev,
          userImage: URL.createObjectURL(file), // Use local URL for immediate feedback
        }));
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể thay đổi ảnh đại diện",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error changing avatar:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "topRight",
      });
    }
  };

  // Handle avatar upload click
  const handleAvatarUploadClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  // Mock data for UI placeholders
  const mockTasks = [
    {
      id: 1,
      title: "Xử lý yêu cầu đặt sách #1234",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Phê duyệt đăng ký tham gia sự kiện",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      title: "Kiểm tra sách quá hạn",
      status: "completed",
      priority: "low",
    },
    {
      id: 4,
      title: "Cập nhật thông tin tài liệu mới",
      status: "pending",
      priority: "medium",
    },
  ];

  const mockStatistics = {
    booksProcessed: 27,
    ticketsResolved: 15,
    eventsManaged: 3,
    efficiency: 92,
  };

  const mockNotifications = [
    {
      id: 1,
      title: "Sách sắp đến hạn trả",
      time: "1 giờ trước",
      type: "warning",
    },
    { id: 2, title: "Yêu cầu hỗ trợ mới", time: "3 giờ trước", type: "info" },
    { id: 3, title: "Sự kiện mới được tạo", time: "Hôm qua", type: "success" },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Left Column - User Profile Info */}
      <Col xs={24} md={8} lg={6}>
        <Card
          className="profile-card"
          bordered={false}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
              margin: "-24px -24px 16px -24px",
              padding: "24px",
              textAlign: "center",
              color: "white",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <Avatar
                size={100}
                src={userData?.userImage}
                icon={!userData?.userImage && <UserOutlined />}
                style={{
                  border: "4px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Tooltip title="Thay đổi ảnh đại diện">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#f5f5f5",
                    color: "#1677ff",
                  }}
                  onClick={handleAvatarUploadClick}
                />
              </Tooltip>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <Title
              level={4}
              style={{ color: "white", margin: "16px 0 8px", fontWeight: 600 }}
            >
              {userData?.userName || "N/A"}
            </Title>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <TeamOutlined />
              <Text style={{ color: "white" }}>
                {userData?.roleName || "N/A"}
              </Text>
            </div>

            <Badge
              status={userData?.status === "Hoạt động" ? "success" : "default"}
              text={
                <Text style={{ color: "white" }}>
                  {userData?.status || "N/A"}
                </Text>
              }
              style={{ marginTop: "8px" }}
            />
          </div>

          <Tabs defaultActiveKey="1" onChange={setActiveTab} size="small">
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined /> Thông tin
                </span>
              }
              key="1"
            >
              <List size="small" split={false} style={{ marginTop: "8px" }}>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <IdcardOutlined /> Mã nhân viên:
                  </Text>
                  <Text strong>{userData?.userID || "N/A"}</Text>
                </List.Item>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <MailOutlined /> Email:
                  </Text>
                  <Text strong>{userData?.email || "N/A"}</Text>
                </List.Item>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <SmileOutlined /> Giới tính:
                  </Text>
                  <Text strong>{userData?.gender || "N/A"}</Text>
                </List.Item>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <CalendarOutlined /> Ngày sinh:
                  </Text>
                  <Text strong>{formatDate(userData?.dob)}</Text>
                </List.Item>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <IdcardOutlined /> CCCD/CMND:
                  </Text>
                  <Text strong>{userData?.nationalID || "N/A"}</Text>
                </List.Item>
                <List.Item style={{ padding: "8px 0" }}>
                  <Text type="secondary" style={{ marginRight: "8px" }}>
                    <LoginOutlined /> Đăng nhập gần nhất:
                  </Text>
                  <Text strong>{formatDateTime(userData?.lastLogin)}</Text>
                </List.Item>
              </List>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SettingOutlined /> Cài đặt
                </span>
              }
              key="2"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={() => setChangePasswordVisible(true)}
                  style={{ borderRadius: "6px" }}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  style={{ borderRadius: "6px" }}
                >
                  Cài đặt thông báo
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Col>

      {/* Right Column - Dashboard Widgets */}
      <Col xs={24} md={16} lg={18}>
        <Row gutter={[16, 16]}>
          {/* Statistics Row */}
          <Col xs={24}>
            <Card
              title={
                <div style={{ marginLeft: 15 }}>
                  <LineChartOutlined /> Thống kê hoạt động
                </div>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Sách đã xử lý"
                    value={mockStatistics.booksProcessed}
                    prefix={<BookOutlined style={{ color: "#1677ff" }} />}
                    valueStyle={{ color: "#1677ff" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Yêu cầu đã giải quyết"
                    value={mockStatistics.ticketsResolved}
                    prefix={<FileDoneOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Sự kiện đã quản lý"
                    value={mockStatistics.eventsManaged}
                    prefix={<CalendarOutlined style={{ color: "#722ed1" }} />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Hiệu suất"
                    value={mockStatistics.efficiency}
                    suffix="%"
                    prefix={<FireOutlined style={{ color: "#fa8c16" }} />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                  <Progress
                    percent={mockStatistics.efficiency}
                    size="small"
                    status="active"
                    showInfo={false}
                    strokeColor={{ from: "#fa8c16", to: "#ffc53d" }}
                    style={{ marginTop: "8px" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Tasks Widget */}
          <Col xs={24} md={12}>
            <Card
              title={
                <div style={{ marginLeft: 15 }}>
                  <ClockCircleTwoTone twoToneColor="#1677ff" /> Nhiệm vụ hôm nay
                </div>
              }
              extra={
                <a href="#" style={{ marginRight: 15 }}>
                  Xem tất cả
                </a>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <List
                dataSource={mockTasks}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      // eslint-disable-next-line react/jsx-key
                      <Button
                        size="small"
                        type={
                          item.status === "completed" ? "default" : "primary"
                        }
                      >
                        {item.status === "completed" ? "Hoàn thành" : "Xử lý"}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={
                            item.status === "completed" ? (
                              <CheckCircleOutlined />
                            ) : (
                              <ClockCircleOutlined />
                            )
                          }
                          style={{
                            backgroundColor:
                              item.status === "completed"
                                ? "#52c41a"
                                : "#1677ff",
                            color: "#fff",
                          }}
                        />
                      }
                      title={<Text strong>{item.title}</Text>}
                      description={
                        <Tag
                          color={
                            item.priority === "high"
                              ? "error"
                              : item.priority === "medium"
                              ? "warning"
                              : "success"
                          }
                        >
                          {item.priority === "high"
                            ? "Ưu tiên cao"
                            : item.priority === "medium"
                            ? "Ưu tiên trung bình"
                            : "Ưu tiên thấp"}
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Notifications Widget */}
          <Col xs={24} md={12}>
            <Card
              title={
                <div style={{ marginLeft: 15 }}>
                  <BellOutlined /> Thông báo
                </div>
              }
              variant="borderless"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                height: "100%",
              }}
            >
              <List
                dataSource={mockNotifications}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<BellOutlined />}
                          style={{
                            backgroundColor:
                              item.type === "warning"
                                ? "#faad14"
                                : item.type === "success"
                                ? "#52c41a"
                                : "#1677ff",
                            color: "#fff",
                          }}
                        />
                      }
                      title={<Text strong>{item.title}</Text>}
                      description={<Text type="secondary">{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Col>

      {/* Change Password Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", margin: "0 0 16px" }}>
            <SafetyCertificateOutlined
              style={{ color: "#1677ff", marginRight: 8, fontSize: "20px" }}
            />
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Đổi mật khẩu
            </span>
          </div>
        }
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        destroyOnClose
        width={400}
        centered
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hai mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                size="large"
                onClick={() => setChangePasswordVisible(false)}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
              >
                Xác nhận
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default EmployeeProfile;
