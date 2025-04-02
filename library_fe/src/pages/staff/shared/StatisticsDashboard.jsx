import React, { useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  Button,
  Space,
  Tabs,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  WarningOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  LineChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
// import BookStatistics from "./components/BookStatistics";
// import UserStatistics from "./components/UserStatistics";
// import ReadingRoomStatistics from "./components/ReadingRoomStatistics";
// import ViolationStatistics from "./components/ViolationStatistics";
// import EventStatistics from "./components/EventStatistics";
// import SupportRequestStatistics from "./components/SupportRequestStatistics";
// import OverallPerformanceStatistics from "./components/OverallPerformanceStatistics";

import {
  ViolationStatistics,
  UserStatistics,
  SupportRequestStatistics,
  ReadingRoomStatistics,
  EventStatistics,
  BookStatistics,
  OverallPerformanceStatistics,
} from "/src/components/staff/shared";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const StatisticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("books");
  const [dateRange, setDateRange] = useState(null);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleExport = (type) => {
    // API sẽ được triển khai sau
    console.log(`Exporting as ${type}...`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "books":
        return <BookStatistics timeRange={timeRange} dateRange={dateRange} />;
      case "users":
        return <UserStatistics timeRange={timeRange} dateRange={dateRange} />;
      case "readingRoom":
        return (
          <ReadingRoomStatistics timeRange={timeRange} dateRange={dateRange} />
        );
      case "violations":
        return (
          <ViolationStatistics timeRange={timeRange} dateRange={dateRange} />
        );
      case "events":
        return <EventStatistics timeRange={timeRange} dateRange={dateRange} />;
      case "supportRequests":
        return (
          <SupportRequestStatistics
            timeRange={timeRange}
            dateRange={dateRange}
          />
        );
      case "overall":
        return (
          <OverallPerformanceStatistics
            timeRange={timeRange}
            dateRange={dateRange}
          />
        );
      default:
        return <BookStatistics timeRange={timeRange} dateRange={dateRange} />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="bg-white px-6 flex items-center justify-between">
        <div className="text-xl font-bold">Thư Viện UTC</div>
      </Header>
      <Layout>
        <Sider width={250} className="bg-white" theme="light">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ height: "100%", borderRight: 0 }}
            onSelect={({ key }) => setActiveTab(key)}
          >
            <div className="p-4">
              <Title level={4}>Báo Cáo Thống Kê</Title>
            </div>
            <Menu.Item key="books" icon={<BookOutlined />}>
              Sách & Mượn/Trả
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              Người Dùng
            </Menu.Item>
            <Menu.Item key="readingRoom" icon={<ReadOutlined />}>
              Phòng Đọc
            </Menu.Item>
            <Menu.Item key="violations" icon={<WarningOutlined />}>
              Vi Phạm
            </Menu.Item>
            <Menu.Item key="events" icon={<CalendarOutlined />}>
              Sự Kiện
            </Menu.Item>
            <Menu.Item key="supportRequests" icon={<QuestionCircleOutlined />}>
              Yêu Cầu Hỗ Trợ
            </Menu.Item>
            <Menu.Item key="overall" icon={<LineChartOutlined />}>
              Hiệu Quả Tổng Thể
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Trang Chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Thống Kê</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="bg-white p-6"
            style={{
              margin: 0,
              minHeight: 280,
            }}
          >
            <Row className="mb-6" justify="space-between" align="middle">
              <Col>
                <Title level={3}>Báo Cáo Thống Kê</Title>
              </Col>
              <Col>
                <Space>
                  <Select
                    defaultValue="month"
                    style={{ width: 120 }}
                    onChange={handleTimeRangeChange}
                    options={[
                      { value: "day", label: "Ngày" },
                      { value: "week", label: "Tuần" },
                      { value: "month", label: "Tháng" },
                      { value: "quarter", label: "Quý" },
                      { value: "year", label: "Năm" },
                      { value: "custom", label: "Tùy chỉnh" },
                    ]}
                  />
                  {timeRange === "custom" && (
                    <RangePicker onChange={handleDateRangeChange} />
                  )}
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleExport("excel")}
                  >
                    Excel
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleExport("pdf")}
                  >
                    PDF
                  </Button>
                </Space>
              </Col>
            </Row>

            {renderTabContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StatisticsDashboard;
