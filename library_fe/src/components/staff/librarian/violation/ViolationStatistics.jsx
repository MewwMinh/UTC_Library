import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Spin,
  Empty,
  notification,
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import violationService from "/src/services/librarian/violationService.js";
import styles from "/src/styles/violation/ViolationStatistics.module.css";

const { Title, Text } = Typography;
const { Option } = Select;

// Color palette for violation types
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD166",
  "#F77F00",
  "#9A348E",
  "#4E5166",
  "#1A535C",
  "#6A0572",
];

// Helper function to format Vietnamese month names
const formatMonthName = (month) => {
  return `Tháng ${month}`;
};

const ViolationStatistics = () => {
  const [typePeriod, setTypePeriod] = useState("year");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [typeData, setTypeData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [loading, setLoading] = useState({
    typeData: true,
    monthlyData: true,
  });

  const [error, setError] = useState({
    typeData: null,
    monthlyData: null,
  });

  // Function to fetch violation counts by type
  const fetchViolationCountByType = async (period) => {
    setLoading((prev) => ({ ...prev, typeData: true }));
    setError((prev) => ({ ...prev, typeData: null }));

    try {
      const response = await violationService.getViolationCountByType(period);

      if (response.success) {
        // Map the data and add colors
        const formattedData = response.data.map((item, index) => ({
          name: item.violationType,
          value: item.violationCount,
          color: COLORS[index % COLORS.length],
        }));

        setTypeData(formattedData);
      } else {
        setError((prev) => ({ ...prev, typeData: response.message }));
        notification.error({
          message: "Lỗi",
          description: response.message,
        });
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        typeData: "Đã xảy ra lỗi khi tải dữ liệu",
      }));
      console.error("Error fetching violation count by type:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading((prev) => ({ ...prev, typeData: false }));
    }
  };

  // Function to fetch monthly violation counts
  const fetchMonthlyViolationCounts = async (year) => {
    setLoading((prev) => ({ ...prev, monthlyData: true }));
    setError((prev) => ({ ...prev, monthlyData: null }));

    try {
      const response = await violationService.getMonthlyViolationCountByYear(
        year
      );

      if (response.success) {
        // Format the data for the chart
        const formattedData = response.data.map((item) => ({
          name: formatMonthName(item.month),
          count: item.numberOfViolations,
        }));

        setMonthlyData(formattedData);
      } else {
        setError((prev) => ({ ...prev, monthlyData: response.message }));
        notification.error({
          message: "Lỗi",
          description: response.message,
        });
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        monthlyData: "Đã xảy ra lỗi khi tải dữ liệu",
      }));
      console.error("Error fetching monthly violation counts:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading((prev) => ({ ...prev, monthlyData: false }));
    }
  };

  // Function to fetch overall statistics has been removed

  // Effect to fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchViolationCountByType(typePeriod);
  }, [typePeriod]);

  useEffect(() => {
    fetchMonthlyViolationCounts(selectedYear);
  }, [selectedYear]);

  // Handler for period change
  const handlePeriodChange = (value) => {
    setTypePeriod(value);
  };

  // Handler for year change
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // Generate available years for the dropdown
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  // Function to render the pie chart
  const renderPieChart = () => {
    if (loading.typeData) {
      return <Spin size="large" />;
    }

    if (error.typeData) {
      return (
        <div className={styles.errorContainer}>
          <ExclamationCircleOutlined
            style={{ fontSize: 32, color: "#ff4d4f" }}
          />
          <Text type="danger">Không thể tải dữ liệu</Text>
        </div>
      );
    }

    if (typeData.length === 0) {
      return <Empty description="Không có dữ liệu vi phạm" />;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={typeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ percent }) => (percent * 100).toFixed(0) + "%"}
          >
            {typeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} vi phạm`, "Số lượng"]}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ color: "#333", fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Function to render the bar chart
  const renderBarChart = () => {
    if (loading.monthlyData) {
      return <Spin size="large" />;
    }

    if (error.monthlyData) {
      return (
        <div className={styles.errorContainer}>
          <ExclamationCircleOutlined
            style={{ fontSize: 32, color: "#ff4d4f" }}
          />
          <Text type="danger">Không thể tải dữ liệu</Text>
        </div>
      );
    }

    if (monthlyData.length === 0) {
      return <Empty description="Không có dữ liệu vi phạm" />;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#333" }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#333" }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            formatter={(value) => [`${value} vi phạm`, "Số lượng"]}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#333", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar
            dataKey="count"
            name="Số vi phạm"
            fill="#1677ff"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={styles.statisticsContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title
                level={5}
                className={styles.chartTitle}
                style={{ marginLeft: 10 }}
              >
                Thống kê vi phạm theo loại
              </Title>
            }
            extra={
              <Select
                value={typePeriod}
                onChange={handlePeriodChange}
                className={styles.selectControl}
                style={{ marginRight: 10 }}
              >
                <Option value="month">Tháng này</Option>
                <Option value="quarter">Quý này</Option>
                <Option value="year">Năm này</Option>
              </Select>
            }
            className={styles.chartCard}
            variant="borderless"
          >
            <div className={styles.chartContainer}>{renderPieChart()}</div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Title
                level={5}
                className={styles.chartTitle}
                style={{ marginLeft: 10 }}
              >
                Thống kê vi phạm theo tháng
              </Title>
            }
            extra={
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                className={styles.selectControl}
                style={{ marginRight: 10 }}
              >
                {generateYearOptions().map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            }
            className={styles.chartCard}
            variant="borderless"
          >
            <div className={styles.chartContainer}>{renderBarChart()}</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViolationStatistics;
