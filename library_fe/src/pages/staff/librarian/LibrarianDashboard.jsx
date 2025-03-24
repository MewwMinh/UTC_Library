import React, { useState, useEffect } from "react";
import {
  OverviewStats,
  UserRecentActivity,
  WeeklyBorrowReturnStats,
} from "/src/components/staff/librarian/dashboard";
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

  // Giả lập dữ liệu biểu đồ
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

  // Giả lập dữ liệu mượn sách

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
      <OverviewStats />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <WeeklyBorrowReturnStats />
        <UserRecentActivity />
      </Row>

      {/* <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
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
      </Row> */}
    </Content>
  );
};

export default LibrarianDashboard;
