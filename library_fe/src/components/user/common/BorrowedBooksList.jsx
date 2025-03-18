// src/components/RecentBorrowedBooks.jsx
import { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Skeleton,
  Empty,
  notification,
  Tooltip,
  Avatar,
  Space,
  Badge,
  theme,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import patronService from "/src/services/patronService";

const { Title, Text } = Typography;
const { useToken } = theme;

function RecentBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { token } = useToken();

  // Format date string to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate days remaining or overdue
  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return { days: 0, isOverdue: false };

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: Math.abs(diffDays),
      isOverdue: diffDays < 0,
    };
  };

  // Navigate to book details page
  const goToBookDetails = (bookID) => {
    navigate(`/user/bookDetails/${bookID}`);
  };

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        const response = await patronService.getRecentBorrowedBooks();

        if (response.success) {
          setBorrowedBooks(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải danh sách sách đã mượn",
          });
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [isAuthenticated]);

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

  const itemVariants = {
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
    <Card
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginTop: "20px",
      }}
      loading={loading}
    >
      <div
        style={{
          position: "relative",
          paddingBottom: "12px",
          marginBottom: "20px",
        }}
      >
        <Space align="center">
          <BookOutlined
            style={{ fontSize: "22px", color: token.colorPrimary }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Sách mượn gần đây
          </Title>
        </Space>
        <div
          style={{
            position: "absolute",
            height: "3px",
            width: "60px",
            background: token.colorPrimary,
            bottom: 0,
            left: 0,
            borderRadius: "3px",
          }}
        />
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : borrowedBooks.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <List
            dataSource={borrowedBooks}
            renderItem={(book) => {
              const { isOverdue, days } = calculateDaysRemaining(book.dueDate);
              return (
                <motion.div variants={itemVariants}>
                  <Badge.Ribbon
                    text={
                      book.returnDate
                        ? "Đã trả"
                        : isOverdue
                        ? `Quá hạn ${days} ngày`
                        : `Còn ${days} ngày`
                    }
                    color={
                      book.returnDate
                        ? "green"
                        : isOverdue
                        ? "red"
                        : days <= 2
                        ? "orange"
                        : "blue"
                    }
                  >
                    <Card
                      hoverable
                      style={{
                        marginBottom: 16,
                        borderRadius: 8,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        backgroundColor: book.returnDate
                          ? "#f9f9f9"
                          : isOverdue
                          ? "#fff2f0"
                          : days <= 2
                          ? "#fffbe6"
                          : "#fff",
                      }}
                      onClick={() => goToBookDetails(book.bookID)}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          shape="square"
                          size={64}
                          src={book.bookImage}
                          style={{
                            marginRight: 16,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid #f0f0f0",
                          }}
                          icon={!book.bookImage && <BookOutlined />}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong style={{ fontSize: "16px" }}>
                              {book.bookName}
                            </Text>
                          </div>
                          <Space wrap size={16}>
                            <Tooltip title="Ngày mượn">
                              <Text type="secondary">
                                <CalendarOutlined />{" "}
                                {formatDate(book.borrowDate)}
                              </Text>
                            </Tooltip>
                            <Tooltip title="Hạn trả">
                              <Text
                                type={isOverdue ? "danger" : "secondary"}
                                style={isOverdue ? { fontWeight: "bold" } : {}}
                              >
                                <ClockCircleOutlined />{" "}
                                {formatDate(book.dueDate)}
                              </Text>
                            </Tooltip>
                            {book.returnDate && (
                              <Tooltip title="Ngày trả">
                                <Text type="success">
                                  <CheckCircleOutlined />{" "}
                                  {formatDate(book.returnDate)}
                                </Text>
                              </Tooltip>
                            )}
                          </Space>
                        </div>
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </motion.div>
              );
            }}
          />
        </motion.div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div style={{ padding: "20px 0" }}>
              <Text style={{ fontSize: "16px" }}>
                Bạn chưa mượn sách nào gần đây
              </Text>
              <div style={{ marginTop: "12px" }}>
                <Text type="secondary">
                  Khi bạn mượn sách, chúng sẽ hiển thị ở đây
                </Text>
              </div>
            </div>
          }
        />
      )}
    </Card>
  );
}

export default RecentBorrowedBooks;
