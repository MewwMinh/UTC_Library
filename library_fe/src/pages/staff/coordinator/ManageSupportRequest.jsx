import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Form,
  Select,
  DatePicker,
  Drawer,
  Badge,
  Descriptions,
  Timeline,
  Tabs,
  message,
  Empty,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  MailOutlined,
  TagOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill"; // Sử dụng React-Quill cho rich text editor
import "react-quill/dist/quill.snow.css";
import { Column } from "@ant-design/plots"; // Biểu đồ từ Ant Design Charts

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data cho yêu cầu hỗ trợ
const mockSupportRequests = [
  {
    id: "YC-2023-001",
    title: "Không thể gia hạn sách",
    requesterName: "Nguyễn Văn A",
    requesterCode: "2020UTC0123",
    requesterEmail: "nguyenvana@example.com",
    requesterType: "Sinh viên",
    memberRank: "Vàng",
    requestType: "Kỹ thuật",
    status: "pending",
    createdAt: "2023-11-01 09:12:34",
    content:
      'Em không thể gia hạn sách "Cơ sở dữ liệu" trên hệ thống. Khi em nhấn nút gia hạn, hệ thống báo lỗi "Không thể gia hạn sách này".',
    responses: [],
  },
  {
    id: "YC-2023-002",
    title: "Đề xuất mua sách mới",
    requesterName: "Trần Thị B",
    requesterCode: "2019UTC0089",
    requesterEmail: "tranthib@example.com",
    requesterType: "Sinh viên",
    memberRank: "Bạc",
    requestType: "Đề xuất",
    status: "processing",
    createdAt: "2023-11-02 14:30:45",
    content:
      'Em muốn đề xuất thư viện mua thêm sách "Machine Learning cơ bản" của tác giả Vũ Hữu Tiệp. Hiện tại thư viện chỉ có 2 cuốn và luôn trong tình trạng hết sách để mượn.',
    responses: [
      {
        responderName: "Lê Thị C",
        responderPosition: "Nhân viên thư viện",
        responseDate: "2023-11-03 08:15:22",
        content:
          "Chào bạn, cảm ơn bạn đã gửi đề xuất. Chúng tôi đang xem xét và sẽ phản hồi trong thời gian sớm nhất.",
      },
    ],
  },
  {
    id: "YC-2023-003",
    title: "Phản ánh cơ sở vật chất",
    requesterName: "Phạm Văn D",
    requesterCode: "2018UTC0056",
    requesterEmail: "phamvand@example.com",
    requesterType: "Giảng viên",
    memberRank: "Vàng",
    requestType: "Góp ý",
    status: "completed",
    createdAt: "2023-11-03 16:45:12",
    content:
      "Tôi muốn phản ánh về tình trạng điều hòa ở phòng đọc số 3. Nhiệt độ quá lạnh và không điều chỉnh được, khiến sinh viên khó tập trung học tập.",
    responses: [
      {
        responderName: "Nguyễn Thị E",
        responderPosition: "Quản lý thư viện",
        responseDate: "2023-11-04 10:30:45",
        content:
          "Kính chào Thầy, cảm ơn Thầy đã góp ý. Chúng tôi đã ghi nhận và sẽ liên hệ với bộ phận kỹ thuật để kiểm tra và sửa chữa hệ thống điều hòa trong tuần này.",
      },
      {
        responderName: "Nguyễn Thị E",
        responderPosition: "Quản lý thư viện",
        responseDate: "2023-11-06 15:20:18",
        content:
          "Kính chào Thầy, chúng tôi đã hoàn thành việc sửa chữa hệ thống điều hòa tại phòng đọc số 3. Mong Thầy tiếp tục đóng góp ý kiến để thư viện ngày càng hoàn thiện hơn.",
      },
    ],
  },
  {
    id: "YC-2023-004",
    title: "Lỗi khi đặt chỗ học nhóm",
    requesterName: "Hoàng Thị G",
    requesterCode: "2021UTC0201",
    requesterEmail: "hoangthig@example.com",
    requesterType: "Sinh viên",
    memberRank: "Đồng",
    requestType: "Kỹ thuật",
    status: "rejected",
    createdAt: "2023-11-05 11:20:34",
    content:
      'Em không thể đặt chỗ học nhóm cho ngày mai. Hệ thống báo lỗi "Không có phòng trống" nhưng khi em kiểm tra lịch thì vẫn còn phòng trống.',
    responses: [
      {
        responderName: "Trần Văn F",
        responderPosition: "Nhân viên kỹ thuật",
        responseDate: "2023-11-05 14:15:22",
        content:
          "Chào bạn, chúng tôi đã kiểm tra và phát hiện phòng học nhóm đang được bảo trì nên không hiển thị trong hệ thống đặt chỗ. Bạn có thể đặt vào ngày khác hoặc sử dụng khu vực học chung. Xin lỗi vì sự bất tiện này.",
      },
    ],
  },
  {
    id: "YC-2023-005",
    title: "Thất lạc đồ cá nhân",
    requesterName: "Lý Văn H",
    requesterCode: "2022UTC0178",
    requesterEmail: "lyvanh@example.com",
    requesterType: "Sinh viên",
    memberRank: "Bạc",
    requestType: "Hỗ trợ",
    status: "pending",
    createdAt: "2023-11-06 13:40:56",
    content:
      "Em để quên một quyển sổ ghi chép màu xanh ở bàn số 15, khu vực A của thư viện vào chiều ngày 05/11/2023. Em mong nhân viên thư viện kiểm tra và giúp em tìm lại.",
    responses: [],
  },
];

