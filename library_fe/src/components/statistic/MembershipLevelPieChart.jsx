// src/components/MembershipLevelPieChart/MembershipLevelPieChart.js
import { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import PieChart from "./PieChart";
import fetchMembershipLevelData from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/UserCategoryPieChart.module.css";

const MembershipLevelPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Màu cho Đồng (Bronze), Bạc (Silver), Vàng (Gold)
  const colors = ["#cd7f32", "#c0c0c0", "#ffd700"];

  // Màu nền gradient nhẹ cho biểu đồ
  const backgroundColors = ["#f7f1e3", "#f5f6fa"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await fetchMembershipLevelData.fetchMembershipLevelData();

        // Chuyển đổi dữ liệu API thành định dạng cho biểu đồ
        const formattedData = [
          { name: "Hạng Đồng", value: result.soLuongHangDong },
          { name: "Hạng Bạc", value: result.soLuongHangBac },
          { name: "Hạng Vàng", value: result.soLuongHangVang },
        ];

        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <PieChart
      data={chartData}
      title="Phân bố hạng thành viên"
      colors={colors}
      backgroundColors={backgroundColors}
      autoAnimate={false} // Tắt tự động luân phiên các phần tử
      decorations={true} // Bật trang trí
    />
  );
};

export default MembershipLevelPieChart;
