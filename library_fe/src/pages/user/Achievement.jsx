import { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, notification, Card } from "antd";
import { LoadingOutlined, ReadOutlined } from "@ant-design/icons";
import {
  AchievementTimeline,
  UserAchievement,
  PointHistoryTimeline,
} from "/src/components/user/achievement";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const { Title } = Typography;

const Achievement = () => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      notification.warning({
        message: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để xem thông tin mượn sách",
      });
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          tip="Đang tải thông tin sách..."
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ paddingBottom: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card
            style={{
              marginBottom: 24,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3498db 0%, #1a5276 100%)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Row align="middle" gutter={[16, 0]} justify="center">
              <Col>
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <ReadOutlined style={{ fontSize: 48, color: "#ffffff" }} />
                </motion.div>
              </Col>
              <Col>
                <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
                  Quản lý mượn & trả sách
                </Title>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <Row gutter={[24, 24]}>
          {/* Top row with two columns */}
          <Col xs={24} md={24}>
            <UserAchievement />
          </Col>
          <Col xs={24} md={24}>
            <AchievementTimeline />
          </Col>

          {/* Bottom row with full width */}
          <Col xs={24}>
            <PointHistoryTimeline />
          </Col>
        </Row>
      </div>
    </motion.div>
  );
};

export default Achievement;
