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
  Avatar,
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
  CalendarOutlined,
  TeamOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ sự kiện theo loại
const eventsByTypeData = [
  { name: "Hội thảo chuyên đề", value: 18 },
  { name: "Buổi đọc sách", value: 12 },
  { name: "Workshop", value: 8 },
  { name: "Giao lưu tác giả", value: 5 },
  { name: "Triển lãm sách", value: 3 },
];

// Dữ liệu mẫu cho biểu đồ tham gia sự kiện theo thời gian
const eventParticipationData = [
  { name: "T1", value: 120 },
  { name: "T2", value: 150 },
  { name: "T3", value: 180 },
  { name: "T4", value: 210 },
  { name: "T5", value: 190 },
  { name: "T6", value: 170 },
  { name: "T7", value: 110 },
  { name: "T8", value: 90 },
  { name: "T9", value: 220 },
  { name: "T10", value: 250 },
  { name: "T11", value: 280 },
  { name: "T12", value: 240 },
];

// Dữ liệu mẫu cho top sự kiện có nhiều người tham gia nhất
const topEventsData = [
  {
    key: "1",
    title: "Giao lưu với tác giả Nguyễn Nhật Ánh",
    date: "15/06/2025",
    type: "Giao lưu tác giả",
    participantCount: 175,
    capacity: 200,
    rating: 4.8,
  },
  {
    key: "2",
    title: "Workshop: Phương pháp học tập hiệu quả",
    date: "22/05/2025",
    type: "Workshop",
    participantCount: 152,
    capacity: 150,
    rating: 4.5,
  },
  {
    key: "3",
    title: "Hội thảo: Trí tuệ nhân tạo và tương lai",
    date: "10/07/2025",
    type: "Hội thảo chuyên đề",
    participantCount: 132,
    capacity: 150,
    rating: 4.7,
  },
  {
    key: "4",
    title: "Triển lãm sách quý hiếm",
    date: "05/07/2025",
    type: "Triển lãm sách",
    participantCount: 120,
    capacity: 300,
    rating: 4.6,
  },
  {
    key: "5",
    title: "Buổi đọc sách: Sống chậm lại",
    date: "18/06/2025",
    type: "Buổi đọc sách",
    participantCount: 85,
    capacity: 100,
    rating: 4.4,
  },
];

// Dữ liệu mẫu cho các sự kiện sắp tới
const upcomingEventsData = [
  {
    key: "1",
    title: "Hội thảo: Số hóa và thư viện tương lai",
    date: "25/07/2025",
    type: "Hội thảo chuyên đề",
    registeredCount: 85,
    capacity: 150,
    status: "Sắp diễn ra",
  },
  {
    key: "2",
    title: "Workshop: Kỹ năng viết luận văn",
    date: "30/07/2025",
    type: "Workshop",
    registeredCount: 78,
    capacity: 100,
    status: "Sắp diễn ra",
  },
  {
    key: "3",
    title: "Giao lưu với nhà văn Anh Khang",
    date: "05/08/2025",
    type: "Giao lưu tác giả",
    registeredCount: 120,
    capacity: 200,
    status: "Sắp diễn ra",
  },
];

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Event tag colors
const eventTypeColors = {
  "Hội thảo chuyên đề": "blue",
  "Buổi đọc sách": "green",
  Workshop: "purple",
  "Giao lưu tác giả": "orange",
  "Triển lãm sách": "cyan",
};

const EventStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng top sự kiện
  const topEventsColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày tổ chức",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Loại sự kiện",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={eventTypeColors[type]}>{type}</Tag>,
    },
    {
      title: "Người tham gia",
      dataIndex: "participantCount",
      key: "participantCount",
      render: (count, record) => (
        <Space>
          <span>
            {count}/{record.capacity}
          </span>
          <Progress
            percent={Math.round((count / record.capacity) * 100)}
            size="small"
            status={count > record.capacity ? "exception" : "normal"}
          />
        </Space>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Space>
          <StarOutlined style={{ color: "#FFBB28" }} />
          <span>{rating}/5</span>
        </Space>
      ),
    },
  ];

  // Cột dữ liệu cho bảng sự kiện sắp tới
  const upcomingEventsColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày tổ chức",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Loại sự kiện",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={eventTypeColors[type]}>{type}</Tag>,
    },
    {
      title: "Đăng ký",
      dataIndex: "registeredCount",
      key: "registeredCount",
      render: (count, record) => (
        <Space>
          <span>
            {count}/{record.capacity}
          </span>
          <Progress
            percent={Math.round((count / record.capacity) * 100)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về sự kiện</Title>
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
              title="Tổng số sự kiện"
              value={46}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số người tham gia"
              value={2108}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ tham gia TB"
              value={85}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đánh giá TB"
              value={4.6}
              suffix="/5"
              prefix={<StarOutlined />}
              valueStyle={{ color: "#FFBB28" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ sự kiện theo loại và biểu đồ tham gia sự kiện theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bố sự kiện theo loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventsByTypeData}
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
                  {eventsByTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} sự kiện`, "Số lượng"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê tham gia sự kiện theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={eventParticipationData}
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
                  formatter={(value) => [`${value} người`, "Số người tham gia"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Số người tham gia"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Bảng top sự kiện có nhiều người tham gia nhất */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: "#FFBB28" }} />
                <span>Top sự kiện có nhiều người tham gia</span>
              </Space>
            }
          >
            <Table
              dataSource={topEventsData}
              columns={topEventsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Row 4: Bảng sự kiện sắp tới */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <span>Sự kiện sắp tới</span>
              </Space>
            }
          >
            <Table
              dataSource={upcomingEventsData}
              columns={upcomingEventsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventStatistics;
