import React from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  Statistic,
  Space,
  Tabs,
  Progress,
  Divider,
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
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  RiseOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Dữ liệu mẫu cho biểu đồ KPI
const kpiData = [
  {
    name: "Số lượt mượn sách",
    current: 1254,
    previous: 1125,
    target: 1200,
    unit: "lượt",
  },
  {
    name: "Người dùng hoạt động",
    current: 2850,
    previous: 2520,
    target: 3000,
    unit: "người",
  },
  {
    name: "Tỷ lệ mượn sách/người dùng",
    current: 2.8,
    previous: 2.5,
    target: 3.0,
    unit: "lượt/người",
  },
  {
    name: "Tỷ lệ giải quyết yêu cầu",
    current: 95.2,
    previous: 88.5,
    target: 95.0,
    unit: "%",
  },
  {
    name: "Thời gian xử lý trung bình",
    current: 5.2,
    previous: 6.8,
    target: 5.0,
    unit: "giờ",
    lowerIsBetter: true,
  },
];

// Dữ liệu mẫu cho biểu đồ so sánh theo tháng
const monthlyComparisonData = [
  { name: "T1", thisYear: 1150, lastYear: 980 },
  { name: "T2", thisYear: 1320, lastYear: 1100 },
  { name: "T3", thisYear: 1450, lastYear: 1230 },
  { name: "T4", thisYear: 1280, lastYear: 1180 },
  { name: "T5", thisYear: 1150, lastYear: 1050 },
  { name: "T6", thisYear: 1080, lastYear: 950 },
  { name: "T7", thisYear: 950, lastYear: 850 },
  { name: "T8", thisYear: 1220, lastYear: 920 },
  { name: "T9", thisYear: 1450, lastYear: 1250 },
  { name: "T10", thisYear: 1520, lastYear: 1320 },
  { name: "T11", thisYear: 1620, lastYear: 1420 },
  { name: "T12", thisYear: 1380, lastYear: 1280 },
];

// Dữ liệu mẫu cho biểu đồ tăng trưởng
const growthData = [
  { name: "Số lượng sách", value: 8.5 },
  { name: "Số người dùng", value: 12.3 },
  { name: "Lượt mượn sách", value: 15.8 },
  { name: "Lượt sử dụng thư viện", value: 18.2 },
  { name: "Sự kiện tổ chức", value: 25.0 },
];

// Dữ liệu mẫu cho biểu đồ radar hoạt động theo khu vực
const areaPerformanceData = [
  { subject: "Khu vực học cá nhân", A: 120, B: 110, fullMark: 150 },
  { subject: "Khu vực học nhóm", A: 98, B: 85, fullMark: 150 },
  { subject: "Khu vực máy tính", A: 86, B: 75, fullMark: 150 },
  { subject: "Phòng đọc yên tĩnh", A: 110, B: 98, fullMark: 150 },
  { subject: "Khu vực sách tham khảo", A: 85, B: 90, fullMark: 150 },
];

