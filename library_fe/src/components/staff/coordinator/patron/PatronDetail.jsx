import React, { useState } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Spin,
  Tag,
  Space,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const ThongTinSinhVien = ({ reader, onSave }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Giả lập dữ liệu nếu không có reader truyền vào
  const readerData = reader || {
    id: "SV20230156",
    name: "Nguyễn Văn A",
    gender: "Nam",
    birthDate: "2000-05-15",
    email: "nguyenvana@example.com",
    memberRank: "Vàng",
    status: "Hoạt động",
    avatar:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  };

  // Chuẩn bị dữ liệu cho form
  const initialValues = {
    ...readerData,
    birthDate: dayjs(readerData.birthDate),
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = () => {
    form.setFieldsValue(initialValues);
    setEditing(true);
  };

  // Xử lý khi nhấn nút lưu
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Chuyển đổi date object sang string
      const formattedValues = {
        ...values,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
      };

      // Giả lập API call
      setTimeout(() => {
        setLoading(false);
        setEditing(false);
        message.success("Lưu thông tin thành công!");

        // Gọi callback nếu có
        if (onSave) {
          onSave(formattedValues);
        }
      }, 500);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  // Xác định icon và màu sắc cho trạng thái
  const getStatusTag = (status) => {
    switch (status) {
      case "Hoạt động":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {status}
          </Tag>
        );
      case "Tạm khóa":
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {status}
          </Tag>
        );
      case "Khóa":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {status}
          </Tag>
        );
      default:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {status}
          </Tag>
        );
    }
  };

  // Xác định icon và màu sắc cho hạng thành viên
  const getRankTag = (rank) => {
    switch (rank) {
      case "Vàng":
        return (
          <Tag icon={<TrophyOutlined />} color="gold">
            Hạng {rank}
          </Tag>
        );
      case "Bạc":
        return (
          <Tag icon={<TrophyOutlined />} color="default">
            Hạng {rank}
          </Tag>
        );
      case "Đồng":
        return (
          <Tag icon={<TrophyOutlined />} color="orange">
            Hạng {rank}
          </Tag>
        );
      default:
        return (
          <Tag icon={<TrophyOutlined />} color="orange">
            Hạng {rank}
          </Tag>
        );
    }
  };

  // Card title with action buttons
  const cardTitle = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Thông tin chi tiết bạn đọc
      </Title>
      <Space>
        {editing ? (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            Lưu
          </Button>
        ) : (
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        )}
      </Space>
    </div>
  );

  return (
    <Card
      title={cardTitle}
      bordered={true}
      className="reader-detail-card"
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Spin spinning={loading}>
        {editing ? (
          <Form form={form} layout="vertical" initialValues={initialValues}>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={8} style={{ textAlign: "center" }}>
                <Avatar
                  size={180}
                  src={readerData.avatar}
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    marginBottom: 20,
                  }}
                />

                <div style={{ marginBottom: 16 }}>
                  <Form.Item name="id" style={{ marginBottom: 0 }}>
                    <Input
                      disabled
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    />
                  </Form.Item>
                  <Text type="secondary">MSV / Mã bạn đọc</Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div>
                  <Form.Item name="memberRank" style={{ marginBottom: 8 }}>
                    <Select style={{ width: "100%" }}>
                      <Option value="Đồng">Đồng</Option>
                      <Option value="Bạc">Bạc</Option>
                      <Option value="Vàng">Vàng</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="status" style={{ marginBottom: 0 }}>
                    <Select style={{ width: "100%" }}>
                      <Option value="Hoạt động">Hoạt động</Option>
                      <Option value="Tạm khóa">Tạm khóa</Option>
                      <Option value="Khóa">Khóa</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={24} md={16}>
                <div
                  className="form-content"
                  style={{
                    background: "#f8f9fa",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        name="name"
                        label="Họ tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên!" },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Họ tên" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn giới tính">
                          <Option value="Nam">Nam</Option>
                          <Option value="Nữ">Nữ</Option>
                          <Option value="Khác">Khác</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="birthDate"
                        label="Ngày sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh!",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày sinh"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không hợp lệ!" },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                <div
                  style={{
                    background: "#f0f5ff",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Title level={5} style={{ marginTop: 0 }}>
                    Thông tin bổ sung
                  </Title>
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12}>
                      <Text strong>Ngày đăng ký:</Text>{" "}
                      <Text>
                        {dayjs(new Date())
                          .subtract(90, "day")
                          .format("DD/MM/YYYY")}
                      </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Hạn sử dụng đến:</Text>{" "}
                      <Text>
                        {dayjs(new Date()).add(275, "day").format("DD/MM/YYYY")}
                      </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Tổng số sách đã mượn:</Text> <Text>15</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Số sách đang mượn:</Text> <Text>2</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Điểm thành tích:</Text> <Text>85</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Số lần vi phạm:</Text> <Text>1</Text>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Form>
        ) : (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "linear-gradient(to bottom, #1890ff, #096dd9)",
                  padding: "24px 0",
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <Avatar
                  size={180}
                  src={readerData.avatar}
                  style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "4px solid white",
                  }}
                />

                <div style={{ marginTop: 16 }}>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    {readerData.name}
                  </Title>
                  <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    {readerData.id}
                  </Text>
                </div>
              </div>

              <Space size="large" style={{ marginBottom: 16 }}>
                {getRankTag(readerData.memberRank)}
                {getStatusTag(readerData.status)}
              </Space>

              <Divider style={{ margin: "16px 0" }} />

              <div
                style={{ background: "#f6ffed", padding: 16, borderRadius: 8 }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text type="secondary">Email</Text>
                    <div>
                      <MailOutlined /> {readerData.email}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Ngày sinh</Text>
                    <div>
                      <CalendarOutlined />{" "}
                      {dayjs(readerData.birthDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Giới tính</Text>
                    <div>{readerData.gender}</div>
                  </div>
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={24} md={16}>
              <div
                style={{
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  borderRadius: 8,
                  padding: 20,
                  height: "100%",
                }}
              >
                <Row gutter={[0, 24]}>
                  <Col span={24}>
                    <Title
                      level={5}
                      style={{
                        marginTop: 0,
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: 8,
                      }}
                    >
                      Thống kê hoạt động
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={12} md={6}>
                        <Card
                          size="small"
                          style={{
                            textAlign: "center",
                            background: "#e6f7ff",
                            borderColor: "#91d5ff",
                          }}
                        >
                          <Title
                            level={3}
                            style={{ margin: 0, color: "#1890ff" }}
                          >
                            15
                          </Title>
                          <Text type="secondary">Sách đã mượn</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card
                          size="small"
                          style={{
                            textAlign: "center",
                            background: "#fff7e6",
                            borderColor: "#ffd591",
                          }}
                        >
                          <Title
                            level={3}
                            style={{ margin: 0, color: "#fa8c16" }}
                          >
                            2
                          </Title>
                          <Text type="secondary">Đang mượn</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card
                          size="small"
                          style={{
                            textAlign: "center",
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                          }}
                        >
                          <Title
                            level={3}
                            style={{ margin: 0, color: "#52c41a" }}
                          >
                            85
                          </Title>
                          <Text type="secondary">Điểm thành tích</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card
                          size="small"
                          style={{
                            textAlign: "center",
                            background: "#fff2f0",
                            borderColor: "#ffccc7",
                          }}
                        >
                          <Title
                            level={3}
                            style={{ margin: 0, color: "#f5222d" }}
                          >
                            1
                          </Title>
                          <Text type="secondary">Vi phạm</Text>
                        </Card>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24}>
                    <Title
                      level={5}
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: 8,
                      }}
                    >
                      Thông tin bổ sung
                    </Title>
                    <Row gutter={[16, 8]}>
                      <Col xs={24} sm={12}>
                        <Card size="small" style={{ background: "#f9f9f9" }}>
                          <Text type="secondary">Ngày đăng ký</Text>
                          <div style={{ fontWeight: "bold" }}>
                            {dayjs(new Date())
                              .subtract(90, "day")
                              .format("DD/MM/YYYY")}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Card size="small" style={{ background: "#f9f9f9" }}>
                          <Text type="secondary">Hạn sử dụng đến</Text>
                          <div style={{ fontWeight: "bold" }}>
                            {dayjs(new Date())
                              .add(275, "day")
                              .format("DD/MM/YYYY")}
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </Spin>
    </Card>
  );
};

export default ThongTinSinhVien;
