import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Empty,
  Skeleton,
  Avatar,
  Tag,
  notification,
} from "antd";
import {
  WarningOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import borrowReturnService from "/src/services/patron/borrowReturnService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ListCloseToDueBook() {
  const { Text, Title } = Typography;
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNearAndOverDueBooks();
  }, []);

  const fetchNearAndOverDueBooks = async () => {
    try {
      setLoading(true);
      const response = await borrowReturnService.getNearAndOverDueBooks();

      if (response.success) {
        setDueSoonBooks(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách sách sắp đến hạn",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching near and over due books:", error);
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

  const getStatusTag = (dueDate) => {
    const remainingDays = calculateRemainingDays(dueDate);

    if (remainingDays < 0) {
      return (
        <Tag color="error" icon={<ClockCircleOutlined />}>
          Quá hạn {Math.abs(remainingDays)} ngày
        </Tag>
      );
    } else if (remainingDays <= 3) {
      return (
        <Tag color="warning" icon={<ClockCircleOutlined />}>
          Sắp hết hạn ({remainingDays} ngày)
        </Tag>
      );
    } else {
      return (
        <Tag color="processing" icon={<ClockCircleOutlined />}>
          Còn {remainingDays} ngày
        </Tag>
      );
    }
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
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "dueDate",
      key: "status",
      render: (date) => getStatusTag(date),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
            <WarningOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
            <Title level={4} style={{ margin: 0, color: "#fa8c16" }}>
              Sách sắp đến hạn
            </Title>
          </div>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 8,
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #fff7e6 100%)",
        }}
        bodyStyle={{ padding: "12px 16px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : dueSoonBooks.length > 0 ? (
          <Table
            columns={columns}
            dataSource={dueSoonBooks.map((book, index) => ({
              ...book,
              key: index,
            }))}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              total: dueSoonBooks.length,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} cuốn sách`,
              hideOnSinglePage: dueSoonBooks.length <= pageSize,
            }}
            rowKey="key"
            size="middle"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text strong style={{ fontSize: 16 }}>
                Bạn không có sách nào sắp đến hạn trả
              </Text>
            }
            style={{ padding: "20px 0" }}
          />
        )}
      </Card>
    </motion.div>
  );
}

export default ListCloseToDueBook;
