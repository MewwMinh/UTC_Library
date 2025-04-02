import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Statistic,
  Space,
  Button,
  DatePicker,
  Select,
  Input,
  Badge,
  Avatar,
} from "antd";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EyeOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Dữ liệu mẫu cho thống kê vi phạm theo loại
const violationTypeData = [
  { name: "Trả sách muộn", value: 45, color: "#FF6B6B" },
  { name: "Làm hỏng sách", value: 25, color: "#4ECDC4" },
  { name: "Mất sách", value: 10, color: "#FFD166" },
  { name: "Làm mất thẻ thư viện", value: 8, color: "#F77F00" },
  { name: "Vi phạm nội quy", value: 12, color: "#9A348E" },
];

// Dữ liệu mẫu cho thống kê vi phạm theo tháng
const violationMonthlyData = [
  { name: "T1", count: 12 },
  { name: "T2", count: 15 },
  { name: "T3", count: 8 },
  { name: "T4", count: 10 },
  { name: "T5", count: 7 },
  { name: "T6", count: 14 },
  { name: "T7", count: 18 },
  { name: "T8", count: 9 },
  { name: "T9", count: 11 },
  { name: "T10", count: 13 },
  { name: "T11", count: 16 },
  { name: "T12", count: 20 },
];

// Dữ liệu mẫu danh sách vi phạm
const violationsData = [
  {
    id: "VP001",
    userId: "SV001",
    userName: "Nguyễn Văn A",
    userImage: null,
    violationType: "Trả sách muộn",
    bookTitle: "Lập trình Java cơ bản",
    description: "Trả sách muộn 15 ngày",
    penaltyAmount: 75000,
    pointsDeducted: 5,
    status: "pending",
    recordedBy: "Trần Thị B",
    recordedAt: "2025-03-15T10:30:00",
    violationDate: "2025-03-01T10:30:00",
  },
  {
    id: "VP002",
    userId: "SV002",
    userName: "Lê Thị C",
    userImage: null,
    violationType: "Làm hỏng sách",
    bookTitle: "Kỹ thuật lập trình C++",
    description: "Sách bị rách trang 45-50, bị ố nước",
    penaltyAmount: 120000,
    pointsDeducted: 10,
    status: "resolved",
    recordedBy: "Trần Thị B",
    recordedAt: "2025-03-10T14:20:00",
    resolvedAt: "2025-03-10T15:30:00",
    violationDate: "2025-03-10T14:20:00",
  },
  {
    id: "VP003",
    userId: "SV003",
    userName: "Phạm Văn D",
    userImage: null,
    violationType: "Mất sách",
    bookTitle: "Cơ sở dữ liệu",
    description: "Không trả sách sau 30 ngày quá hạn",
    penaltyAmount: 250000,
    pointsDeducted: 20,
    status: "resolved",
    recordedBy: "Nguyễn Văn E",
    recordedAt: "2025-02-28T09:15:00",
    resolvedAt: "2025-03-05T11:30:00",
    violationDate: "2025-02-28T09:15:00",
  },
  {
    id: "VP004",
    userId: "SV004",
    userName: "Hoàng Thị F",
    userImage: null,
    violationType: "Vi phạm nội quy",
    bookTitle: null,
    description: "Nói chuyện lớn tiếng trong phòng đọc",
    penaltyAmount: 50000,
    pointsDeducted: 5,
    status: "pending",
    recordedBy: "Nguyễn Văn E",
    recordedAt: "2025-03-18T16:45:00",
    violationDate: "2025-03-18T16:45:00",
  },
  {
    id: "VP005",
    userId: "SV005",
    userName: "Đỗ Văn G",
    userImage: null,
    violationType: "Làm mất thẻ thư viện",
    bookTitle: null,
    description: "Báo mất thẻ thư viện",
    penaltyAmount: 35000,
    pointsDeducted: 3,
    status: "resolved",
    recordedBy: "Trần Thị B",
    recordedAt: "2025-03-08T10:20:00",
    resolvedAt: "2025-03-08T11:00:00",
    violationDate: "2025-03-08T10:20:00",
  },
  {
    id: "VP006",
    userId: "SV006",
    userName: "Vũ Thị H",
    userImage: null,
    violationType: "Trả sách muộn",
    bookTitle: "Kỹ thuật lập trình Python",
    description: "Trả sách muộn 7 ngày",
    penaltyAmount: 35000,
    pointsDeducted: 3,
    status: "pending",
    recordedBy: "Nguyễn Văn E",
    recordedAt: "2025-03-20T13:30:00",
    violationDate: "2025-03-20T13:30:00",
  },
];

