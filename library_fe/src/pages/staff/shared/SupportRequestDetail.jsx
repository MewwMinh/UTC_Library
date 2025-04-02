import React, { useState } from "react";
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Timeline,
  Avatar,
  Form,
  Input,
  Select,
  Space,
  Divider,
  Row,
  Col,
  Typography,
  Breadcrumb,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const SupportRequestDetail = () => {
  // State cho form phản hồi
  const [responseForm] = Form.useForm();
  const [status, setStatus] = useState("processing");

  // Dữ liệu mẫu cho chi tiết yêu cầu
  const requestDetail = {
    id: "YC-2025060001",
    title: 'Gia hạn sách "Lập trình Java cơ bản"',
    requesterName: "Nguyễn Văn A",
    requesterID: "2022010123",
    requestType: "Gia hạn sách",
    description:
      'Em đang làm đồ án môn học nên cần thêm thời gian để nghiên cứu sách "Lập trình Java cơ bản" (mã sách: S-JAVA-2023-015). Em đã mượn sách này từ ngày 01/06/2025 và đến hạn trả vào ngày 15/06/2025. Em mong được gia hạn thêm 10 ngày để hoàn thành đồ án. Em xin cảm ơn!',
    createdAt: "2025-06-10 09:35:22",
    status: "pending",
    lastUpdated: "2025-06-10 09:35:22",
    membershipType: "Bạc",
    memberPoints: 135,
    email: "nguyenvana@gmail.com",
    borrowedBook: {
      id: "S-JAVA-2023-015",
      title: "Lập trình Java cơ bản",
      author: "Nguyễn Văn Hiếu",
      borrowDate: "2025-06-01",
      dueDate: "2025-06-15",
    },
  };

  // Dữ liệu mẫu cho lịch sử phản hồi
  const responseHistory = [
    {
      id: 1,
      staffName: "Lê Thị Hoa",
      staffAvatar: null,
      content:
        "Chào bạn, tôi đã nhận được yêu cầu gia hạn sách của bạn. Tôi sẽ kiểm tra và phản hồi sớm.",
      timestamp: "2025-06-10 10:15:30",
      status: "processing",
    },
  ];

  // Hàm xử lý khi gửi phản hồi
  const handleSubmitResponse = (values) => {
    console.log("Phản hồi mới:", values);
    // Ở đây bạn sẽ gọi API để lưu phản hồi
    // Sau đó reset form
    responseForm.resetFields();
  };

  // Hiển thị trạng thái
  const renderStatusTag = (status) => {
    let color, text, icon;
    switch (status) {
      case "pending":
        color = "gold";
        text = "Đang chờ xử lý";
        icon = <ClockCircleOutlined />;
        break;
      case "processing":
        color = "blue";
        text = "Đang xử lý";
        icon = <SyncOutlined spin />;
        break;
      case "completed":
        color = "green";
        text = "Đã hoàn thành";
        icon = <CheckCircleOutlined />;
        break;
      case "rejected":
        color = "red";
        text = "Bị từ chối";
        icon = <ExclamationCircleOutlined />;
        break;
      default:
        color = "default";
        text = status;
        icon = null;
    }
    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  // Hiển thị màu cho loại thành viên
  const renderMembershipColor = (type) => {
    switch (type) {
      case "Vàng":
        return "#FFD700";
      case "Bạc":
        return "#C0C0C0";
      case "Đồng":
        return "#CD7F32";
      default:
        return "#000000";
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <a href="/dashboard">
            <span>Dashboard</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/support-requests">
            <span>Quản lý yêu cầu hỗ trợ</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>{requestDetail.id}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => (window.location.href = "/support-requests")}
          >
            Quay lại
          </Button>
          <Title level={3} className="m-0">
            {requestDetail.title}
          </Title>
          {renderStatusTag(requestDetail.status)}
        </Space>
      </div>

      {/* Main content */}
      <Row gutter={[16, 16]}>
        {/* Left column - Request details */}
        <Col xs={24} lg={16}>
          <Card className="mb-4">
            <Descriptions
              title="Thông tin yêu cầu"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Mã yêu cầu">
                {requestDetail.id}
              </Descriptions.Item>
              <Descriptions.Item label="Loại yêu cầu">
                {requestDetail.requestType}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {requestDetail.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {renderStatusTag(requestDetail.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {requestDetail.lastUpdated}
              </Descriptions.Item>

              {requestDetail.borrowedBook && (
                <Descriptions.Item label="Thông tin sách" span={2}>
                  <Text strong>Mã sách:</Text> {requestDetail.borrowedBook.id}
                  <br />
                  <Text strong>Tên sách:</Text>{" "}
                  {requestDetail.borrowedBook.title}
                  <br />
                  <Text strong>Tác giả:</Text>{" "}
                  {requestDetail.borrowedBook.author}
                  <br />
                  <Text strong>Ngày mượn:</Text>{" "}
                  {requestDetail.borrowedBook.borrowDate}
                  <br />
                  <Text strong>Ngày hẹn trả:</Text>{" "}
                  {requestDetail.borrowedBook.dueDate}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Nội dung" span={2}>
                <div className="whitespace-pre-line">
                  {requestDetail.description}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Response history */}
          <Card
            title={
              <div className="flex items-center">
                <CommentOutlined className="mr-2" />
                <span>Lịch sử phản hồi</span>
              </div>
            }
            className="mb-4"
          >
            {responseHistory.length > 0 ? (
              <Timeline mode="left">
                {responseHistory.map((response) => (
                  <Timeline.Item
                    key={response.id}
                    dot={
                      <Avatar
                        size="small"
                        src={response.staffAvatar}
                        icon={!response.staffAvatar && <UserOutlined />}
                      />
                    }
                    color="blue"
                  >
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between mb-2">
                        <Text strong>{response.staffName}</Text>
                        <Text type="secondary">{response.timestamp}</Text>
                      </div>
                      <div className="mb-2">{response.content}</div>
                      {response.status && (
                        <div>
                          <Text type="secondary">Đã cập nhật trạng thái: </Text>
                          {renderStatusTag(response.status)}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                ))}

                <Timeline.Item
                  dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
                  color="gray"
                >
                  <Text type="secondary">
                    Tạo yêu cầu {requestDetail.createdAt}
                  </Text>
                </Timeline.Item>
              </Timeline>
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">Chưa có phản hồi nào</Text>
              </div>
            )}
          </Card>

          {/* Response form */}
          <Card title="Phản hồi yêu cầu">
            <Form
              form={responseForm}
              layout="vertical"
              onFinish={handleSubmitResponse}
            >
              <Form.Item
                name="status"
                label="Cập nhật trạng thái"
                initialValue={status}
              >
                <Select onChange={(val) => setStatus(val)}>
                  <Option value="processing">Đang xử lý</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                  <Option value="rejected">Từ chối</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="responseContent"
                label="Nội dung phản hồi"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung phản hồi",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                >
                  Gửi phản hồi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right column - User information */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center">
                <UserOutlined className="mr-2" />
                <span>Thông tin người gửi yêu cầu</span>
              </div>
            }
            className="mb-4"
          >
            <div className="flex items-center mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
              <div>
                <div className="text-lg font-medium">
                  {requestDetail.requesterName}
                </div>
                <div>
                  <Text type="secondary">MSSV/Mã bạn đọc:</Text>{" "}
                  {requestDetail.requesterID}
                </div>
                <Tag
                  color={renderMembershipColor(requestDetail.membershipType)}
                >
                  Thành viên {requestDetail.membershipType}
                </Tag>
              </div>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                {requestDetail.email}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm thành viên">
                {requestDetail.memberPoints}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex justify-between">
              <Button type="link" className="p-0">
                Xem lịch sử mượn sách
              </Button>
              <Button type="link" className="p-0">
                Xem các yêu cầu khác
              </Button>
            </div>
          </Card>

          <Card title="Thao tác nhanh">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button block type="primary">
                Phê duyệt yêu cầu
              </Button>
              <Button block danger>
                Từ chối yêu cầu
              </Button>
              <Button block>Chuyển tiếp cho nhân viên khác</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupportRequestDetail;
