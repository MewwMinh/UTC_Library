import { useState, useEffect } from "react";
import {
  Card,
  List,
  Avatar,
  Skeleton,
  Tooltip,
  Empty,
  Typography,
  notification,
  theme,
} from "antd";
import { FireFilled } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import userService from "/src/services/userService";

const { Title, Text } = Typography;

function TopBook() {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { token } = theme.useToken();

  useEffect(() => {
    fetchTopBooks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) =>
        prevPage < Math.ceil(topBooks.length / pageSize) ? prevPage + 1 : 1
      );
    }, 10000); // Automatically change page every 10 seconds

    return () => clearInterval(interval);
  }, [topBooks.length]);

  const fetchTopBooks = async () => {
    try {
      setLoading(true);
      const response = await userService.getTopBooks();

      if (response.success) {
        setTopBooks(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách sách phổ biến",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching top books:", error);
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

  // Không cần hàm renderRankBadge nữa vì chúng ta chỉ hiển thị số

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
            Sách được mượn nhiều nhất
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
        ) : topBooks.length === 0 ? (
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
                dataSource={topBooks.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                renderItem={(book, index) => {
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
                          <Avatar
                            style={{
                              backgroundColor:
                                globalIndex === 0
                                  ? "#FFD700" // Gold
                                  : globalIndex === 1
                                  ? "#C0C0C0" // Silver
                                  : globalIndex === 2
                                  ? "#CD7F32" // Bronze
                                  : "#1677ff", // Primary blue for others
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              color: "#fff",
                            }}
                          >
                            {globalIndex + 1}
                          </Avatar>
                        }
                        title={
                          <Tooltip title={book.bookName}>
                            <Text
                              strong
                              ellipsis={{ tooltip: book.bookName }}
                              style={{ maxWidth: "calc(100% - 20px)" }}
                            >
                              {book.bookName}
                            </Text>
                          </Tooltip>
                        }
                        description={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Text type="secondary">
                              <Tooltip title="Số lượt mượn">
                                <span style={{ marginRight: 4 }}>
                                  <FireFilled
                                    style={{
                                      color: "#ff4d4f",
                                      fontSize: "12px",
                                      marginRight: 4,
                                    }}
                                  />
                                  {book.borrowedTimesCount} lượt mượn
                                </span>
                              </Tooltip>
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
                pagination={{
                  pageSize,
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page),
                  total: topBooks.length,
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

export default TopBook;
