import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Empty,
  Skeleton,
  Avatar,
  notification,
  Spin,
  Button,
  Tag,
  Space,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import borrowReturnService from "/src/services/patron/borrowReturnService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ListBorrowingBook() {
  const { Text, Title } = Typography;
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowingBooks();
  }, []);

  const fetchBorrowingBooks = async () => {
    try {
      setLoading(true);
      const response = await borrowReturnService.getBorrowingBooks();

      if (response.success) {
        setBorrowedBooks(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách sách đang mượn",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching borrowing books:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date string to display in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Calculate remaining days until due date
  const calculateRemainingDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (remainingDays) => {
    if (remainingDays < 0) return "error";
    if (remainingDays <= 3) return "warning";
    return "success";
  };

  const columns = [
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Avatar
            shape="square"
            size={64}
            src={record.bookImage}
            icon={!record.bookImage && <BookOutlined />}
            style={{
              marginRight: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "4px",
            }}
          />
          <div>
            <Text strong style={{ display: "block", color: "#1890ff" }}>
              {text}
            </Text>
            {record.author && (
              <Text type="secondary" style={{ fontSize: "13px" }}>
                {record.author}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Ngày mượn
        </span>
      ),
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => <Text>{formatDate(date)}</Text>,
      width: 140,
    },
    {
      title: (
        <span>
          <ClockCircleOutlined /> Ngày đến hạn
        </span>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => {
        const remainingDays = calculateRemainingDays(date);
        const status = getDueDateStatus(remainingDays);

        return (
          <Space direction="vertical" size={2}>
            <Text>{formatDate(date)}</Text>
            <Tag
              color={status}
              style={{
                borderRadius: "12px",
                padding: "0 8px",
                marginRight: 0,
              }}
            >
              {remainingDays <= 0 ? "Đã quá hạn" : `Còn ${remainingDays} ngày`}
            </Tag>
          </Space>
        );
      },
      width: 140,
    },
  ];

  // Simple centered header
  const cardTitle = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 0",
        width: "100%",
        backgroundColor: "#1890ff",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      <BookOutlined style={{ fontSize: 24, color: "#fff", marginRight: 12 }} />
      <Title level={3} style={{ margin: 0, color: "#fff" }}>
        Sách đang mượn
      </Title>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={cardTitle}
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 12,
          height: "100%",
          background: "#ffffff",
        }}
        styles={{
          body: { padding: "16px" },
          header: { borderBottom: "1px solid #f0f0f0" },
        }}
      >
        <div style={{ position: "relative", minHeight: "200px" }}>
          {loading ? (
            <div style={{ padding: "20px 0" }}>
              <Spin spinning={true}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Spin>
            </div>
          ) : borrowedBooks.length > 0 ? (
            <Table
              columns={columns}
              dataSource={borrowedBooks.map((book, index) => ({
                ...book,
                key: index,
              }))}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: (page) => setCurrentPage(page),
                total: borrowedBooks.length,
                showSizeChanger: false,
                showTotal: (total) => `Tổng ${total} cuốn sách`,
                hideOnSinglePage: borrowedBooks.length <= pageSize,
              }}
              rowKey="key"
              size="middle"
              bordered={false}
              onRow={(record) => ({
                style: {
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.backgroundColor = "#f0f7ff";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                },
                onClick: () => {
                  navigate(`/user/bookDetails/${record.bookID}`);
                },
              })}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ padding: "20px 0" }}>
                  <Text strong style={{ fontSize: 16 }}>
                    Bạn đang không mượn cuốn sách nào
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Button
                      type="primary"
                      onClick={() => navigate("/user/searchBooks")}
                    >
                      Tìm sách
                    </Button>
                  </div>
                </div>
              }
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
