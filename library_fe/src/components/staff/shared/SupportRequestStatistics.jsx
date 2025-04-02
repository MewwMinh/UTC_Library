import React from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  Statistic,
  Space,
  Tag,
  Progress,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ yêu cầu hỗ trợ theo loại
const requestsByTypeData = [
  { name: "Mượn/trả sách", value: 78 },
  { name: "Gia hạn sách", value: 42 },
  { name: "Đặt chỗ phòng đọc", value: 35 },
  { name: "Tài khoản & đăng nhập", value: 28 },
  { name: "Tìm tài liệu", value: 20 },
  { name: "Khác", value: 15 },
];

// Dữ liệu mẫu cho biểu đồ yêu cầu hỗ trợ theo thời gian
const requestsTimelineData = [
  { name: "T1", value: 35 },
  { name: "T2", value: 28 },
  { name: "T3", value: 22 },
  { name: "T4", value: 30 },
  { name: "T5", value: 38 },
  { name: "T6", value: 25 },
  { name: "T7", value: 15 },
  { name: "T8", value: 18 },
  { name: "T9", value: 42 },
  { name: "T10", value: 48 },
  { name: "T11", value: 52 },
  { name: "T12", value: 45 },
];

// Dữ liệu mẫu cho biểu đồ thời gian xử lý trung bình theo loại
const avgProcessingTimeData = [
  { name: "Mượn/trả sách", hours: 3.5 },
  { name: "Gia hạn sách", hours: 2.8 },
  { name: "Đặt chỗ phòng đọc", hours: 4.2 },
  { name: "Tài khoản & đăng nhập", hours: 5.1 },
  { name: "Tìm tài liệu", hours: 8.7 },
  { name: "Khác", hours: 10.2 },
];

// Dữ liệu mẫu cho bảng yêu cầu hỗ trợ gần đây
const recentRequestsData = [
  {
    key: "1",
    ticketId: "TKUT2507001",
    title: "Không thể đặt mượn sách trên hệ thống",
    type: "Mượn/trả sách",
    user: "Nguyễn Minh Khoa",
    submitDate: "20/07/2025 14:35",
    status: "Đã hoàn thành",
    processingTime: 2.5,
  },
  {
    key: "2",
    ticketId: "TKUT2507002",
    title: "Yêu cầu gia hạn sách do đang ốm",
    type: "Gia hạn sách",
    user: "Trần Mai Anh",
    submitDate: "20/07/2025 15:10",
    status: "Đã hoàn thành",
    processingTime: 1.8,
  },
  {
    key: "3",
    ticketId: "TKUT2507003",
    title: "Không thể đăng nhập vào tài khoản",
    type: "Tài khoản & đăng nhập",
    user: "Lê Quang Đạt",
    submitDate: "20/07/2025 16:28",
    status: "Đang xử lý",
    processingTime: null,
  },
  {
    key: "4",
    ticketId: "TKUT2507004",
    title: "Cần hỗ trợ tìm tài liệu về kinh tế vĩ mô",
    type: "Tìm tài liệu",
    user: "Phạm Thị Hoa",
    submitDate: "20/07/2025 17:05",
    status: "Đang xử lý",
    processingTime: null,
  },
  {
    key: "5",
    ticketId: "TKUT2507005",
    title: "Đặt chỗ nhóm cho 6 người",
    type: "Đặt chỗ phòng đọc",
    user: "Hoàng Văn Lâm",
    submitDate: "21/07/2025 08:15",
    status: "Đang chờ xử lý",
    processingTime: null,
  },
];

// Màu sắc cho biểu đồ
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

// Request type tag colors
const requestTypeColors = {
  "Mượn/trả sách": "blue",
  "Gia hạn sách": "cyan",
  "Đặt chỗ phòng đọc": "green",
  "Tài khoản & đăng nhập": "purple",
  "Tìm tài liệu": "orange",
  Khác: "default",
};

// Status tag colors
const statusColors = {
  "Đã hoàn thành": "green",
  "Đang xử lý": "processing",
  "Đang chờ xử lý": "warning",
  "Đã từ chối": "red",
};

const SupportRequestStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng yêu cầu hỗ trợ gần đây
  const requestsColumns = [
    {
      title: "Mã phiếu",
      dataIndex: "ticketId",
      key: "ticketId",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={requestTypeColors[type]}>{type}</Tag>,
    },
    {
      title: "Người yêu cầu",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Thời gian gửi",
      dataIndex: "submitDate",
      key: "submitDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let icon = null;
        if (status === "Đã hoàn thành") icon = <CheckCircleOutlined />;
        else if (status === "Đang xử lý") icon = <SyncOutlined spin />;
        else if (status === "Đang chờ xử lý") icon = <ClockCircleOutlined />;

        return (
          <Tag color={statusColors[status]} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Thời gian xử lý (giờ)",
      dataIndex: "processingTime",
      key: "processingTime",
      render: (time) => (time ? time : "-"),
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về yêu cầu hỗ trợ</Title>
      <Text type="secondary">
        Dữ liệu thống kê{" "}
        {timeRange === "day"
          ? "hôm nay"
          : timeRange === "week"
          ? "tuần này"
          : timeRange === "month"
          ? "tháng này"
          : timeRange === "quarter"
          ? "quý này"
          : "năm nay"}
      </Text>

      {/* Row 1: Card thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số yêu cầu"
              value={218}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={182}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={25}
              prefix={<SyncOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Thời gian xử lý TB"
              value={5.2}
              suffix="giờ"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ yêu cầu hỗ trợ theo loại và biểu đồ yêu cầu hỗ trợ theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bố yêu cầu hỗ trợ theo loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestsByTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} yêu cầu`, "Số lượng"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê yêu cầu hỗ trợ theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={requestsTimelineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} yêu cầu`, "Số lượng"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890ff"
                  name="Số yêu cầu"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ thời gian xử lý trung bình theo loại */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Thời gian xử lý trung bình theo loại yêu cầu">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={avgProcessingTimeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} giờ`, "Thời gian xử lý"]}
                />
                <Legend />
                <Bar
                  dataKey="hours"
                  name="Thời gian xử lý (giờ)"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Bảng yêu cầu hỗ trợ gần đây */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                <span>Yêu cầu hỗ trợ gần đây</span>
              </Space>
            }
          >
            <Table
              dataSource={recentRequestsData}
              columns={requestsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Row 5: Thống kê tỷ lệ giải quyết */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Tỷ lệ giải quyết yêu cầu hỗ trợ">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Progress
                  type="circle"
                  percent={Math.round((182 / 218) * 100)}
                  format={(percent) => `${percent}%`}
                  width={200}
                />
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>Đã hoàn thành:</Text>
                      <Progress
                        percent={Math.round((182 / 218) * 100)}
                        status="success"
                        strokeColor="#3f8600"
                        format={(percent) => `${182} yêu cầu (${percent}%)`}
                      />
                    </div>
                    <div>
                      <Text strong>Đang xử lý:</Text>
                      <Progress
                        percent={Math.round((25 / 218) * 100)}
                        status="active"
                        strokeColor="#faad14"
                        format={(percent) => `${25} yêu cầu (${percent}%)`}
                      />
                    </div>
                    <div>
                      <Text strong>Đang chờ xử lý:</Text>
                      <Progress
                        percent={Math.round((11 / 218) * 100)}
                        status="normal"
                        strokeColor="#1890ff"
                        format={(percent) => `${11} yêu cầu (${percent}%)`}
                      />
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupportRequestStatistics;