// Data cho biểu đồ thống kê
const chartData = [
  { type: "Kỹ thuật", count: 12 },
  { type: "Góp ý", count: 8 },
  { type: "Đề xuất", count: 5 },
  { type: "Hỗ trợ", count: 15 },
  { type: "Khác", count: 3 },
];

const SupportRequestManagement = () => {
  const [requests, setRequests] = useState(mockSupportRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockSupportRequests);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [responseForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter requests based on search text and filters
    const result = requests.filter((request) => {
      const matchSearch =
        request.title.toLowerCase().includes(searchText.toLowerCase()) ||
        request.requesterName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        request.id.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchType =
        typeFilter === "all" || request.requestType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });

    setFilteredRequests(result);
  }, [requests, searchText, statusFilter, typeFilter]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleViewRequest = (record) => {
    setCurrentRequest(record);
    setDrawerVisible(true);
    // Reset form
    responseForm.resetFields();
  };

  const handleSubmitResponse = (values) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newResponse = {
        responderName: "Nguyễn Văn Z", // Should get from logged in user
        responderPosition: "Nhân viên thư viện",
        responseDate: new Date().toLocaleString("vi-VN"),
        content: values.responseContent,
      };

      // Update the request with new response and status
      const updatedRequests = requests.map((req) => {
        if (req.id === currentRequest.id) {
          return {
            ...req,
            status: values.status,
            responses: [...req.responses, newResponse],
          };
        }
        return req;
      });

      setRequests(updatedRequests);
      setLoading(false);
      message.success("Đã gửi phản hồi thành công!");
      setDrawerVisible(false);
    }, 1000);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Đang chờ
          </Tag>
        );
      case "processing":
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Đang xử lý
          </Tag>
        );
      case "completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã giải quyết
          </Tag>
        );
      case "rejected":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Từ chối
          </Tag>
        );
      default:
        return (
          <Tag icon={<QuestionCircleOutlined />} color="default">
            Không xác định
          </Tag>
        );
    }
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requesterName",
      key: "requesterName",
      width: 150,
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "requestType",
      key: "requestType",
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewRequest(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 20px" }}>
        <Row>
          <Col span={12}>
            <Title level={3}>Quản lý yêu cầu hỗ trợ</Title>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button type="primary" icon={<SyncOutlined />}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "20px" }}>
        {/* Dashboard Cards */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số yêu cầu"
                value={requests.length}
                prefix={<TagOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang chờ xử lý"
                value={requests.filter((r) => r.status === "pending").length}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang xử lý"
                value={requests.filter((r) => r.status === "processing").length}
                valueStyle={{ color: "#1890ff" }}
                prefix={<SyncOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã giải quyết"
                value={requests.filter((r) => r.status === "completed").length}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Chart and Filters */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={12}>
            <Card title="Thống kê theo loại yêu cầu">
              <Column
                data={chartData}
                xField="type"
                yField="count"
                label={{
                  position: "middle",
                  style: {
                    fill: "#FFFFFF",
                    opacity: 0.6,
                  },
                }}
                xAxis={{
                  label: {
                    autoHide: true,
                    autoRotate: false,
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Bộ lọc">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Input
                  placeholder="Tìm kiếm theo mã, tiêu đề hoặc người yêu cầu"
                  prefix={<SearchOutlined />}
                  onChange={handleSearch}
                  value={searchText}
                  allowClear
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Lọc theo trạng thái"
                      onChange={(value) => setStatusFilter(value)}
                      value={statusFilter}
                    >
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="pending">Đang chờ</Option>
                      <Option value="processing">Đang xử lý</Option>
                      <Option value="completed">Đã giải quyết</Option>
                      <Option value="rejected">Từ chối</Option>
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Lọc theo loại yêu cầu"
                      onChange={(value) => setTypeFilter(value)}
                      value={typeFilter}
                    >
                      <Option value="all">Tất cả loại yêu cầu</Option>
                      <Option value="Kỹ thuật">Kỹ thuật</Option>
                      <Option value="Góp ý">Góp ý</Option>
                      <Option value="Đề xuất">Đề xuất</Option>
                      <Option value="Hỗ trợ">Hỗ trợ</Option>
                    </Select>
                  </Col>
                </Row>
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Main Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Drawer for Request Details and Response */}
        <Drawer
          title={`Chi tiết yêu cầu: ${currentRequest?.id}`}
          width={720}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div style={{ textAlign: "right" }}>
              <Button
                onClick={() => setDrawerVisible(false)}
                style={{ marginRight: 8 }}
              >
                Đóng
              </Button>
            </div>
          }
        >
          {currentRequest && (
            <>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin yêu cầu" key="1">
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Mã yêu cầu" span={2}>
                      {currentRequest.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiêu đề" span={2}>
                      {currentRequest.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người yêu cầu">
                      {currentRequest.requesterName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã người dùng">
                      {currentRequest.requesterCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {currentRequest.requesterEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại người dùng">
                      {currentRequest.requesterType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hạng thành viên">
                      {currentRequest.memberRank}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại yêu cầu">
                      {currentRequest.requestType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {getStatusTag(currentRequest.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {currentRequest.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nội dung yêu cầu" span={2}>
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {currentRequest.content}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>

                  <div style={{ marginTop: 20 }}>
                    <Title level={5}>Lịch sử phản hồi</Title>
                    {currentRequest.responses.length > 0 ? (
                      <Timeline>
                        {currentRequest.responses.map((response, index) => (
                          <Timeline.Item key={index} color="blue">
                            <p>
                              <strong>{response.responderName}</strong> (
                              {response.responderPosition}) -{" "}
                              {response.responseDate}
                            </p>
                            <div style={{ whiteSpace: "pre-wrap" }}>
                              {response.content}
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      <Empty description="Chưa có phản hồi nào" />
                    )}
                  </div>
                </TabPane>
                <TabPane tab="Phản hồi yêu cầu" key="2">
                  <Form
                    form={responseForm}
                    layout="vertical"
                    onFinish={handleSubmitResponse}
                    initialValues={{
                      status:
                        currentRequest.status !== "completed"
                          ? "processing"
                          : "completed",
                    }}
                  >
                    <Form.Item
                      name="status"
                      label="Cập nhật trạng thái"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn trạng thái!",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="processing">Đang xử lý</Option>
                        <Option value="completed">Đã giải quyết</Option>
                        <Option value="rejected">Từ chối</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="priority" label="Mức độ ưu tiên">
                      <Select defaultValue="medium">
                        <Option value="high">Cao</Option>
                        <Option value="medium">Trung bình</Option>
                        <Option value="low">Thấp</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="assignTo" label="Chuyển tiếp đến">
                      <Select placeholder="Chọn nhân viên (nếu cần)">
                        <Option value="1">
                          Nguyễn Văn X - Nhân viên kỹ thuật
                        </Option>
                        <Option value="2">Trần Thị Y - Quản lý thư viện</Option>
                        <Option value="3">Lê Văn Z - Thủ thư</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="responseContent"
                      label="Nội dung phản hồi"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung phản hồi!",
                        },
                      ]}
                    >
                      <ReactQuill
                        theme="snow"
                        style={{ height: 200 }}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                            ["clean"],
                          ],
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ marginTop: 20 }}
                      >
                        Gửi phản hồi
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Thông tin người dùng" key="3">
                  <Card
                    title="Thông tin chi tiết người dùng"
                    extra={<Button type="link">Xem đầy đủ</Button>}
                  >
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Họ tên">
                        {currentRequest.requesterName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Mã người dùng">
                        {currentRequest.requesterCode}
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại người dùng">
                        {currentRequest.requesterType}
                      </Descriptions.Item>
                      <Descriptions.Item label="Hạng thành viên">
                        {currentRequest.memberRank}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {currentRequest.requesterEmail}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số sách đang mượn">
                        3
                      </Descriptions.Item>
                      <Descriptions.Item label="Số vi phạm">
                        0
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card
                    title="Lịch sử mượn sách gần đây"
                    style={{ marginTop: 16 }}
                  >
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={[
                        {
                          id: 1,
                          title: "Cơ sở dữ liệu",
                          borrowDate: "2023-10-15",
                          returnDate: "2023-11-15",
                          status: "Đang mượn",
                        },
                        {
                          id: 2,
                          title: "Lập trình Java",
                          borrowDate: "2023-09-20",
                          returnDate: "2023-10-20",
                          status: "Đã trả",
                        },
                      ]}
                      columns={[
                        { title: "Tên sách", dataIndex: "title" },
                        { title: "Ngày mượn", dataIndex: "borrowDate" },
                        { title: "Ngày trả", dataIndex: "returnDate" },
                        {
                          title: "Trạng thái",
                          dataIndex: "status",
                          render: (text) =>
                            text === "Đang mượn" ? (
                              <Tag color="processing">Đang mượn</Tag>
                            ) : (
                              <Tag color="success">Đã trả</Tag>
                            ),
                        },
                      ]}
                    />
                  </Card>
                </TabPane>
              </Tabs>
            </>
          )}
        </Drawer>
      </Content>
    </Layout>
  );
};

export default SupportRequestManagement;
