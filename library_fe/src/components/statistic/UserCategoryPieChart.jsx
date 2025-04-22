// src/components/UserCategoryPieChart/UserCategoryPieChart.js
import React, { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import PieChart from "./PieChart";
import fetchUserCategoryData from "/src/services/shared/statisticsService";
import styles from "/src/styles/statistic/UserCategoryPieChart.module.css";

const UserCategoryPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchUserCategoryData.fetchUserCategoryData();

        // Chuyển đổi dữ liệu API thành định dạng cho biểu đồ
        const formattedData = [
          { name: "Sinh viên", value: result.soLuongSinhVien },
          { name: "Giảng viên", value: result.soLuongGiangVien },
          { name: "Nghiên cứu sinh", value: result.soLuongNghienCuuSinh },
          {
            name: "Người dùng khác",
            value: result.soLuongNguoiDungKhongThuocTruongGTVT,
          },
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
    <PieChart data={chartData} title="Phân loại người dùng" colors={colors} />
  );
};

export default UserCategoryPieChart;
