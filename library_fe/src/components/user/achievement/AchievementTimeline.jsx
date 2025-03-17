// src/components/AchievementCards.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Skeleton,
  Empty,
  notification,
  Row,
  Col,
  Tooltip,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import styled from "styled-components";
import achievementService from "/src/services/patron/achievementService";

const { Title, Text } = Typography;

// Styled components
const AchievementsCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: none;

  .ant-card-head {
    background: linear-gradient(90deg, #8b4513 0%, #a0522d 100%);
    border-bottom: none;
    padding: 16px 24px;
    text-align: center;
  }

  .ant-card-head-title {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: white;
  }
`;

const ContentContainer = styled.div`
  padding: 24px;

  .achievement-col {
    display: flex;
    margin-bottom: 24px;
  }
`;

const AchievementCard = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${(props) => props.$background || "white"};
`;

const CardTop = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 16px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 3px solid ${(props) => props.$borderColor || "#1677ff"};
  transition: transform 0.3s ease;

  ${AchievementCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const CardBody = styled.div`
  padding: 0 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;

  .description-text {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    min-height: 63px; /* Đủ cao cho 3 dòng text */
  }
`;

const CardFooter = styled.div`
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  ${AchievementCard}:hover & {
    transform: scale(1.05);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: rgba(0, 0, 0, 0.45);

  .ant-empty-image {
    height: 100px;
  }
`;

// Generate consistent colors for achievements based on name
const getColorFromName = (name) => {
  // Simple hash function to generate a consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // List of pleasant colors
  const colors = [
    "#1677ff", // Blue
    "#52c41a", // Green
    "#fa8c16", // Orange
    "#722ed1", // Purple
    "#eb2f96", // Pink
    "#faad14", // Gold
    "#13c2c2", // Cyan
  ];

  return colors[Math.abs(hash) % colors.length];
};

// Generate a gradient background based on color
const getGradientBackground = (color) => {
  // Convert hex to rgb
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create a light gradient
  return `linear-gradient(135deg, rgba(${r},${g},${b},0.1) 0%, rgba(${r},${g},${b},0.2) 100%)`;
};

function AchievementCards() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await achievementService.getAchievementHistory();

        if (response.success) {
          setAchievements(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải lịch sử thành tích",
          });
        }
      } catch (error) {
        console.error("Error fetching achievement history:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Format date to Vietnamese format (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <AchievementsCard title="Thành tích đã đạt được">
      {loading ? (
        <ContentContainer>
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Col>
            ))}
          </Row>
        </ContentContainer>
      ) : achievements.length === 0 ? (
        <EmptyContainer>
          <Empty
            description="Chưa có thành tích nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </EmptyContainer>
      ) : (
        <ContentContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row gutter={[24, 0]}>
              {achievements.map((achievement, index) => {
                const color = getColorFromName(achievement.achievementName);
                const background = getGradientBackground(color);

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    key={index}
                    className="achievement-col"
                  >
                    <motion.div
                      variants={cardVariants}
                      style={{ width: "100%", display: "flex" }}
                    >
                      <AchievementCard>
                        <CardInner $background={background}>
                          <CardTop>
                            <IconContainer $borderColor={color}>
                              {achievement.achievementIcon}
                            </IconContainer>
                            <Title
                              level={4}
                              style={{ color: color, margin: "0 0 8px 0" }}
                            >
                              {achievement.achievementName}
                            </Title>
                          </CardTop>

                          <CardBody>
                            <Tooltip title={achievement.description}>
                              <Text className="description-text">
                                {achievement.description}
                              </Text>
                            </Tooltip>
                          </CardBody>

                          <CardFooter>
                            <DateBadge>
                              <CalendarOutlined style={{ marginRight: 4 }} />
                              {formatDate(achievement.awardedAt)}
                            </DateBadge>
                          </CardFooter>
                        </CardInner>
                      </AchievementCard>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>
          </motion.div>
        </ContentContainer>
      )}
    </AchievementsCard>
  );
}

export default AchievementCards;
