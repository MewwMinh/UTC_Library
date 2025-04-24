import { useState, useEffect } from "react";
import { Select, Spin, Empty, Alert, Card } from "antd";
import LineChart from "./LineChart";
import statisticsService from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/LibraryUsageByMonthChart.module.css";

/**
 * Component for displaying library usage statistics by day within a month
 */
const LibraryUsageByMonthChart = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Generate last 5 years for selection
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Months for selection
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await statisticsService.getLibraryUsageByMonth(
          selectedYear,
          selectedMonth
        );

        // Get the number of days in the selected month
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

        // Format the data to ensure days are ordered correctly
        const formattedData = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayData = data.find((item) => item.ngay === day);
          return (
            dayData || {
              ngay: day,
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
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  // Prepare data for LineChart
  const chartLines = [
    {
      dataKey: "tongSoLuotSuDung",
      name: "Lượt sử dụng thư viện",
      color: "#13c2c2",
    },
  ];

  // Custom formatters
  const formatXAxis = (day) => `Ngày ${day}`;
  const formatTooltipValue = (value) => {
    return [value, "Lượt sử dụng"];
  };

  // Convert month number to name
  const getMonthName = (month) => {
    const monthNames = [
      "Một",
      "Hai",
      "Ba",
      "Tư",
      "Năm",
      "Sáu",
      "Bảy",
      "Tám",
      "Chín",
      "Mười",
      "Mười Một",
      "Mười Hai",
    ];
    return monthNames[month - 1];
  };

  return (
    <Card className={styles.container} variant="borderless">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Thống kê lượt sử dụng thư viện tháng {selectedMonth} năm{" "}
          {selectedYear}
        </h2>
        <div className={styles.selectors}>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            className={styles.selector}
          >
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                Năm {year}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.selector}
          >
            {months.map((month) => (
              <Select.Option key={month} value={month}>
                Tháng {month}
              </Select.Option>
            ))}
          </Select>
        </div>
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
          xAxisDataKey="ngay"
          xAxisFormatter={formatXAxis}
          tooltipFormatter={formatTooltipValue}
          xAxisLabel="Ngày"
          yAxisLabel="Số lượt"
          title={`Thống kê lượt sử dụng thư viện tháng ${getMonthName(
            selectedMonth
          )} năm ${selectedYear}`}
          height={450}
        />
      )}
    </Card>
  );
};

export default LibraryUsageByMonthChart;