// Dữ liệu mẫu cho bảng thống kê theo quý
const quarterlyStatsData = [
  {
    key: "1",
    quarter: "Quý 1",
    borrowCount: 3920,
    userCount: 2850,
    eventCount: 12,
    violationCount: 52,
    userSatisfaction: 87.5,
  },
  {
    key: "2",
    quarter: "Quý 2",
    borrowCount: 3510,
    userCount: 2720,
    eventCount: 15,
    violationCount: 33,
    userSatisfaction: 90.2,
  },
  {
    key: "3",
    quarter: "Quý 3",
    borrowCount: 3620,
    userCount: 2940,
    eventCount: 8,
    violationCount: 35,
    userSatisfaction: 91.5,
  },
  {
    key: "4",
    quarter: "Quý 4",
    borrowCount: 4520,
    userCount: 3180,
    eventCount: 11,
    violationCount: 54,
    userSatisfaction: 88.3,
  },
];

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const OverallPerformanceStatistics = ({ timeRange, dateRange }) => {
  // Cột dữ liệu cho bảng thống kê theo quý
  const quarterlyStatsColumns = [
    {
      title: "Quý",
      dataIndex: "quarter",
      key: "quarter",
    },
    {
      title: "Lượt mượn sách",
      dataIndex: "borrowCount",
      key: "borrowCount",
      sorter: (a, b) => a.borrowCount - b.borrowCount,
    },
    {
      title: "Người dùng hoạt động",
      dataIndex: "userCount",
      key: "userCount",
      sorter: (a, b) => a.userCount - b.userCount,
    },
    {
      title: "Sự kiện tổ chức",
      dataIndex: "eventCount",
      key: "eventCount",
      sorter: (a, b) => a.eventCount - b.eventCount,
    },
    {
      title: "Số vi phạm",
      dataIndex: "violationCount",
      key: "violationCount",
      sorter: (a, b) => a.violationCount - b.violationCount,
    },
    {
      title: "Sự hài lòng (%)",
      dataIndex: "userSatisfaction",
      key: "userSatisfaction",
      render: (satisfaction) => (
        <Progress
          percent={satisfaction}
          size="small"
          status={
            satisfaction >= 90
              ? "success"
              : satisfaction >= 80
              ? "normal"
              : "exception"
          }
        />
      ),
      sorter: (a, b) => a.userSatisfaction - b.userSatisfaction,
    },
  ];

  return (
    <div>
      <Title level={4}>Thống kê hiệu quả tổng thể</Title>
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
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lượt mượn sách"
              value={15570}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div className="mt-2">
              <Text type="secondary">So với kỳ trước: </Text>
              <Text type="success">
                <ArrowUpOutlined /> 12.5%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={5150}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="mt-2">
              <Text type="secondary">So với kỳ trước: </Text>
              <Text type="success">
                <ArrowUpOutlined /> 8.2%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ sử dụng thư viện"
              value={78.5}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="mt-2">
              <Text type="secondary">So với kỳ trước: </Text>
              <Text type="success">
                <ArrowUpOutlined /> 5.8%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Mức độ hài lòng"
              value={92.4}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div className="mt-2">
              <Text type="secondary">So với kỳ trước: </Text>
              <Text type="success">
                <ArrowUpOutlined /> 3.2%
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 2: KPI Dashboard */}
      <Card title="Chỉ số hiệu suất (KPI)" className="mt-4">
        <Row gutter={[16, 16]}>
          {kpiData.map((kpi, index) => {
            const percentChange =
              ((kpi.current - kpi.previous) / kpi.previous) * 100;
            const percentTarget =
              ((kpi.current - kpi.target) / kpi.target) * 100;

            const isImproved = kpi.lowerIsBetter
              ? kpi.current < kpi.previous
              : kpi.current > kpi.previous;

            const isOnTarget = kpi.lowerIsBetter
              ? kpi.current <= kpi.target
              : kpi.current >= kpi.target;

            return (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card size="small" className="h-full">
                  <Statistic
                    title={kpi.name}
                    value={kpi.current}
                    suffix={kpi.unit}
                    valueStyle={{ color: isOnTarget ? "#3f8600" : "#cf1322" }}
                  />
                  <Space
                    direction="vertical"
                    className="mt-2"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text type="secondary">Mục tiêu: </Text>
                      <Text strong>
                        {kpi.target} {kpi.unit}
                      </Text>
                      <Text type={isOnTarget ? "success" : "danger"}>
                        {" "}
                        ({isOnTarget ? "+" : ""}
                        {percentTarget.toFixed(1)}%)
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">So với kỳ trước: </Text>
                      <Text type={isImproved ? "success" : "danger"}>
                        {isImproved ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}{" "}
                        {Math.abs(percentChange).toFixed(1)}%
                      </Text>
                    </div>
                    <Progress
                      percent={
                        kpi.lowerIsBetter
                          ? Math.min(100, (kpi.target / kpi.current) * 100)
                          : Math.min(100, (kpi.current / kpi.target) * 100)
                      }
                      status={isOnTarget ? "success" : "normal"}
                      size="small"
                    />
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Row 3: Tabs with different charts */}
      <Card className="mt-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="So sánh lượt mượn sách theo tháng" key="1">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={monthlyComparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} lượt`, "Số lượt mượn"]}
                />
                <Legend />
                <Bar dataKey="thisYear" name="Năm nay" fill="#1890ff" />
                <Bar dataKey="lastYear" name="Năm trước" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabPane>

          <TabPane tab="Tăng trưởng theo loại hoạt động" key="2">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={growthData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 70,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 30]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Tỷ lệ tăng trưởng"]}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Tỷ lệ tăng trưởng (%)"
                      fill="#52c41a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Col>

              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Phân tích tăng trưởng</Title>
                  <Paragraph>
                    Theo số liệu thống kê, tỷ lệ tăng trưởng cao nhất thuộc về
                    các sự kiện tổ chức với mức tăng 25% so với cùng kỳ năm
                    trước. Điều này phản ánh nỗ lực của thư viện trong việc tăng
                    cường hoạt động cộng đồng và thu hút độc giả thông qua các
                    sự kiện.
                  </Paragraph>
                  <Paragraph>
                    Lượt sử dụng thư viện tăng 18.2% cho thấy không gian thư
                    viện đang ngày càng được nhiều người quan tâm và sử dụng.
                    Việc tăng cường tiện nghi và không gian học tập đã góp phần
                    vào kết quả này.
                  </Paragraph>
                  <Paragraph>
                    Tỷ lệ tăng trưởng về số người dùng (12.3%) thấp hơn tỷ lệ
                    tăng trưởng lượt mượn sách (15.8%), điều này cho thấy người
                    dùng hiện tại đang mượn sách nhiều hơn, phản ánh hiệu quả
                    của các chương trình khuyến khích đọc sách.
                  </Paragraph>
                </Space>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Hiệu suất theo khu vực" key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart outerRadius={150} data={areaPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Năm nay"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Năm trước"
                      dataKey="B"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Col>

              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Phân tích hiệu suất theo khu vực</Title>
                  <Paragraph>
                    Biểu đồ radar cho thấy sự cải thiện rõ rệt về hiệu suất sử
                    dụng ở hầu hết các khu vực trong thư viện so với năm trước.
                  </Paragraph>
                  <Paragraph>
                    Khu vực học cá nhân và phòng đọc yên tĩnh có mức tăng đáng
                    kể nhất, phản ánh nhu cầu ngày càng tăng về không gian học
                    tập yên tĩnh, tập trung.
                  </Paragraph>
                  <Paragraph>
                    Khu vực sách tham khảo là khu vực duy nhất có hiệu suất giảm
                    nhẹ so với năm trước, điều này có thể do sự gia tăng của tài
                    liệu điện tử thay thế cho việc sử dụng sách tham khảo truyền
                    thống.
                  </Paragraph>
                </Space>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Row 4: Bảng thống kê theo quý */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Thống kê theo quý">
            <Table
              dataSource={quarterlyStatsData}
              columns={quarterlyStatsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Row 5: Thống kê xu hướng và dự báo */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="Xu hướng và dự báo">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={monthlyComparisonData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="thisYear"
                      name="Năm nay"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="lastYear"
                      name="Năm trước"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Col>

              <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Nhận xét và dự báo</Title>
                  <Divider />
                  <Paragraph>
                    <Text strong>Xu hướng hiện tại:</Text> Lượt mượn sách có xu
                    hướng tăng vào đầu năm học (tháng 9-11) và giảm trong kỳ
                    nghỉ hè (tháng 6-8).
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Dự báo:</Text> Dựa trên dữ liệu hiện tại, dự
                    kiến lượt mượn sách sẽ tiếp tục tăng trong quý tới với mức
                    tăng ước tính 10-15% so với cùng kỳ năm trước.
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Đề xuất:</Text> Tăng cường số lượng bản sao của
                    các đầu sách phổ biến và mở rộng không gian đọc trong thời
                    gian cao điểm.
                  </Paragraph>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverallPerformanceStatistics;
