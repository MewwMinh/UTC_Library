// src/components/UserAchievement.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Progress,
  Typography,
  Space,
  notification,
  theme,
  Skeleton,
} from "antd";
import { TrophyOutlined, ArrowUpOutlined } from "@ant-design/icons";
import achievementService from "/src/services/patron/achievementService";
import styled from "styled-components";

const { Title, Text } = Typography;

// Styled components for more creative design
const AchievementCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: none;

  .ant-card-head {
    background: ${(props) =>
      props.$headerBackground ||
      "linear-gradient(90deg, #1677ff 0%, #4096ff 100%)"};
    border-bottom: none;
    padding: 16px 24px;
    text-align: center;
  }

  .ant-card-head-title {
    font-size: 20px !important;
    font-weight: 700 !important;
  }

  .ant-card-body {
    padding: 0;
  }
`;

const RankBadge = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$background || "#f0f0f0"};
  padding: 32px 24px;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 20px;
    background: ${(props) => props.$background || "#f0f0f0"};
    clip-path: polygon(0 0, 50% 100%, 100% 0);
  }
`;

const TrophyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 40px;
    color: ${(props) => props.$color || "#CD7F32"};
  }
`;

const ProgressContainer = styled.div`
  padding: 32px 24px 24px;
  background: white;
`;

const NextRankInfo = styled.div`
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  span {
    font-size: 16px !important;
  }
`;

const RankTitle = styled(Title)`
  margin: 0 !important;
  color: ${(props) => props.$color || "#333"} !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PointsText = styled(Text)`
  font-size: 18px !important;
  display: block;
  margin-top: 4px !important;
  color: rgba(0, 0, 0, 0.65);
`;

const HighlightedPoints = styled(Text)`
  color: ${(props) => props.$color || "#1677ff"};
  font-weight: 700;
  font-size: 18px !important;
  margin: 0 5px;
`;

function UserAchievement() {
  const [achievementData, setAchievementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();

  // Define color themes based on rank
  const getRankTheme = (rank) => {
    switch (rank) {
      case "Vàng":
        return {
          color: "#FFD700",
          background: "linear-gradient(135deg, #FFF8E1 0%, #FFF176 100%)",
          headerBackground: "linear-gradient(90deg, #FF9800 0%, #FFC107 100%)",
          progressStroke: { from: "#FFC107", to: "#FF9800" },
        };
      case "Bạc":
        return {
          color: "#9E9E9E",
          background: "linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)",
          headerBackground: "linear-gradient(90deg, #2196F3 0%, #42A5F5 100%)",
          progressStroke: { from: "#2196F3", to: "#FF9800" },
        };
      case "Đồng":
        return {
          color: "#CD7F32",
          background: "linear-gradient(135deg, #FFECB3 0%, #FFCC80 100%)",
          headerBackground: "linear-gradient(90deg, #795548 0%, #A1887F 100%)",
          progressStroke: { from: "#795548", to: "#2196F3" },
        };
      default:
        return {
          color: "#CD7F32",
          background: "linear-gradient(135deg, #FFECB3 0%, #FFCC80 100%)",
          headerBackground: "linear-gradient(90deg, #795548 0%, #A1887F 100%)",
          progressStroke: { from: "#795548", to: "#2196F3" },
        };
    }
  };

  // Calculate progress percentage to next rank
  const calculateProgress = () => {
    if (!achievementData || !achievementData.nextRank) return 100;

    const totalPointsNeeded =
      achievementData.points + achievementData.pointsToNextRank;
    const currentProgress = (achievementData.points / totalPointsNeeded) * 100;
    return parseFloat(currentProgress.toFixed(1));
  };

  useEffect(() => {
    const fetchAchievementData = async () => {
      try {
        setLoading(true);
        const response = await achievementService.getAchievements();

        if (response.success) {
          setAchievementData(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải thông tin thành tích",
          });
        }
      } catch (error) {
        console.error("Error fetching achievement data:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementData();
  }, []);

  if (loading) {
    return (
      <AchievementCard
        title={
          <Space>
            <TrophyOutlined /> Thành tích của tôi
          </Space>
        }
      >
        <div style={{ padding: "24px" }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </AchievementCard>
    );
  }

  if (!achievementData) {
    return null;
  }

  const rankTheme = getRankTheme(achievementData.rank);
  const progressPercent = calculateProgress();
  const nextRankTheme = achievementData.nextRank
    ? getRankTheme(achievementData.nextRank)
    : null;

  return (
    <AchievementCard
      title="Thành tích của tôi"
      $headerBackground={rankTheme.headerBackground}
      headStyle={{ color: "white" }}
    >
      <RankBadge $background={rankTheme.background}>
        <TrophyIcon $color={rankTheme.color}>
          <TrophyOutlined />
        </TrophyIcon>
        <RankTitle level={2} $color={rankTheme.color}>
          {achievementData.rank}
        </RankTitle>
        <PointsText>{achievementData.points} điểm</PointsText>
      </RankBadge>

      <ProgressContainer>
        {achievementData.nextRank && (
          <>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Tiến độ đạt hạng {achievementData.nextRank}
            </Text>
            <Progress
              percent={progressPercent}
              strokeColor="#8B4513"
              format={(percent) => `${percent}%`}
              status="active"
            />

            <NextRankInfo>
              <ArrowUpOutlined style={{ marginRight: "8px" }} />
              <Text>Cần thêm</Text>
              <HighlightedPoints>
                {achievementData.pointsToNextRank}
              </HighlightedPoints>
              <Text>điểm để đạt hạng</Text>
              <Text strong style={{ marginLeft: "5px" }}>
                {achievementData.nextRank}
              </Text>
            </NextRankInfo>
          </>
        )}

        {!achievementData.nextRank && (
          <NextRankInfo
            style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }}
          >
            <TrophyOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
            <Text strong style={{ color: "#52c41a" }}>
              Chúc mừng! Bạn đã đạt hạng thành viên cao nhất
            </Text>
          </NextRankInfo>
        )}
      </ProgressContainer>
    </AchievementCard>
  );
}

export default UserAchievement;
