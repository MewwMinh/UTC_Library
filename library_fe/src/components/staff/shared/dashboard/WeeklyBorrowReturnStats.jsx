import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Typography,
  Skeleton,
  Badge,
  Space,
  Statistic,
  Row,
  Tag,
  Empty,
  notification,
} from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  BookOutlined,
  RollbackOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import librarianService from "/src/services/librarianService";

const { Text } = Typography;

export default function WeeklyBorrowReturnStats() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalReturned, setTotalReturned] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState({
    borrowed: 0,
    returned: 0,
  });

  // Format date to day of week with full name
  const formatDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const dayNames = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayOfWeek = dayNames[date.getDay()];
    return dayOfWeek;
  };

  useEffect(() => {
    fetchWeeklyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const response = await librarianService.getWeeklyBorrowReturn();

      if (response.success) {
        // Format the data for the chart and reverse to show chronological order
        const formattedData = response.data
          .map((item) => ({
            date: item.date,
            dayOfWeek: formatDayOfWeek(item.date),
            borrowed: item.borrowedBooks,
            returned: item.returnedBooks,
            // Add a slight offset for a visual line effect
            borrowedOffset: item.borrowedBooks + 0.5,
            returnedOffset: item.returnedBooks - 0.5,
          }))
          .reverse(); // Reverses the order to show chronological order

        setChartData(formattedData);

        // Calculate totals for the last 7 days (excluding the earliest day which is for comparison)
        let borrowedTotal = 0;
        let returnedTotal = 0;

        // Skip the first item (which is from a week ago) when calculating totals
        const last7DaysData = formattedData.slice(1);

        last7DaysData.forEach((item) => {
          borrowedTotal += item.borrowed;
          returnedTotal += item.returned;
        });

        setTotalBorrowed(borrowedTotal);
        setTotalReturned(returnedTotal);

        // Calculate weekly change (today compared to same day last week)
        // The newest data point (today) would be the last in the array
        const today = formattedData[formattedData.length - 1];
        // The same day last week would be the first in the array
        const sameWeekDayLastWeek = formattedData[0];

        if (today && sameWeekDayLastWeek) {
          setWeeklyChange({
            borrowed: calculatePercentageChange(
              today.borrowed,
              sameWeekDayLastWeek.borrowed
            ),
            returned: calculatePercentageChange(
              today.returned,
              sameWeekDayLastWeek.returned
            ),
          });
        }
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải dữ liệu thống kê",
        });
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching weekly data:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #f0f0f0",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: "bold",
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "5px",
            }}
          >
            <CalendarOutlined style={{ marginRight: "5px" }} />
            {payload[0].payload.date} ({label})
          </p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{
                color: entry.color,
                margin: "5px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              {entry.name === "Mượn" ? (
                <BookOutlined style={{ marginRight: "5px" }} />
              ) : (
                <RollbackOutlined style={{ marginRight: "5px" }} />
              )}
              {entry.name}: {entry.value} quyển
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // PropTypes cho CustomTooltip
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
  };

  return (
    <Col xs={24} lg={24}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title={
            <Space direction="horizontal">
              <Text
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginLeft: 15,
                }}
              >
                Thống kê mượn/trả trong tuần
              </Text>
              <Badge
                count={
                  <Tag color="blue" style={{ marginLeft: "8px" }}>
                    8 ngày gần nhất
                  </Tag>
                }
              />
            </Space>
          }
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 7 }} />
          ) : chartData.length === 0 ? (
            <Empty
              description="Không có dữ liệu"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={12}>
                  <Card
                    variant="borderless"
                    style={{
                      background: "rgba(24, 144, 255, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Statistic
                      title={
                        <Text strong>
                          <BookOutlined /> Tổng sách mượn
                        </Text>
                      }
                      value={totalBorrowed}
                      suffix="quyển"
                      valueStyle={{ color: "#1890ff" }}
                    />
                    <div style={{ marginTop: "8px" }}>
                      <Text
                        type={weeklyChange.borrowed >= 0 ? "success" : "danger"}
                      >
                        {weeklyChange.borrowed >= 0 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}{" "}
                        {Math.abs(weeklyChange.borrowed)}%
                      </Text>{" "}
                      <Text type="secondary">so với cùng kỳ tuần trước</Text>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    variant="borderless"
                    style={{
                      background: "rgba(82, 196, 26, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Statistic
                      title={
                        <Text strong>
                          <RollbackOutlined /> Tổng sách trả
                        </Text>
                      }
                      value={totalReturned}
                      suffix="quyển"
                      valueStyle={{ color: "#52c41a" }}
                    />
                    <div style={{ marginTop: "8px" }}>
                      <Text
                        type={weeklyChange.returned >= 0 ? "success" : "danger"}
                      >
                        {weeklyChange.returned >= 0 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}{" "}
                        {Math.abs(weeklyChange.returned)}%
                      </Text>{" "}
                      <Text type="secondary">so với cùng kỳ tuần trước</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="dayOfWeek"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "#f0f0f0" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "#f0f0f0" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="colorBorrowed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#1890ff"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorReturned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#52c41a"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="borrowed"
                    stroke="#1890ff"
                    strokeWidth={2}
                    fill="url(#colorBorrowed)"
                    name="Mượn"
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="returned"
                    stroke="#52c41a"
                    strokeWidth={2}
                    fill="url(#colorReturned)"
                    name="Trả"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Text type="secondary">
                  Dữ liệu được cập nhật tới ngày{" "}
                  {chartData[chartData.length - 1]?.date}
                  {chartData.length > 0 &&
                    " - So sánh với " +
                      chartData[0]?.dayOfWeek +
                      " tuần trước (" +
                      chartData[0]?.date +
                      ")"}
                </Text>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </Col>
  );
}
