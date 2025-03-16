import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Empty,
  Skeleton,
  Avatar,
  Badge,
  notification,
} from "antd";
import { BookOutlined } from "@ant-design/icons";
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
          onClick={() => navigate(`/user/bookDetails/${record.bookID}`)}
        >
          <Avatar
            shape="square"
            size={64}
            src={record.bookImage}
            icon={!record.bookImage && <BookOutlined />}
            style={{ marginRight: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
          <div>
            <Text strong style={{ display: "block", color: "#1890ff" }}>
              {text}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => {
        const remainingDays = calculateRemainingDays(date);
        return (
          <div>
            <Text>{formatDate(date)}</Text>
            <br />
            <Badge
              status={remainingDays <= 3 ? "warning" : "success"}
              text={
                <Text
                  type={remainingDays <= 3 ? "warning" : "success"}
                  style={{ fontSize: 12 }}
                >
                  {remainingDays <= 0
                    ? "Đã quá hạn"
                    : `Còn ${remainingDays} ngày`}
                </Text>
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              Sách đang mượn
            </Title>
          </div>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 8,
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
        }}
        bodyStyle={{ padding: "12px 16px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
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
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text strong style={{ fontSize: 16 }}>
                Bạn đang không mượn cuốn sách nào
              </Text>
            }
            style={{ padding: "20px 0" }}
          />
        )}
      </Card>
    </motion.div>
  );
}
