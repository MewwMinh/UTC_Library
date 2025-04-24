import { useState, useEffect } from "react";
import { Select, Spin, Empty, Alert, Card } from "antd";
import LineChart from "./LineChart";
import statisticsService from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/BorrowReturnChart.module.css";

/**
 * Component for displaying borrow/return statistics by month
 */
const BorrowReturnChart = () => {
  const [borrowReturnData, setBorrowReturnData] = useState([]);
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
        const data = await statisticsService.getBorrowReturnStatsByYear(
          selectedYear
        );
        // Format the data to ensure months are ordered correctly
        const formattedData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const monthData = data.find((item) => item.thang === month);
          return (
            monthData || {
              thang: month,
              tongSoSachMuon: 0,
              tongSoSachTra: 0,
            }
          );
        });
        setBorrowReturnData(formattedData);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching borrow/return data:", err);
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
    { dataKey: "tongSoSachMuon", name: "Lượt mượn sách", color: "#1890ff" },
    { dataKey: "tongSoSachTra", name: "Lượt trả sách", color: "#52c41a" },
  ];

  // Custom formatters
  const formatXAxis = (month) => `Tháng ${month}`;
  const formatTooltipValue = (value, name) => {
    const label = name === "tongSoSachMuon" ? "Lượt mượn" : "Lượt trả";
    return [value, label];
  };

  return (
    <Card className={styles.container} variant="borderless">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Thống kê mượn/trả sách năm {selectedYear}
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
      ) : borrowReturnData.length === 0 ? (
        <Empty
          description="Không có dữ liệu"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <LineChart
          data={borrowReturnData}
          lines={chartLines}
          xAxisDataKey="thang"
          xAxisFormatter={formatXAxis}
          tooltipFormatter={formatTooltipValue}
          xAxisLabel="Tháng"
          yAxisLabel="Số lượt"
          title={`Thống kê mượn/trả sách năm ${selectedYear}`}
          height={450}
        />
      )}
    </Card>
  );
};

export default BorrowReturnChart;
