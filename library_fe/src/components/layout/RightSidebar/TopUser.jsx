import { useState, useEffect, useRef } from "react";
import { Card, Avatar, Skeleton, Empty, Typography, notification } from "antd";
import { FireFilled, UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import userService from "/src/services/userService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import component styles
import "./TopUser.css";

const { Title, Text } = Typography;

function TopUser() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const fetchTopUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getTopUsers();

      if (response.success) {
        setTopUsers(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách người dùng",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching top users:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankStyles = (index) => {
    if (index === 0) {
      return {
        barStyle: {
          background: "#FFD700", // Gold
        },
        rankColor: "#FFD700",
        avatarStyle: {
          border: "2px solid gold",
          backgroundColor: "#fff8e6",
        },
        fireColor: "#FFD700",
      };
    } else if (index === 1) {
      return {
        barStyle: {
          background: "#C0C0C0", // Silver
        },
        rankColor: "#C0C0C0",
        avatarStyle: {
          border: "2px solid silver",
          backgroundColor: "#f5f5f5",
        },
        fireColor: "#C0C0C0",
      };
    } else if (index === 2) {
      return {
        barStyle: {
          background: "#CD7F32", // Bronze
        },
        rankColor: "#CD7F32",
        avatarStyle: {
          border: "2px solid #CD7F32",
          backgroundColor: "#faf0e6",
        },
        fireColor: "#CD7F32",
      };
    } else {
      return {
        barStyle: {
          background: "#1677ff", // Default
        },
        rankColor: "#999",
        avatarStyle: {
          border: "1px solid #d9d9d9",
        },
        fireColor: "#1890ff",
      };
    }
  };

  const renderUserCard = (user, index) => {
    const styles = getRankStyles(index);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        style={{
          padding: "6px 0",
          width: "100%",
        }}
      >
        <div className="user-card user-card-hover">
          <div className="user-card-bar" style={styles.barStyle} />

          <div className="user-rank-number" style={{ color: styles.rankColor }}>
            {index + 1}
          </div>

          <Avatar
            size={40}
            src={user.userImage}
            icon={!user.userImage && <UserOutlined />}
            className="user-avatar"
            style={{ ...styles.avatarStyle, marginTop: "4px" }}
          />

          <div className="user-info">
            <div className="user-name-container">
              <Text strong className="user-name">
                {user.patronName}
              </Text>
            </div>

            <div className="user-stats">
              {user.membershipType && (
                <FireFilled
                  className="membership-icon"
                  style={{ color: styles.fireColor }}
                />
              )}
              <Text type="secondary" className="user-points">
                {user.memberPoints || 0} điểm
              </Text>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card
      title={
        <Title level={4} className="top-user-title">
          Bạn đọc tiêu biểu
        </Title>
      }
      styles={{
        header: {
          background: "#1677ff",
          color: "white",
          borderBottom: "none",
          borderRadius: "12px 12px 0 0",
          padding: "16px",
          marginTop: "-1px",
          marginLeft: "-1px",
          marginRight: "-1px",
        },
        body: {
          flex: 1,
          overflow: "hidden",
          padding: "16px 12px 24px 12px",
        },
      }}
      className="top-user-card"
    >
      {loading ? (
        <div className="loading-container">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              active
              avatar={{ size: 40, shape: "circle" }}
              paragraph={{ rows: 1, width: "60%" }}
              style={{ padding: "0 10px" }}
            />
          ))}
        </div>
      ) : topUsers.length === 0 ? (
        <Empty
          description="Không có dữ liệu"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 60 }}
        />
      ) : (
        <div style={{ height: "100%" }}>
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 15000, // 15 seconds
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            style={{ paddingBottom: "25px" }}
          >
            {/* Chia 10 người dùng thành 2 trang, mỗi trang 5 người */}
            {[0, 5].map((startIndex) => (
              <SwiperSlide key={`slide-${startIndex}`}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "10px 0",
                  }}
                >
                  {topUsers
                    .slice(startIndex, startIndex + 5)
                    .map((user, idx) => (
                      <div key={`user-${startIndex + idx}-${user.id || idx}`}>
                        {renderUserCard(user, startIndex + idx)}
                      </div>
                    ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </Card>
  );
}

export default TopUser;
