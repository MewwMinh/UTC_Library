import React, { useState, useEffect } from "react";
import {
  Avatar,
  Col,
  Divider,
  Space,
  Typography,
  Statistic,
  Card,
  Skeleton,
  Tag,
  Badge,
  Tooltip,
  notification,
  Modal,
  Button,
} from "antd";
import {
  CalendarOutlined,
  MailOutlined,
  IdcardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  CrownOutlined,
  ManOutlined,
  WomanOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import librarianService from "/src/services/librarianService";

const { Title, Text } = Typography;

const PatronInformation = () => {
  const [patronData, setPatronData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const { patronId } = useParams();

  useEffect(() => {
    if (patronId) {
      fetchPatronData(patronId);
    }
  }, [patronId]);

  const fetchPatronData = async (id) => {
    try {
      setLoading(true);
      const response = await librarianService.getPatronInformation(id);

      if (response.success) {
        setPatronData(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải thông tin bạn đọc",
        });
      }
    } catch (error) {
      console.error("Error fetching patron data:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankTag = (rank) => {
    let color, icon;
    switch (rank) {
      case "Vàng":
        color = "#FFD700";
        icon = <CrownOutlined />;
        break;
      case "Bạc":
        color = "#C0C0C0";
        icon = <TrophyOutlined />;
        break;
      case "Đồng":
        color = "#CD7F32";
        icon = <BookOutlined />;
        break;
      default:
        color = "#CD7F32";
        icon = <BookOutlined />;
    }

    return (
      <Tag
        icon={icon}
        color={color}
        style={{
          padding: "4px 8px",
          fontSize: "14px",
          borderRadius: "50px",
          fontWeight: "bold",
        }}
      >
        Thành viên {rank}
      </Tag>
    );
  };

  const getStatusTag = (expiryDate) => {
    const now = dayjs();
    const expiry = dayjs(expiryDate);
    const daysRemaining = expiry.diff(now, "day");

    let color, text;
    if (daysRemaining > 90) {
      color = "success";
      text = "Còn hạn";
    } else if (daysRemaining > 0) {
      color = "warning";
      text = `Còn ${daysRemaining} ngày`;
    } else {
      color = "error";
      text = "Hết hạn";
    }

    return (
      <Tag
        color={color}
        style={{
          padding: "4px 8px",
          fontSize: "14px",
          borderRadius: "50px",
        }}
      >
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        {text}
      </Tag>
    );
  };

  const getGenderIcon = (gender) => {
    if (gender === "Nam") {
      return <ManOutlined style={{ color: "#1890ff" }} />;
    } else if (gender === "Nữ") {
      return <WomanOutlined style={{ color: "#eb2f96" }} />;
    }
    return <QuestionCircleOutlined />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const daysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return 0;
    const now = dayjs();
    const expiry = dayjs(expiryDate);
    return Math.max(0, expiry.diff(now, "day"));
  };

  return (
    <Col
      xs={24}
      sm={24}
      md={8}
      style={{
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <Skeleton active avatar={{ size: 180 }} paragraph={{ rows: 7 }} />
        ) : (
          <>
            <Card
              style={{
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                marginBottom: "20px",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  padding: "32px 0 24px",
                  position: "relative",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge
                    count={
                      <Tooltip
                        title={`Thành viên ${patronData?.membershipType}`}
                      >
                        <CrownOutlined
                          style={{
                            color:
                              patronData?.membershipType === "Vàng"
                                ? "#FFD700"
                                : patronData?.membershipType === "Bạc"
                                ? "#C0C0C0"
                                : "#CD7F32",
                            fontSize: "24px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "4px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }}
                        />
                      </Tooltip>
                    }
                    offset={[0, 10]}
                  >
                    <div onClick={() => setImageModalVisible(true)}>
                      <Avatar
                        size={180}
                        src={imageError ? null : patronData?.userImage}
                        icon={
                          imageError || !patronData?.userImage ? (
                            <UserOutlined />
                          ) : null
                        }
                        style={{
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          border: "4px solid white",
                          cursor: "pointer",
                          backgroundColor: imageError ? "#fafafa" : undefined,
                        }}
                        onError={() => setImageError(true)}
                      />
                    </div>
                  </Badge>
                </motion.div>

                <div style={{ marginTop: 16 }}>
                  <Title
                    level={3}
                    style={{
                      color: "white",
                      margin: 0,
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {patronData?.userName}
                  </Title>
                  <Space align="center" style={{ marginTop: 4 }}>
                    <IdcardOutlined
                      style={{ color: "rgba(255, 255, 255, 0.85)" }}
                    />
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.85)",
                        fontWeight: "500",
                      }}
                    >
                      {patronData?.userID}
                    </Text>
                  </Space>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  {getRankTag(patronData?.membershipType)}
                  {getStatusTag(patronData?.expirationDate)}
                </div>
              </div>

              <div style={{ padding: "16px 24px" }}>
                <Row
                  justify="space-around"
                  style={{
                    marginBottom: 16,
                    marginTop: 8,
                    background: "rgba(24, 144, 255, 0.05)",
                    padding: "16px 8px",
                    borderRadius: 8,
                  }}
                >
                  <Col span={12}>
                    <Statistic
                      title="Điểm thành viên"
                      value={patronData?.memberPoints || 0}
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Còn lại"
                      value={daysUntilExpiry(patronData?.expirationDate)}
                      suffix="ngày"
                      valueStyle={{
                        color:
                          daysUntilExpiry(patronData?.expirationDate) < 30
                            ? "#ff4d4f"
                            : "#52c41a",
                      }}
                    />
                  </Col>
                </Row>

                <Divider style={{ margin: "16px 0" }} />

                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <div>
                    <Text type="secondary">Vai trò</Text>
                    <div style={{ fontWeight: 500 }}>
                      <UserOutlined style={{ marginRight: 8 }} />
                      {patronData?.role || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Email</Text>
                    <Tooltip title={patronData?.email}>
                      <div
                        style={{
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <MailOutlined style={{ marginRight: 8 }} />
                        {patronData?.email || "N/A"}
                      </div>
                    </Tooltip>
                  </div>
                  <div>
                    <Text type="secondary">Ngày sinh</Text>
                    <div style={{ fontWeight: 500 }}>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      {formatDate(patronData?.dateOfBirth)}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Giới tính</Text>
                    <div style={{ fontWeight: 500 }}>
                      {getGenderIcon(patronData?.gender)}
                      <span style={{ marginLeft: 8 }}>
                        {patronData?.gender || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Ngày đăng ký thành viên</Text>
                    <div style={{ fontWeight: 500 }}>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      {formatDate(patronData?.creationDate)}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Ngày hết hạn thành viên</Text>
                    <div
                      style={{
                        fontWeight: 500,
                        color:
                          daysUntilExpiry(patronData?.expirationDate) < 30
                            ? "#ff4d4f"
                            : "inherit",
                      }}
                    >
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      {formatDate(patronData?.expirationDate)}
                    </div>
                  </div>
                </Space>
              </div>
            </Card>

            {/* Modal để xem ảnh lớn */}
            <Modal
              visible={imageModalVisible}
              footer={null}
              onCancel={() => setImageModalVisible(false)}
              width={520}
              centered
              style={{ padding: 0 }}
              bodyStyle={{ padding: 0 }}
            >
              {patronData?.userImage && !imageError ? (
                <img
                  src={patronData.userImage}
                  alt={patronData.userName}
                  style={{
                    maxWidth: "100%",
                    display: "block",
                    margin: "0 auto",
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  style={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <UserOutlined style={{ fontSize: 100, color: "#bfbfbf" }} />
                </div>
              )}
            </Modal>
          </>
        )}
      </motion.div>
    </Col>
  );
};

// Import Row from Antd since it's used in the component
import { Row } from "antd";
import { useParams } from "react-router-dom";

PatronInformation.propTypes = {
  patronId: PropTypes.string.isRequired,
};

export default PatronInformation;