const ViolationStatistics = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={8}>
        <Card
          title={<Title level={5}>Thống kê vi phạm theo loại</Title>}
          extra={
            <Select defaultValue="year" style={{ width: 120 }}>
              <Option value="month">Tháng này</Option>
              <Option value="quarter">Quý này</Option>
              <Option value="year">Năm này</Option>
            </Select>
          }
          style={{ height: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {violationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} vi phạm`, "Số lượng"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={16}>
        <Card
          title={<Title level={5}>Thống kê vi phạm theo tháng</Title>}
          extra={
            <Select defaultValue="2025" style={{ width: 100 }}>
              <Option value="2025">2025</Option>
              <Option value="2024">2024</Option>
              <Option value="2023">2023</Option>
            </Select>
          }
          style={{ height: "100%" }}
        >
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={violationMonthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} vi phạm`, "Số lượng"]}
                />
                <Legend />
                <Bar dataKey="count" name="Số vi phạm" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Tổng số vi phạm"
            value={100}
            valueStyle={{ color: "#cf1322" }}
            prefix={<WarningOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Vi phạm chưa xử lý"
            value={35}
            valueStyle={{ color: "#faad14" }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Tổng tiền phạt (VNĐ)"
            value={7850000}
            valueStyle={{ color: "#52c41a" }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

const ViolationList = () => {
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/staff/violations/${id}`);
  };

  const getStatusTag = (status) => {
    if (status === "pending") {
      return <Tag color="warning">Chưa xử lý</Tag>;
    } else if (status === "resolved") {
      return <Tag color="success">Đã xử lý</Tag>;
    }
    return <Tag color="default">Không xác định</Tag>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      title: "Mã vi phạm",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Người vi phạm",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.userImage} />
          <span>{text}</span>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            ({record.userId})
          </Text>
        </Space>
      ),
    },
    {
      title: "Loại vi phạm",
      dataIndex: "violationType",
      key: "violationType",
      filters: [
        { text: "Trả sách muộn", value: "Trả sách muộn" },
        { text: "Làm hỏng sách", value: "Làm hỏng sách" },
        { text: "Mất sách", value: "Mất sách" },
        { text: "Vi phạm nội quy", value: "Vi phạm nội quy" },
        { text: "Làm mất thẻ thư viện", value: "Làm mất thẻ thư viện" },
      ],
      onFilter: (value, record) => record.violationType.indexOf(value) === 0,
    },
    {
      title: "Sách",
      dataIndex: "bookTitle",
      key: "bookTitle",
      render: (text) => text || <Text type="secondary">Không liên quan</Text>,
    },
    {
      title: "Thời gian vi phạm",
      dataIndex: "violationDate",
      key: "violationDate",
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.violationDate) - new Date(b.violationDate),
    },
    {
      title: "Tiền phạt",
      dataIndex: "penaltyAmount",
      key: "penaltyAmount",
      render: (text) => formatCurrency(text),
      sorter: (a, b) => a.penaltyAmount - b.penaltyAmount,
    },
    {
      title: "Điểm trừ",
      dataIndex: "pointsDeducted",
      key: "pointsDeducted",
      render: (points) => (
        <Badge count={points} showZero style={{ backgroundColor: "#ff4d4f" }} />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Chưa xử lý", value: "pending" },
        { text: "Đã xử lý", value: "resolved" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => goToDetail(record.id)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Loại vi phạm"
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="late">Trả sách muộn</Option>
              <Option value="damage">Làm hỏng sách</Option>
              <Option value="lost">Mất sách</Option>
              <Option value="rule">Vi phạm nội quy</Option>
              <Option value="card">Làm mất thẻ thư viện</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>
          <Col xs={24} md={4}>
            <Space>
              <Button
                icon={<FileExcelOutlined />}
                style={{ background: "#52c41a", color: "white" }}
              >
                Excel
              </Button>
              <Button icon={<FilePdfOutlined />} danger>
                PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={violationsData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} vi phạm`,
        }}
      />
    </div>
  );
};

const ViolationsListPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Quản lý vi phạm</Title>
      <div style={{ marginBottom: 24 }}>
        <ViolationStatistics />
      </div>
      <Card title={<Title level={4}>Danh sách vi phạm</Title>}>
        <ViolationList />
      </Card>
    </div>
  );
};

export default ViolationsListPage;
