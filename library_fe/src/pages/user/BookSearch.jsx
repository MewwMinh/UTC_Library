// src/pages/BookSearch.jsx
import { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  TechBooks,
  SuggestedBooks,
  SearchCard,
} from "/src/components/user/book";
import styles from "/src/styles/books/BookSearch.module.css";

const { Title, Text } = Typography;

function BookSearch() {
  const [statsData] = useState({
    totalBooks: 12850,
    activeReaders: 876,
    dailyLoans: 124,
  });

  // Thêm hiệu ứng đếm số cho các thống kê
  const [animatedStats, setAnimatedStats] = useState({
    totalBooks: 0,
    activeReaders: 0,
    dailyLoans: 0,
  });

  useEffect(() => {
    // Tạo hiệu ứng đếm số tăng dần
    const duration = 2500; // Thời gian hoàn thành animation (2.5 giây)
    const interval = 20; // Mỗi 20ms cập nhật một lần
    const steps = duration / interval;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);

      setAnimatedStats({
        totalBooks: Math.floor(progress * statsData.totalBooks),
        activeReaders: Math.floor(progress * statsData.activeReaders),
        dailyLoans: Math.floor(progress * statsData.dailyLoans),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerBackground}></div>
        <div className={styles.headerBackgroundAnimation}></div>

        <div className={styles.headerContent}>
          <div className={styles.topRow}>
            <div className={styles.titleContainer}>
              <img
                src="/public/logo-utc.png"
                alt="Logo UTC"
                className={styles.logo}
              />
              <div>
                <Title level={2} className={styles.headerTitle}>
                  Thư Viện Trường Đại học Giao Thông Vận Tải
                </Title>
                <Text className={styles.headerDescription}>
                  Khám phá kho tàng tri thức với hơn 10.000 đầu sách từ các lĩnh
                  vực khoa học, kỹ thuật và văn hóa. Hãy bắt đầu hành trình đọc
                  sách của bạn ngay hôm nay!
                </Text>
              </div>
            </div>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {animatedStats.totalBooks.toLocaleString()}
                <BookOutlined style={{ fontSize: 20, marginLeft: 8 }} />
              </div>
              <div className={styles.statLabel}>Tổng số sách</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {animatedStats.activeReaders.toLocaleString()}
                <TeamOutlined style={{ fontSize: 20, marginLeft: 8 }} />
              </div>
              <div className={styles.statLabel}>Bạn đọc tích cực</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {animatedStats.dailyLoans.toLocaleString()}
                <CalendarOutlined style={{ fontSize: 20, marginLeft: 8 }} />
              </div>
              <div className={styles.statLabel}>Lượt mượn hàng ngày</div>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[0, 24]}>
        <Col span={24}>
          <SearchCard />
        </Col>
        <Col span={24}>
          <SuggestedBooks />
        </Col>
        <Col span={24}>
          <TechBooks />
        </Col>
      </Row>
    </div>
  );
}

export default BookSearch;
