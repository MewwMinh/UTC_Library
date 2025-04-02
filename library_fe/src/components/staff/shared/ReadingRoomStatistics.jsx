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
  ReadOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ sử dụng phòng đọc theo khu vực
const usageByAreaData = [
  { name: "Khu vực học cá nhân", value: 542 },
  { name: "Khu vực học nhóm", value: 328 },
  { name: "Khu vực máy tính", value: 187 },
  { name: "Phòng đọc yên tĩnh", value: 245 },
];

// Dữ liệu mẫu cho biểu đồ lượng người sử dụng phòng đọc theo thời gian
const usageTimelineData = [
  { name: "T1", value: 320 },
  { name: "T2", value: 405 },
  { name: "T3", value: 512 },
  { name: "T4", value: 480 },
  { name: "T5", value: 390 },
  { name: "T6", value: 350 },
  { name: "T7", value: 300 },
  { name: "T8", value: 280 },
  { name: "T9", value: 510 },
  { name: "T10", value: 580 },
  { name: "T11", value: 520 },
  { name: "T12", value: 420 },
];

// Dữ liệu mẫu cho biểu đồ phân bố thời gian sử dụng
const usageDurationData = [
  { name: "< 1h", value: 210 },
  { name: "1-2h", value: 350 },
  { name: "2-3h", value: 420 },
  { name: "3-4h", value: 380 },
  { name: "4-5h", value: 220 },
  { name: "> 5h", value: 120 },
];

// Dữ liệu mẫu cho thống kê đặt chỗ
const seatReservationData = [
  {
    key: "1",
    area: "Khu vực học cá nhân",
    totalSeats: 120,
    reservedToday: 95,
    occupancyRate: 79,
    avgDuration: 2.5,
  },
  {
    key: "2",
    area: "Khu vực học nhóm",
    totalSeats: 60,
    reservedToday: 42,
    occupancyRate: 70,
    avgDuration: 3.2,
  },
  {
    key: "3",
    area: "Khu vực máy tính",
    totalSeats: 40,
    reservedToday: 35,
    occupancyRate: 88,
    avgDuration: 1.8,
  },
  {
    key: "4",
    area: "Phòng đọc yên tĩnh",
    totalSeats: 80,
    reservedToday: 72,
    occupancyRate: 90,
    avgDuration: 3.5,
  },
];

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReadingRoomStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng thống kê đặt chỗ
  const seatReservationColumns = [
    {
      title: "Khu vực",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Tổng số chỗ",
      dataIndex: "totalSeats",
      key: "totalSeats",
    },
    {
      title: "Số lượng đặt hôm nay",
      dataIndex: "reservedToday",
      key: "reservedToday",
    },
    {
      title: "Tỷ lệ sử dụng",
      dataIndex: "occupancyRate",
      key: "occupancyRate",
      render: (rate) => <Progress percent={rate} size="small" />,
    },
    {
      title: "Thời gian sử dụng TB (giờ)",
      dataIndex: "avgDuration",
      key: "avgDuration",
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về phòng đọc</Title>
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
              title="Tổng lượt sử dụng"
              value={5128}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt sử dụng hôm nay"
              value={245}
              prefix={<ReadOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Thời gian sử dụng TB"
              value={2.8}
              suffix="giờ"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt đặt chỗ"
              value={320}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: "#FA541C" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ sử dụng phòng đọc theo khu vực và biểu đồ lượng người sử dụng theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bố sử dụng theo khu vực">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageByAreaData}
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
                  {usageByAreaData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} lượt`, "Số lượt sử dụng"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Lượng người sử dụng theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={usageTimelineData}
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
                  formatter={(value) => [`${value} lượt`, "Số lượt sử dụng"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Số lượt sử dụng"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ phân bố thời gian sử dụng */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Phân bố thời gian sử dụng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={usageDurationData}
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
                  formatter={(value) => [`${value} người`, "Số người"]}
                />
                <Legend />
                <Bar dataKey="value" name="Số người" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Bảng thống kê đặt chỗ theo khu vực */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Thống kê đặt chỗ theo khu vực">
            <Table
              dataSource={seatReservationData}
              columns={seatReservationColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReadingRoomStatistics;
