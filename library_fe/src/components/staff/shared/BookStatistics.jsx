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
  BookOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Dữ liệu mẫu cho biểu đồ sách mượn theo thể loại
const booksByCategoryData = [
  { name: "Giáo trình", value: 328 },
  { name: "Tài liệu tham khảo", value: 245 },
  { name: "Sách chuyên ngành", value: 187 },
  { name: "Tạp chí khoa học", value: 102 },
  { name: "Luận văn", value: 87 },
];

// Dữ liệu mẫu cho biểu đồ thống kê mượn trả theo thời gian
const borrowReturnTimelineData = [
  { name: "T1", borrow: 45, return: 32 },
  { name: "T2", borrow: 52, return: 48 },
  { name: "T3", borrow: 78, return: 62 },
  { name: "T4", borrow: 95, return: 81 },
  { name: "T5", borrow: 88, return: 72 },
  { name: "T6", borrow: 65, return: 59 },
  { name: "T7", borrow: 70, return: 67 },
  { name: "T8", borrow: 42, return: 35 },
  { name: "T9", borrow: 83, return: 78 },
  { name: "T10", borrow: 93, return: 87 },
  { name: "T11", borrow: 85, return: 79 },
  { name: "T12", borrow: 67, return: 62 },
];

// Dữ liệu mẫu cho top 10 sách mượn nhiều nhất
const topBorrowedBooksData = [
  {
    key: "1",
    title: "Giáo trình Toán cao cấp",
    author: "Nguyễn Văn A",
    category: "Giáo trình",
    borrowCount: 87,
    avgDuration: 18,
  },
  {
    key: "2",
    title: "Kỹ thuật lập trình C++",
    author: "Trần Văn B",
    category: "Sách chuyên ngành",
    borrowCount: 72,
    avgDuration: 25,
  },
  {
    key: "3",
    title: "Cơ sở dữ liệu",
    author: "Lê Thị C",
    category: "Giáo trình",
    borrowCount: 65,
    avgDuration: 21,
  },
  {
    key: "4",
    title: "Kinh tế vĩ mô",
    author: "Phạm Thị D",
    category: "Giáo trình",
    borrowCount: 58,
    avgDuration: 15,
  },
  {
    key: "5",
    title: "Lập trình web với ReactJS",
    author: "Hoàng Văn E",
    category: "Sách chuyên ngành",
    borrowCount: 52,
    avgDuration: 23,
  },
];

// Dữ liệu mẫu cho sách quá hạn
const overdueData = [
  {
    key: "1",
    title: "Xây dựng mạng truyền thông",
    borrower: "Nguyễn Minh Hiếu",
    borrowDate: "12/05/2025",
    dueDate: "12/06/2025",
    daysOverdue: 15,
  },
  {
    key: "2",
    title: "Kỹ thuật điện tử số",
    borrower: "Trần Thu Hà",
    borrowDate: "25/05/2025",
    dueDate: "25/06/2025",
    daysOverdue: 12,
  },
  {
    key: "3",
    title: "Phân tích dữ liệu với Python",
    borrower: "Lê Công Vinh",
    borrowDate: "01/06/2025",
    dueDate: "01/07/2025",
    daysOverdue: 8,
  },
];

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const BookStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng top sách được mượn nhiều
  const topBorrowedColumns = [
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Số lượt mượn",
      dataIndex: "borrowCount",
      key: "borrowCount",
      sorter: (a, b) => a.borrowCount - b.borrowCount,
    },
    {
      title: "Thời gian mượn TB (ngày)",
      dataIndex: "avgDuration",
      key: "avgDuration",
    },
  ];

  // Cột dữ liệu cho bảng sách quá hạn
  const overdueColumns = [
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người mượn",
      dataIndex: "borrower",
      key: "borrower",
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Số ngày quá hạn",
      dataIndex: "daysOverdue",
      key: "daysOverdue",
      render: (days) => <Tag color="red">{days} ngày</Tag>,
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê về sách và hoạt động mượn/trả</Title>
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
              title="Tổng số sách"
              value={12569}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sách đang được mượn"
              value={892}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số lượt mượn trong kỳ"
              value={1254}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sách quá hạn"
              value={37}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ sách mượn theo thể loại và biểu đồ thống kê mượn/trả theo thời gian */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Sách được mượn theo thể loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={booksByCategoryData}
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
                  {booksByCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} cuốn`, "Số lượng"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê mượn/trả theo thời gian">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={borrowReturnTimelineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="borrow"
                  stroke="#8884d8"
                  name="Mượn"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="return"
                  stroke="#82ca9d"
                  name="Trả"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Top 10 sách được mượn nhiều nhất */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Top sách được mượn nhiều nhất">
            <Table
              dataSource={topBorrowedBooksData}
              columns={topBorrowedColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Row 4: Danh sách sách quá hạn */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: "#cf1322" }} />
                <span>Sách đang quá hạn</span>
              </Space>
            }
          >
            <Table
              dataSource={overdueData}
              columns={overdueColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookStatistics;
