import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Spin,
  Typography,
  Breadcrumb,
  Avatar,
  notification,
  Row,
  Col,
  Space,
  Divider,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  MailOutlined,
  WarningOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  MailFilled,
  IdcardOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import violationService from "/src/services/librarian/violationService.js";
import styles from "/src/styles/violation/ViolationDetailPage.module.css";

const { Title, Text } = Typography;

const ViolationDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [violation, setViolation] = useState(null);
  const { violationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViolationDetails = async () => {
      try {
        setLoading(true);
        const response = await violationService.getViolationDetails(
          violationId
        );

        if (response.success) {
          setViolation(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải thông tin vi phạm",
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Đã xảy ra lỗi khi tải thông tin vi phạm",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViolationDetails();
  }, [violationId]);

  const handlePrint = () => {
    notification.info({
      message: "In phiếu vi phạm",
      description: "Đang chuẩn bị in phiếu vi phạm...",
    });
  };

  const handleSendEmail = () => {
    notification.info({
      message: "Gửi email thông báo",
      description: "Đang gửi thông báo vi phạm đến bạn đọc...",
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getMembershipTagColor = (type) => {
    switch (type) {
      case "Vàng":
        return "gold";
      case "Bạc":
        return "silver";
      case "Đồng":
        return "#cd7f32";
      default:
        return "#cd7f32";
    }
  };

  const calculateDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div className={styles.loadingText}>Đang tải thông tin vi phạm...</div>
      </div>
    );
  }

  if (!violation) {
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <Title level={4}>Không tìm thấy thông tin vi phạm</Title>
        <Button type="primary" onClick={handleGoBack}>
          Quay lại
        </Button>
      </div>
    );
  }

  const { patronInformation, borrowRecordDetailsReponse } = violation;

  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý vi phạm</Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết vi phạm</Breadcrumb.Item>
      </Breadcrumb>

      <div className={styles.cardHeader}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className={styles.backButton}
        >
          Quay lại
        </Button>
        <Title level={4} className={styles.cardTitle}>
          Chi tiết vi phạm
        </Title>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            In phiếu vi phạm
          </Button>
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={handleSendEmail}
          >
            Gửi thông báo
          </Button>
        </Space>
      </div>

      <Card bordered={false} className={styles.mainCard}>
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Violation Information Card */}
            <Card className={styles.innerCard}>
              <Title level={5} className={styles.innerCardTitle}>
                <WarningOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
                Thông tin vi phạm
              </Title>
              <Divider style={{ margin: "12px 0 16px" }} />

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div className={styles.infoLabel}>Loại vi phạm</div>
                  <div className={styles.infoValue}>
                    {violation.violationType}
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className={styles.infoLabel}>Ngày vi phạm</div>
                  <div className={styles.infoValue}>
                    {formatDate(violation.violationDate)}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.infoLabel}>Mô tả vi phạm</div>
                  <div className={styles.infoValue}>
                    {violation.description}
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "24px 0" }} />

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Số tiền phạt"
                    value={violation.penaltyAmount}
                    suffix="VNĐ"
                    precision={0}
                    valueStyle={{ color: "#ff4d4f" }}
                    prefix={<DollarOutlined />}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Điểm bị trừ"
                    value={violation.pointsDeducted}
                    valueStyle={{ color: "#ff4d4f" }}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <div className={styles.infoLabel}>Người ghi nhận</div>
                  <div className={styles.infoValue}>{violation.staffName}</div>
                </Col>
              </Row>
            </Card>

            {/* Book Information Card - Only shown if borrowRecordDetailsReponse exists */}
            {borrowRecordDetailsReponse && (
              <Card className={styles.innerCard}>
                <Title level={5} className={styles.innerCardTitle}>
                  <BookOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                  Thông tin sách mượn
                </Title>
                <Divider style={{ margin: "12px 0 16px" }} />

                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <div className={styles.infoLabel}>Tên sách</div>
                    <div className={styles.infoValue}>
                      {borrowRecordDetailsReponse.bookName}
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className={styles.infoLabel}>Mã phiếu mượn</div>
                    <div className={styles.infoValue}>
                      {borrowRecordDetailsReponse.recordID}
                    </div>
                  </Col>
                </Row>

                <Divider style={{ margin: "24px 0" }} />

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div className={styles.infoLabel}>
                      <CalendarOutlined style={{ marginRight: 4 }} /> Ngày mượn
                    </div>
                    <div className={styles.infoValue}>
                      {formatDate(borrowRecordDetailsReponse.borrowDate)}
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className={styles.infoLabel}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} /> Hạn trả
                    </div>
                    <div className={styles.infoValue}>
                      {formatDate(borrowRecordDetailsReponse.dueDate)}
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className={styles.infoLabel}>
                      <CalendarOutlined style={{ marginRight: 4 }} /> Ngày trả
                      thực tế
                    </div>
                    <div className={styles.infoValue}>
                      {formatDate(borrowRecordDetailsReponse.returnDate)}
                    </div>
                  </Col>
                </Row>

                {borrowRecordDetailsReponse.dueDate &&
                  borrowRecordDetailsReponse.returnDate && (
                    <div style={{ marginTop: 16 }}>
                      <Tag
                        color={
                          calculateDaysDifference(
                            borrowRecordDetailsReponse.dueDate,
                            borrowRecordDetailsReponse.returnDate
                          ) > 0
                            ? "error"
                            : "success"
                        }
                      >
                        {calculateDaysDifference(
                          borrowRecordDetailsReponse.dueDate,
                          borrowRecordDetailsReponse.returnDate
                        ) > 0
                          ? `Trả muộn ${calculateDaysDifference(
                              borrowRecordDetailsReponse.dueDate,
                              borrowRecordDetailsReponse.returnDate
                            )} ngày`
                          : "Trả đúng hạn"}
                      </Tag>
                    </div>
                  )}
              </Card>
            )}
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Patron Information Card */}
            <Card className={styles.innerCard}>
              <div className={styles.patronProfile}>
                <Avatar
                  size={100}
                  src={patronInformation.userImage}
                  icon={!patronInformation.userImage && <UserOutlined />}
                  className={styles.avatar}
                />
                <Title level={4} className={styles.patronName}>
                  {patronInformation.userName}
                </Title>
                <Tag
                  color={getMembershipTagColor(
                    patronInformation.membershipType
                  )}
                  className={styles.membershipTag}
                >
                  Thành viên {patronInformation.membershipType}
                </Tag>
              </div>

              <Divider style={{ margin: "24px 0 16px" }} />

              <div className={styles.sectionTitle}>
                <IdcardOutlined className={styles.sectionIcon} />
                Thông tin cá nhân
              </div>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className={styles.infoLabel}>Mã bạn đọc</div>
                  <div className={styles.infoValue}>
                    {patronInformation.userID}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.infoLabel}>
                    <MailFilled style={{ marginRight: 4 }} /> Email
                  </div>
                  <div className={styles.infoValue}>
                    {patronInformation.email}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.infoLabel}>Điểm thành viên</div>
                  <div className={styles.infoValue}>
                    <Text strong>{patronInformation.memberPoints} điểm</Text>
                    {patronInformation.memberPoints > 0 &&
                      violation.pointsDeducted > 0 && (
                        <Text type="danger">
                          {" "}
                          (-{violation.pointsDeducted})
                        </Text>
                      )}
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "24px 0 16px" }} />

              <div style={{ textAlign: "center" }}>
                <Button
                  type="link"
                  icon={<UserOutlined />}
                  onClick={() =>
                    navigate(`/librarian/patrons/${patronInformation.userID}`)
                  }
                >
                  Xem hồ sơ đầy đủ
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ViolationDetailPage;
