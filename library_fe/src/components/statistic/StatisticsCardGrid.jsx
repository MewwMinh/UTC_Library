import { useEffect, useState } from "react";
import StatisticsCard from "./StatisticsCard";
import statisticsService from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/StatisticsCardGrid.module.css";
import {
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Spin, Alert } from "antd";

// Hàm tạo dữ liệu biểu đồ giả
const generateChartData = (length = 10, trend = "random") => {
  let lastValue = Math.floor(Math.random() * 50) + 25;

  return Array.from({ length }, (_, i) => {
    if (trend === "up") {
      lastValue = lastValue + Math.floor(Math.random() * 10) - 3;
    } else if (trend === "down") {
      lastValue = lastValue - Math.floor(Math.random() * 10) + 3;
    } else {
      lastValue = lastValue + Math.floor(Math.random() * 20) - 10;
    }

    lastValue = Math.max(10, Math.min(100, lastValue));

    return {
      name: i,
      value: lastValue,
    };
  });
};

const StatisticsCardGrid = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const data = await statisticsService.fetchStatistics();
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getStatistics();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi khi tải dữ liệu"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!statistics) return null;

  const cards = [
    {
      icon: <BookOutlined />,
      label: "Tổng số đầu sách",
      value: statistics.tongSoDauSach,
      percentageChange: 2.6,
      chartData: generateChartData(10, "up"),
      color: "#4caf50",
    },
    {
      icon: <UserOutlined />,
      label: "Tổng số bạn đọc",
      value: statistics.tongSoBanDoc,
      percentageChange: -0.1,
      chartData: generateChartData(10, "down"),
      color: "#9c27b0",
    },
    {
      icon: <ShoppingCartOutlined />,
      label: "Lượt mượn tháng này",
      value: statistics.soLuotMuonThangNay,
      percentageChange: 2.8,
      chartData: generateChartData(10, "up"),
      color: "#ff9800",
    },
    {
      icon: <MessageOutlined />,
      label: "Lượt trả tháng này",
      value: statistics.soLuotTraThangNay,
      percentageChange: 3.6,
      chartData: generateChartData(10, "up"),
      color: "#f44336",
    },
    {
      icon: <FileTextOutlined />,
      label: "Tổng số sách",
      value: statistics.tongSoSach,
      percentageChange: 1.5,
      chartData: generateChartData(10, "up"),
      color: "#2196f3",
    },
    {
      icon: <InboxOutlined />,
      label: "Sách nhập tháng này",
      value: statistics.soLuongSachNhapVaoThangNay,
      percentageChange: 4.2,
      chartData: generateChartData(10, "up"),
      color: "#ff5722",
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <div className={styles.cardWrapper} key={index}>
          <StatisticsCard
            icon={card.icon}
            label={card.label}
            value={card.value}
            percentageChange={card.percentageChange}
            chartData={card.chartData}
            color={card.color}
          />
        </div>
      ))}
    </div>
  );
};

export default StatisticsCardGrid;
