import { useState, useEffect } from "react";
import {
  Card,
  List,
  Avatar,
  Skeleton,
  Badge,
  Tooltip,
  Empty,
  Typography,
  notification,
  theme,
} from "antd";
import {
  CrownOutlined,
  TrophyOutlined,
  StarOutlined,
  UserOutlined,
  FireFilled,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import userService from "/src/services/userService";

const { Title, Text } = Typography;

function TopUser() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { token } = theme.useToken();

  useEffect(() => {
    fetchTopUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) =>
        prevPage < Math.ceil(topUsers.length / pageSize) ? prevPage + 1 : 1
      );
    }, 10000); // Automatically change page every 10 seconds

    return () => clearInterval(interval);
  }, [topUsers.length]);

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

  const headerStyle = {
    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
    color: "white",
    borderBottom: "none",
    borderRadius: "12px 12px 0 0",
    padding: "16px",
    marginTop: "-1px",
    marginLeft: "-1px",
    marginRight: "-1px",
  };

  const bodyStyle = {
    flex: 1,
    overflow: "hidden",
    padding: "12px 24px",
  };

  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{
        backgroundPosition: "100% 50%",
        transition: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 10,
        },
      }}
    >
      <Card
        title={
          <Title
            level={4}
            style={{ textAlign: "center", margin: 0, color: "white" }}
          >
            Bạn đọc tiêu biểu
          </Title>
        }
        styles={{
          header: headerStyle,
          body: bodyStyle,
        }}
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          height: "440px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "none",
          marginBottom: 20,
        }}
      >
        {loading ? (
          <div className="loading-container">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                active
                avatar
                paragraph={{ rows: 0 }}
                style={{ marginBottom: 16 }}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ height: "100%" }}
            >
              <List
                itemLayout="horizontal"
                dataSource={topUsers.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                renderItem={(user, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index;
                  return (
                    <List.Item
                      style={{
                        background:
                          globalIndex === 0
                            ? "rgba(255, 215, 0, 0.08)"
                            : globalIndex === 1
                            ? "rgba(192, 192, 192, 0.08)"
                            : globalIndex === 2
                            ? "rgba(205, 127, 50, 0.08)"
                            : "",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        padding: "8px 16px",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {globalIndex === 0 ? (
                              <Badge
                                count={
                                  <CrownOutlined style={{ color: "#FFD700" }} />
                                }
                                offset={[0, 28]}
                              >
                                <Avatar
                                  src={user.userImage}
                                  icon={!user.userImage && <UserOutlined />}
                                  style={{
                                    border: "2px solid gold",
                                    backgroundColor: "#fff8e6",
                                  }}
                                />
                              </Badge>
                            ) : globalIndex === 1 ? (
                              <Badge
                                count={
                                  <TrophyOutlined
                                    style={{ color: "#C0C0C0" }}
                                  />
                                }
                                offset={[0, 28]}
                              >
                                <Avatar
                                  src={user.userImage}
                                  icon={!user.userImage && <UserOutlined />}
                                  style={{
                                    border: "2px solid silver",
                                    backgroundColor: "#f5f5f5",
                                  }}
                                />
                              </Badge>
                            ) : globalIndex === 2 ? (
                              <Badge
                                count={
                                  <StarOutlined style={{ color: "#CD7F32" }} />
                                }
                                offset={[0, 28]}
                              >
                                <Avatar
                                  src={user.userImage}
                                  icon={!user.userImage && <UserOutlined />}
                                  style={{
                                    border: "2px solid #CD7F32",
                                    backgroundColor: "#faf0e6",
                                  }}
                                />
                              </Badge>
                            ) : (
                              <Badge count={globalIndex + 1} offset={[0, 28]}>
                                <Avatar
                                  src={user.userImage}
                                  icon={!user.userImage && <UserOutlined />}
                                  style={{
                                    border: "1px solid #d9d9d9",
                                  }}
                                />
                              </Badge>
                            )}
                          </div>
                        }
                        title={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Text strong>{user.patronName}</Text>
                            {user.membershipType && (
                              <Tooltip
                                title={`Thành viên hạng ${user.membershipType}`}
                              >
                                <span
                                  style={{
                                    marginLeft: 8,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {user.membershipType === "Vàng" ? (
                                    <FireFilled
                                      style={{
                                        color: "#FFD700",
                                        fontSize: "16px",
                                      }}
                                    />
                                  ) : user.membershipType === "Bạc" ? (
                                    <FireFilled
                                      style={{
                                        color: "#C0C0C0",
                                        fontSize: "16px",
                                      }}
                                    />
                                  ) : (
                                    <FireFilled
                                      style={{
                                        color: "#CD7F32",
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        }
                        description={
                          <Text type="secondary">
                            {user.memberPoints || 0} điểm
                          </Text>
                        }
                      />
                    </List.Item>
                  );
                }}
                pagination={{
                  pageSize,
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page),
                  total: topUsers.length,
                  hideOnSinglePage: true,
                  size: "small",
                  simple: true,
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
    </motion.div>
  );
}

export default TopUser;
