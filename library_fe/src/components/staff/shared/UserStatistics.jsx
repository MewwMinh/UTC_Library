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
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ người dùng theo hạng
const usersByMembershipData = [
  { name: "Đồng", value: 3520 },
  { name: "Bạc", value: 1250 },
  { name: "Vàng", value: 380 },
];

// Dữ liệu mẫu cho biểu đồ người dùng mới theo thời gian
const newUsersTimelineData = [
  { name: "T1", value: 125 },
  { name: "T2", value: 78 },
  { name: "T3", value: 42 },
  { name: "T4", value: 65 },
  { name: "T5", value: 92 },
  { name: "T6", value: 38 },
  { name: "T7", value: 25 },
  { name: "T8", value: 320 },
  { name: "T9", value: 210 },
  { name: "T10", value: 45 },
  { name: "T11", value: 32 },
  { name: "T12", value: 28 },
];

// Dữ liệu mẫu cho biểu đồ người dùng theo thời gian trong ngày
const usersByTimeOfDayData = [
  { name: "8h", value: 25 },
  { name: "9h", value: 68 },
  { name: "10h", value: 92 },
  { name: "11h", value: 105 },
  { name: "12h", value: 65 },
  { name: "13h", value: 85 },
  { name: "14h", value: 120 },
  { name: "15h", value: 135 },
  { name: "16h", value: 110 },
  { name: "17h", value: 70 },
  { name: "18h", value: 45 },
  { name: "19h", value: 30 },
];

// Dữ liệu mẫu cho top người dùng tích cực
const topActiveUsersData = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    avatar: null,
    membershipType: "Vàng",
    borrowCount: 42,
    visitCount: 68,
    points: 1250,
  },
  {
    key: "2",
    name: "Trần Thị B",
    avatar: null,
    membershipType: "Vàng",
    borrowCount: 37,
    visitCount: 52,
    points: 1120,
  },
  {
    key: "3",
    name: "Lê Văn C",
    avatar: null,
    membershipType: "Bạc",
    borrowCount: 31,
    visitCount: 45,
    points: 880,
  },
  {
    key: "4",
    name: "Phạm Thị D",
    avatar: null,
    membershipType: "Bạc",
    borrowCount: 28,
    visitCount: 40,
    points: 790,
  },
  {
    key: "5",
    name: "Hoàng Văn E",
    avatar: null,
    membershipType: "Vàng",
    borrowCount: 25,
    visitCount: 38,
    points: 750,
  },
];

// Màu sắc cho biểu đồ
const COLORS = ["#CD7F32", "#C0C0C0", "#FFD700"];

// Định nghĩa màu cho các loại thành viên
const membershipColors = {
  Đồng: "#CD7F32",
  Bạc: "#C0C0C0",
  Vàng: "#FFD700",
};

const UserStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng top người dùng tích cực
  const topActiveUsersColumns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    {
      title: "Hạng thành viên",
      dataIndex: "membershipType",
      key: "membershipType",
      render: (type) => (
        <Tag
          color={membershipColors[type]}
          style={{ color: type === "Vàng" ? "black" : "white" }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Số lượt mượn sách",
      dataIndex: "borrowCount",
      key: "borrowCount",
      sorter: (a, b) => a.borrowCount - b.borrowCount,
    },
    {
      title: "Số lần sử dụng thư viện",
      dataIndex: "visitCount",
      key: "visitCount",
    },
    {
      title: "Điểm thành viên",
      dataIndex: "points",
      key: "points",
      render: (points) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>{points}</span>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về người dùng</Title>
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
              title="Tổng số người dùng"
              value={5150}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng mới trong kỳ"
              value={245}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng hạng Vàng"
              value={380}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#FFD700" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt sử dụng thư viện"
              value={3280}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ phân bố người dùng theo hạng và biểu đồ người dùng mới theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bố người dùng theo hạng thành viên">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersByMembershipData}
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
                  {usersByMembershipData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} người`, "Số lượng"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Người dùng mới theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={newUsersTimelineData}
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
                  formatter={(value) => [`${value} người`, "Người dùng mới"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Người dùng mới"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ phân bố người dùng theo thời gian trong ngày */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Phân bố người dùng theo thời gian trong ngày">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={usersByTimeOfDayData}
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
                  formatter={(value) => [`${value} người`, "Số người dùng"]}
                />
                <Legend />
                <Bar dataKey="value" name="Số người dùng" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Top 5 người dùng tích cực nhất */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: "#FFD700" }} />
                <span>Top người dùng tích cực nhất</span>
              </Space>
            }
          >
            <Table
              dataSource={topActiveUsersData}
              columns={topActiveUsersColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserStatistics;
