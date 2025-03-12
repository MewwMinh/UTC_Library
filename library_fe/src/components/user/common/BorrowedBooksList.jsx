// src/components/RecentBorrowedBooks.jsx
import { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Tag,
  Skeleton,
  Empty,
  notification,
  Tooltip,
  Space,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import patronService from "/src/services/patronService";

const { Title, Text } = Typography;

function RecentBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

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

  // Get status tag for book
  const getStatusTag = (book) => {
    if (book.returnDate) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã trả
        </Tag>
      );
    }

    const { days, isOverdue } = calculateDaysRemaining(book.dueDate);

    if (isOverdue) {
      return (
        <Tag icon={<WarningOutlined />} color="error">
          Quá hạn {days} ngày
        </Tag>
      );
    } else if (days <= 2) {
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Còn {days} ngày
        </Tag>
      );
    } else {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          Còn {days} ngày
        </Tag>
      );
    }
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

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          <BookOutlined style={{ marginRight: 8 }} />
          Sách mượn gần đây
        </Title>
      }
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginTop: "20px",
      }}
      loading={loading}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : borrowedBooks.length > 0 ? (
        <List
          dataSource={borrowedBooks}
          renderItem={(book) => (
            <List.Item
              key={`${book.bookName}-${book.borrowDate}`}
              style={{
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "8px",
                backgroundColor: book.returnDate
                  ? "#f9f9f9"
                  : calculateDaysRemaining(book.dueDate).isOverdue
                  ? "#fff2f0"
                  : calculateDaysRemaining(book.dueDate).days <= 2
                  ? "#fffbe6"
                  : "#fff",
                border: "1px solid #f0f0f0",
              }}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>
                      {book.bookName}
                    </Text>
                    {getStatusTag(book)}
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size={2}
                    style={{ width: "100%" }}
                  >
                    <Space size={16}>
                      <Tooltip title="Ngày mượn">
                        <Text type="secondary">
                          <CalendarOutlined /> Mượn:{" "}
                          {formatDate(book.borrowDate)}
                        </Text>
                      </Tooltip>
                      <Tooltip title="Hạn trả">
                        <Text
                          type={
                            calculateDaysRemaining(book.dueDate).isOverdue
                              ? "danger"
                              : "secondary"
                          }
                        >
                          <ClockCircleOutlined /> Hạn:{" "}
                          {formatDate(book.dueDate)}
                        </Text>
                      </Tooltip>
                    </Space>
                    {book.returnDate && (
                      <Tooltip title="Ngày trả">
                        <Text type="success">
                          <CheckCircleOutlined /> Đã trả:{" "}
                          {formatDate(book.returnDate)}
                        </Text>
                      </Tooltip>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Bạn chưa mượn sách nào gần đây"
        />
      )}
    </Card>
  );
}

export default RecentBorrowedBooks;
