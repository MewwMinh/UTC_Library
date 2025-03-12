import { useState, useEffect } from "react";
import {
  BookOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Skeleton, notification } from "antd";
import { useSelector } from "react-redux";
import patronService from "/src/services/patronService";

// Định nghĩa CSS trong một object riêng
const styles = {
  statCardContainer: {
    marginBottom: "16px",
    marginTop: "20px",
  },
  statCard: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "none",
    height: "100%",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  statCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
  },
  iconContainer: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    marginBottom: "16px",
    color: "#fff",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.85)",
    marginBottom: "8px",
  },
  contentContainer: {
    padding: "20px",
    textAlign: "center",
  },
};

export default function Statistics() {
  const [stats, setStats] = useState({
    totalBookBorrowed: 0,
    totalNearDueBookBorrowed: 0,
    totalViolation: 0,
    totalComment: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        const response = await patronService.getPatronStatistics();

        if (response.success) {
          setStats(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải thống kê người dùng",
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [isAuthenticated]);

  // Card styling and configuration
  const cardConfigs = [
    {
      title: "Tổng số đã mượn",
      value: stats.totalBookBorrowed,
      icon: <BookOutlined style={{ fontSize: 28 }} />,
      color: "#1677ff",
      shadowColor: "rgba(22, 119, 255, 0.3)",
      backgroundColor: "#f0f5ff",
    },
    {
      title: "Sách sắp đến hạn",
      value: stats.totalNearDueBookBorrowed,
      icon: <ClockCircleOutlined style={{ fontSize: 28 }} />,
      color: "#faad14",
      shadowColor: "rgba(250, 173, 20, 0.3)",
      backgroundColor: "#fffbe6",
    },
    {
      title: "Số vi phạm",
      value: stats.totalViolation,
      icon: <ExclamationCircleOutlined style={{ fontSize: 28 }} />,
      color: "#ff4d4f",
      shadowColor: "rgba(255, 77, 79, 0.3)",
      backgroundColor: "#fff1f0",
    },
    {
      title: "Bình luận đã đóng góp",
      value: stats.totalComment,
      icon: <CommentOutlined style={{ fontSize: 28 }} />,
      color: "#52c41a",
      shadowColor: "rgba(82, 196, 26, 0.3)",
      backgroundColor: "#f6ffed",
    },
  ];

  return (
    <Row gutter={[16, 16]} style={styles.statCardContainer}>
      {cardConfigs.map((config, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card
            styles={{
              body: {
                padding: 0,
                overflow: "hidden",
              },
            }}
            style={{
              ...styles.statCard,
              boxShadow: `0 6px 16px ${config.shadowColor}`,
              ...(hoveredCard === index ? styles.statCardHover : {}),
              backgroundColor: config.backgroundColor,
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.contentContainer}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <>
                  <div
                    style={{
                      ...styles.iconContainer,
                      background: config.color,
                    }}
                  >
                    {config.icon}
                  </div>

                  <Statistic
                    title={<div style={styles.title}>{config.title}</div>}
                    value={config.value}
                    valueStyle={{
                      fontSize: "36px",
                      fontWeight: "700",
                      color: config.color,
                    }}
                  />
                </>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
