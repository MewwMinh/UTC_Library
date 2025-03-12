import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Table,
  Tag,
  List,
  Button,
  Input,
  Row,
  Col,
  Timeline,
  Badge,
  Avatar,
} from "antd";
import {
  BookOutlined,
  UsergroupAddOutlined,
  AlertOutlined,
  CalendarOutlined,
  ReloadOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const LibrarianDashboard = () => {
  // Giả lập dữ liệu thống kê
  const statisticsData = {
    booksBorrowed: 57,
    booksReturned: 42,
    pendingRequests: 8,
    overdueBorrowers: 15,
  };

  // Giả lập dữ liệu biểu đồ
  const chartData = [
    { name: "T2", borrowed: 12, returned: 10 },
    { name: "T3", borrowed: 15, returned: 8 },
    { name: "T4", borrowed: 10, returned: 12 },
    { name: "T5", borrowed: 8, returned: 9 },
    { name: "T6", borrowed: 12, returned: 3 },
    { name: "T7", borrowed: 0, returned: 0 },
    { name: "CN", borrowed: 0, returned: 0 },
  ];

  // Giả lập dữ liệu mượn sách
  const borrowRequests = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      studentId: "20UTC2001",
      book: "Lập trình Java",
      status: "pending",
    },
    {
      key: "2",
      name: "Trần Văn B",
      studentId: "20UTC2002",
      book: "Kỹ thuật lập trình",
      status: "pending",
    },
    {
      key: "3",
      name: "Lê Thị C",
      studentId: "20UTC2003",
      book: "Thiết kế web",
      status: "pending",
    },
  ];

  // Giả lập dữ liệu sách quá hạn
  const overdueBooks = [
    {
      key: "1",
      name: "Phạm Văn D",
      studentId: "20UTC1992",
      book: "Toán cao cấp",
      days: 5,
    },
    {
      key: "2",
      name: "Hoàng Thị E",
      studentId: "20UTC1998",
      book: "Triết học Mác-Lênin",
      days: 3,
    },
    {
      key: "3",
      name: "Vũ Văn F",
      studentId: "20UTC2000",
      book: "Vật lý đại cương",
      days: 7,
    },
  ];

  // Giả lập dữ liệu hoạt động gần đây
  const recentActivities = [
    {
      action: "Đã mượn sách",
      user: "Nguyễn Thị G",
      book: "Cơ sở dữ liệu",
      time: "10:30",
    },
    {
      action: "Đã trả sách",
      user: "Lê Văn H",
      book: "Kiến trúc máy tính",
      time: "10:15",
    },
    {
      action: "Gia hạn sách",
      user: "Trần Thu I",
      book: "Mạng máy tính",
      time: "09:45",
    },
    {
      action: "Đặt mượn sách",
      user: "Phạm Minh K",
      book: "An toàn thông tin",
      time: "09:30",
    },
  ];

  // Cột cho bảng yêu cầu mượn
  const borrowColumns = [
    {
      title: "Tên sinh viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Sách",
      dataIndex: "book",
      key: "book",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : "green"}>
          {status === "pending" ? "Đang chờ" : "Đã xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="primary" size="small" style={{ marginRight: 8 }}>
            Chấp nhận
          </Button>
          <Button danger size="small">
            Từ chối
          </Button>
        </span>
      ),
    },
  ];

  // Cột cho bảng sách quá hạn
  const overdueColumns = [
    {
      title: "Tên sinh viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Sách",
      dataIndex: "book",
      key: "book",
    },
    {
      title: "Số ngày quá hạn",
      dataIndex: "days",
      key: "days",
      render: (days) => <Tag color="red">{days} ngày</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="primary" size="small" style={{ marginRight: 8 }}>
            Gửi thông báo
          </Button>
          <Button size="small">Xem chi tiết</Button>
        </span>
      ),
    },
  ];

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        background: "#f0f2f5",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sách đã mượn (hôm nay)"
              value={statisticsData.booksBorrowed}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sách đã trả (hôm nay)"
              value={statisticsData.booksReturned}
              prefix={<ReloadOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Yêu cầu đang chờ"
              value={statisticsData.pendingRequests}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mượn quá hạn"
              value={statisticsData.overdueBorrowers}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Thống kê mượn/trả trong tuần">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="borrowed"
                  stroke="#8884d8"
                  name="Mượn"
                />
                <Line
                  type="monotone"
                  dataKey="returned"
                  stroke="#82ca9d"
                  name="Trả"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Hoạt động gần đây"
            extra={
              <Button type="link" icon={<ReloadOutlined />}>
                Làm mới
              </Button>
            }
          >
            <Timeline mode="left" style={{ marginTop: 20 }}>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    activity.action.includes("mượn")
                      ? "green"
                      : activity.action.includes("trả")
                      ? "blue"
                      : "orange"
                  }
                >
                  <p>
                    <strong>{activity.time}</strong> - {activity.user}
                  </p>
                  <p>
                    {activity.action}: <strong>{activity.book}</strong>
                  </p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="Yêu cầu mượn sách"
            extra={
              <Search
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            }
          >
            <Table
              columns={borrowColumns}
              dataSource={borrowRequests}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="Sách mượn quá hạn"
            extra={
              <Search
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            }
          >
            <Table
              columns={overdueColumns}
              dataSource={overdueBooks}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default LibrarianDashboard;
