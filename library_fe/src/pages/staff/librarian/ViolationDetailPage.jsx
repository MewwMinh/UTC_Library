import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Divider,
  Row,
  Col,
  Typography,
  Timeline,
  Badge,
  notification,
  Spin,
  Breadcrumb,
  Avatar,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PrinterOutlined,
  MailOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ViolationDetail = () => {
  const [loading, setLoading] = useState(true);
  const [violation, setViolation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Lấy ID vi phạm từ URL (trong ứng dụng thực tế)
  // Sử dụng ID mẫu cho demo
  const violationId = "VI202503280001";

  // Mô phỏng dữ liệu vi phạm
  useEffect(() => {
    // Thực tế sẽ gọi API để lấy dữ liệu vi phạm theo ID
    setTimeout(() => {
      setViolation({
        violationId: violationId,
        violationType: "Trả sách quá hạn",
        description: 'Trả sách "Kỹ thuật lập trình" quá hạn 15 ngày.',
        penaltyAmount: 150000,
        pointsDeducted: 30,
        violationDate: "2025-03-22T14:30:00",
        status: "Chưa xử lý",
        user: {
          userId: "SV123456",
          fullName: "Nguyễn Văn A",
          membershipType: "Bạc",
          memberPoints: 250,
          email: "nguyenvana@example.com",
        },
        record: {
          recordId: "BR789012",
          bookName: "Kỹ thuật lập trình",
          bookId: "BK567890",
          borrowDate: "2025-02-20T10:15:00",
          dueDate: "2025-03-07T23:59:59",
          returnDate: "2025-03-22T14:30:00",
        },
        recordedBy: {
          userId: "TT456789",
          fullName: "Trần Thị B",
        },
        attachments: [{ name: "Ảnh tình trạng sách.jpg", url: "#" }],
        notes: [
          {
            date: "2025-03-22T14:35:00",
            content: "Đã thông báo cho sinh viên về vi phạm.",
            by: "Trần Thị B",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [violationId]);

  // Xử lý cập nhật trạng thái vi phạm
  const handleStatusUpdate = (values) => {
    console.log("Cập nhật trạng thái vi phạm:", values);

    // Thực tế sẽ gọi API để cập nhật
    notification.success({
      message: "Cập nhật thành công",
      description: "Thông tin vi phạm đã được cập nhật.",
    });

    // Cập nhật dữ liệu vi phạm ở frontend
    setViolation({
      ...violation,
      status: "Đã xử lý",
      penaltyAmount: values.penaltyAmount,
      notes: [
        ...violation.notes,
        {
          date: new Date().toISOString(),
          content: values.note,
          by: "Người dùng hiện tại",
        },
      ],
    });

    setModalVisible(false);
  };

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

  const getStatusTag = (status) => {
    switch (status) {
      case "Đã xử lý":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã xử lý
          </Tag>
        );
      case "Đang xử lý":
        return (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            Đang xử lý
          </Tag>
        );
      case "Chưa xử lý":
        return (
          <Tag color="warning" icon={<WarningOutlined />}>
            Chưa xử lý
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Đang tải thông tin vi phạm...</div>
      </div>
    );
  }

  return (
    <div className="violation-detail-container">
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý vi phạm</Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết vi phạm</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  style={{ marginRight: "16px" }}
                  onClick={() =>
                    notification.info({ message: "Quay lại danh sách vi phạm" })
                  }
                >
                  Quay lại
                </Button>
                <Title level={4} style={{ margin: 0 }}>
                  Chi tiết vi phạm #{violation.violationId}
                </Title>
              </div>
            }
            extra={
              <Space>
                {violation.status !== "Đã xử lý" && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      form.setFieldsValue({
                        status: "Đã xử lý",
                        penaltyAmount: violation.penaltyAmount,
                        note: "",
                      });
                      setModalVisible(true);
                    }}
                  >
                    Cập nhật trạng thái
                  </Button>
                )}
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  In phiếu vi phạm
                </Button>
                <Button icon={<MailOutlined />} onClick={handleSendEmail}>
                  Gửi thông báo
                </Button>
              </Space>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card
                  type="inner"
                  title="Thông tin vi phạm"
                  extra={getStatusTag(violation.status)}
                >
                  <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label="Loại vi phạm">
                      {violation.violationType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày vi phạm">
                      {new Date(violation.violationDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả vi phạm" span={2}>
                      {violation.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số tiền phạt">
                      <Text type="danger" strong>
                        {violation.penaltyAmount.toLocaleString()} VNĐ
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Điểm bị trừ">
                      <Text type="danger" strong>
                        {violation.pointsDeducted} điểm
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Người ghi nhận">
                      {violation.recordedBy.fullName} (
                      {violation.recordedBy.userId})
                    </Descriptions.Item>
                    {violation.attachments &&
                      violation.attachments.length > 0 && (
                        <Descriptions.Item label="Tài liệu đính kèm" span={2}>
                          {violation.attachments.map((attachment, index) => (
                            <div key={index}>
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {attachment.name}
                              </a>
                            </div>
                          ))}
                        </Descriptions.Item>
                      )}
                  </Descriptions>
                </Card>

                <Card
                  type="inner"
                  title="Thông tin sách mượn"
                  style={{ marginTop: "16px" }}
                  extra={<BookOutlined />}
                >
                  <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label="Mã phiếu mượn">
                      {violation.record.recordId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã sách">
                      {violation.record.bookId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên sách" span={2}>
                      {violation.record.bookName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày mượn">
                      {new Date(violation.record.borrowDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hạn trả">
                      {new Date(violation.record.dueDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày trả thực tế">
                      {new Date(violation.record.returnDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số ngày quá hạn">
                      <Text type="danger">15 ngày</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  type="inner"
                  title="Thông tin bạn đọc"
                  extra={<UserOutlined />}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar size={80} icon={<UserOutlined />} />
                    <Title
                      level={5}
                      style={{ marginTop: "8px", marginBottom: "4px" }}
                    >
                      {violation.user.fullName}
                    </Title>
                    <div>
                      <Badge
                        color={
                          violation.user.membershipType === "Vàng"
                            ? "gold"
                            : violation.user.membershipType === "Bạc"
                            ? "silver"
                            : "#cd7f32"
                        }
                        text={`Thành viên ${violation.user.membershipType}`}
                      />
                    </div>
                  </div>

                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Mã bạn đọc">
                      {violation.user.userId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {violation.user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điểm thành viên">
                      <Text strong>{violation.user.memberPoints} điểm</Text>
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider orientation="left">Các vi phạm khác</Divider>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <Timeline
                      items={[
                        {
                          color: "red",
                          children: (
                            <>
                              <Text strong>Làm hỏng sách</Text>
                              <div>Ngày: 15/01/2025</div>
                              <div>Tiền phạt: 100.000 VNĐ</div>
                            </>
                          ),
                        },
                        {
                          color: "orange",
                          children: (
                            <>
                              <Text strong>Trả sách quá hạn</Text>
                              <div>Ngày: 10/12/2024</div>
                              <div>Tiền phạt: 50.000 VNĐ</div>
                            </>
                          ),
                        },
                      ]}
                    />
                  </div>
                </Card>

                <Card
                  type="inner"
                  title="Lịch sử ghi chú"
                  style={{ marginTop: "16px" }}
                  extra={<FileTextOutlined />}
                >
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <Timeline
                      items={violation.notes.map((note, index) => ({
                        children: (
                          <>
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {new Date(note.date).toLocaleString("vi-VN")}
                              </Text>
                            </div>
                            <div>
                              <Text>{note.content}</Text>
                            </div>
                            <div>
                              <Text type="secondary" italic>
                                Bởi: {note.by}
                              </Text>
                            </div>
                          </>
                        ),
                      }))}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Cập nhật trạng thái vi phạm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleStatusUpdate}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="Đã xử lý">Đã xử lý</Option>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Chưa xử lý">Chưa xử lý</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="penaltyAmount"
            label="Số tiền phạt (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập số tiền phạt!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về việc xử lý vi phạm..."
            />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>Hủy bỏ</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViolationDetail;
