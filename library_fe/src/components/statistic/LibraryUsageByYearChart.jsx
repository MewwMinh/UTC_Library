import { useState, useEffect } from "react";
import { Select, Spin, Empty, Alert, Card } from "antd";
import LineChart from "./LineChart";
import statisticsService from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/LibraryUsageByYearChart.module.css";

/**
 * Component for displaying library usage statistics by month within a year
 */
const LibraryUsageByYearChart = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate last 5 years for selection
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await statisticsService.getLibraryUsageByYear(
          selectedYear
        );
        // Format the data to ensure months are ordered correctly
        const formattedData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const monthData = data.find((item) => item.thang === month);
          return (
            monthData || {
              thang: month,
              tongSoLuotSuDung: 0,
            }
          );
        });
        setUsageData(formattedData);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching library usage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // Prepare data for LineChart
  const chartLines = [
    {
      dataKey: "tongSoLuotSuDung",
      name: "Lượt sử dụng thư viện",
      color: "#722ed1",
    },
  ];

  // Custom formatters
  const formatXAxis = (month) => `Tháng ${month}`;
  const formatTooltipValue = (value) => {
    return [value, "Lượt sử dụng"];
  };

  return (
    <Card className={styles.container} variant="borderless">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Thống kê lượt sử dụng thư viện năm {selectedYear}
        </h2>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          className={styles.yearSelector}
        >
          {years.map((year) => (
            <Select.Option key={year} value={year}>
              Năm {year}
            </Select.Option>
          ))}
        </Select>
      </div>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className={styles.alert}
        />
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : usageData.length === 0 ? (
        <Empty
          description="Không có dữ liệu"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <LineChart
          data={usageData}
          lines={chartLines}
          xAxisDataKey="thang"
          xAxisFormatter={formatXAxis}
          tooltipFormatter={formatTooltipValue}
          xAxisLabel="Tháng"
          yAxisLabel="Số lượt"
          title={`Thống kê lượt sử dụng thư viện năm ${selectedYear}`}
          height={450}
        />
      )}
    </Card>
  );
};

export default LibraryUsageByYearChart;
