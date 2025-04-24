// src/components/statistics/BorrowReturnStatistics.jsx
import { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import CustomBarChart from "./BarChart";
import statisticsService from "/src/services/shared/statisticsService.js";
import styles from "/src/styles/statistic/BorrowReturnStatistics.module.css";

const BorrowReturnStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await statisticsService.getBookStatisticsLast5Years();

        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || "Không thể tải dữ liệu thống kê");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = data.map((item) => ({
    year: item.nam.toString(), // Đổi tên trường để dễ hiểu hơn khi nhìn biểu đồ
    borrow: item.tongSoSachMuon,
    return: item.tongSoSachTra,
  }));

  const barConfig = [
    {
      dataKey: "borrow",
      name: "Số sách mượn",
      color: "#1890ff", // Màu xanh dương
    },
    {
      dataKey: "return",
      name: "Số sách trả",
      color: "#52c41a", // Màu xanh lá
    },
  ];

  return (
    <div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : error ? (
        <Alert
          type="error"
          message="Lỗi tải dữ liệu"
          description={error}
          showIcon
        />
      ) : data.length === 0 ? (
        <Alert
          type="info"
          message="Không có dữ liệu"
          description="Hiện không có dữ liệu thống kê mượn/trả sách trong 5 năm gần đây."
          showIcon
        />
      ) : (
        <CustomBarChart
          data={chartData}
          xDataKey="year"
          bars={barConfig}
          height={350}
          title="Tổng số lượt mượn/trả sách 5 năm gần đây"
          subtitle="Dữ liệu thống kê từ năm 2021 đến 2025"
        />
      )}
    </div>
  );
};

export default BorrowReturnStatistics;
