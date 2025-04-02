import React from "react";
import { Card, Row, Col, Table, Typography, Statistic, Space, Tag } from "antd";
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
  WarningOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ vi phạm theo loại
const violationsByTypeData = [
  { name: "Trả sách trễ hạn", value: 87 },
  { name: "Làm hư sách", value: 32 },
  { name: "Làm mất sách", value: 15 },
  { name: "Gây ồn trong thư viện", value: 28 },
  { name: "Khác", value: 12 },
];

// Dữ liệu mẫu cho biểu đồ vi phạm theo thời gian
const violationsTimelineData = [
  { name: "T1", value: 12 },
  { name: "T2", value: 18 },
  { name: "T3", value: 22 },
  { name: "T4", value: 15 },
  { name: "T5", value: 10 },
  { name: "T6", value: 8 },
  { name: "T7", value: 5 },
  { name: "T8", value: 7 },
  { name: "T9", value: 20 },
  { name: "T10", value: 26 },
  { name: "T11", value: 30 },
  { name: "T12", value: 22 },
];

// Dữ liệu mẫu cho top vi phạm gần đây
const recentViolationsData = [
  {
    key: "1",
    user: "Nguyễn Văn A",
    type: "Trả sách trễ hạn",
    date: "18/07/2025",
    bookTitle: "Lập trình hướng đối tượng với Java",
    penalty: 75000,
    points: 10,
    status: "Đã xử lý",
  },
  {
    key: "2",
    user: "Trần Thị B",
    type: "Làm hư sách",
    date: "15/07/2025",
    bookTitle: "Giáo trình toán cao cấp",
    penalty: 150000,
    points: 20,
    status: "Đã xử lý",
  },
  {
    key: "3",
    user: "Lê Công C",
    type: "Trả sách trễ hạn",
    date: "12/07/2025",
    bookTitle: "Kỹ thuật lập trình",
    penalty: 45000,
    points: 5,
    status: "Đã xử lý",
  },
  {
    key: "4",
    user: "Hoàng Minh D",
    type: "Làm mất sách",
    date: "10/07/2025",
    bookTitle: "Kinh tế vĩ mô",
    penalty: 350000,
    points: 30,
    status: "Đang xử lý",
  },
  {
    key: "5",
    user: "Phạm Thu E",
    type: "Gây ồn trong thư viện",
    date: "08/07/2025",
    bookTitle: "N/A",
    penalty: 50000,
    points: 10,
    status: "Đã xử lý",
  },
];

// Dữ liệu mẫu cho thống kê chi phí phạt
const penaltyStatsByMonthData = [
  { name: "T1", value: 1250000 },
  { name: "T2", value: 1850000 },
  { name: "T3", value: 2200000 },
  { name: "T4", value: 1500000 },
  { name: "T5", value: 980000 },
  { name: "T6", value: 820000 },
  { name: "T7", value: 550000 },
  { name: "T8", value: 750000 },
  { name: "T9", value: 1800000 },
  { name: "T10", value: 2500000 },
  { name: "T11", value: 2850000 },
  { name: "T12", value: 2100000 },
];

// Màu sắc cho biểu đồ
const COLORS = ["#FF8042", "#FFBB28", "#FF0000", "#00C49F", "#0088FE"];

const ViolationStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng vi phạm gần đây
  const violationsColumns = [
    {
      title: "Người vi phạm",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Loại vi phạm",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "orange";
        if (type === "Làm hư sách") color = "volcano";
        else if (type === "Làm mất sách") color = "red";
        else if (type === "Gây ồn trong thư viện") color = "cyan";

        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Ngày vi phạm",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Sách liên quan",
      dataIndex: "bookTitle",
      key: "bookTitle",
    },
    {
      title: "Tiền phạt (VNĐ)",
      dataIndex: "penalty",
      key: "penalty",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Điểm trừ",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đã xử lý" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về vi phạm</Title>
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
              title="Tổng số vi phạm"
              value={174}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng tiền phạt thu được"
              value={19150000}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Vi phạm chưa xử lý"
              value={12}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Vi phạm trả sách trễ"
              value={87}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#FF8042" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ vi phạm theo loại và biểu đồ vi phạm theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bố vi phạm theo loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationsByTypeData}
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
                  {violationsByTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} lượt`, "Số lượt vi phạm"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê vi phạm theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={violationsTimelineData}
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
                  formatter={(value) => [`${value} lượt`, "Số lượt vi phạm"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#cf1322"
                  name="Số lượt vi phạm"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ thống kê chi phí phạt theo tháng */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Chi phí phạt thu được theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={penaltyStatsByMonthData}
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
                  formatter={(value) => [
                    `${value.toLocaleString()} VNĐ`,
                    "Tiền phạt",
                  ]}
                />
                <Legend />
                <Bar dataKey="value" name="Tiền phạt (VNĐ)" fill="#3f8600" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Bảng vi phạm gần đây */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: "#cf1322" }} />
                <span>Vi phạm gần đây</span>
              </Space>
            }
          >
            <Table
              dataSource={recentViolationsData}
              columns={violationsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViolationStatistics;
