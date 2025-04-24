import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spin, Empty, Typography, Select } from "antd";
import { BookOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import bookStatService from "/src/services/shared/statisticsService.js";
import styles from "/src/styles/statistic/TopBorrowedBooksChart.module.css";

const { Title, Text } = Typography;
const { Option } = Select;

const TopBorrowedBooksChart = ({
  defaultYear = new Date().getFullYear(),
  defaultMonth = new Date().getMonth() + 1,
}) => {
  const [loading, setLoading] = useState(true);
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const navigate = useNavigate();

  // Colors for the bars with a nicer palette
  const COLORS = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await bookStatService.getTopBorrowedBooksByMonth(
          year,
          month
        );

        if (response.success) {
          // Sắp xếp sách theo số lượt mượn giảm dần
          const formattedData = response.data
            .map((book) => ({
              ...book,
              name: truncateText(book.tenSach, 30),
              fullName: book.tenSach,
              value: book.soLuotMuonTrongThang,
            }))
            .sort((a, b) => b.value - a.value);

          setBooksData(formattedData);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Có lỗi xảy ra khi tải dữ liệu");
        console.error("Error fetching top borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Format month name
  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return monthNames[monthNumber - 1];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            <img
              src={data.anhSach || "/default-book-cover.jpg"}
              alt={data.fullName}
              className={styles.bookCover}
            />
            <div className={styles.tooltipInfo}>
              <p className={styles.tooltipTitle}>{data.fullName}</p>
            </div>
          </div>
          <div className={styles.tooltipStats}>
            <p>
              <CalendarOutlined className={styles.tooltipIcon} />
              Lượt mượn trong tháng:{" "}
              <span className={styles.statValue}>
                {data.soLuotMuonTrongThang}
              </span>
            </p>
            <p>
              <BookOutlined className={styles.tooltipIcon} />
              Lượt mượn trong năm:{" "}
              <span className={styles.statValue}>
                {data.soLuotMuonTrongNam}
              </span>
            </p>
          </div>
          <div className={styles.tooltipFooter}>Nhấp để xem chi tiết</div>
        </div>
      );
    }
    return null;
  };

  // Tạo danh sách các năm để chọn (5 năm gần đây)
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }

  // Tạo danh sách các tháng để chọn
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Hàm xử lý khi thay đổi năm/tháng
  const handleYearChange = (value) => {
    setYear(value);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  return (
    <Card
      className={styles.card}
      title={
        <div className={styles.cardHeader}>
          <Title level={4} className={styles.cardTitle}>
            <div style={{ marginLeft: 25 }}>
              Top 10 Sách Được Mượn Nhiều Nhất
            </div>
          </Title>
          <div className={styles.filterContainer}>
            <Select
              value={month}
              onChange={handleMonthChange}
              className={styles.selectFilter}
            >
              {months.map((m) => (
                <Option key={m} value={m}>
                  {getMonthName(m)}
                </Option>
              ))}
            </Select>
            <Select
              value={year}
              onChange={handleYearChange}
              className={styles.selectFilter}
            >
              {years.map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      }
      variant="borderless"
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>Đang tải dữ liệu...</Text>
        </div>
      ) : error ? (
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : booksData.length === 0 ? (
        <Empty
          description="Không có dữ liệu thống kê cho thời gian này"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={booksData}
              margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
            >
              <XAxis
                type="number"
                label={{
                  value: "Số lượt mượn",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                name="Số lượt mượn"
                onClick={(data) => handleBookClick(data.maSach)}
                cursor="pointer"
                radius={[0, 4, 4, 0]}
              >
                {booksData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default TopBorrowedBooksChart;
