import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Skeleton,
  Avatar,
  notification,
} from "antd";
import {
  HistoryOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import borrowReturnService from "/src/services/patron/borrowReturnService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BorrowHistory() {
  const { Text, Title } = Typography;
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  const fetchBorrowHistory = async () => {
    try {
      setLoading(true);
      const response = await borrowReturnService.getBorrowHistory();

      if (response.success) {
        setHistoryData(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải lịch sử mượn sách",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching borrow history:", error);
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

  // Check if book was returned late
  const isReturnedLate = (dueDate, returnDate) => {
    if (!dueDate || !returnDate) return false;
    return new Date(returnDate) > new Date(dueDate);
  };

  const getReturnStatus = (record) => {
    if (!record.returnDate) {
      return <Tag color="processing">Đang mượn</Tag>;
    }

    const late = isReturnedLate(record.dueDate, record.returnDate);

    if (late) {
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          Trả muộn
        </Tag>
      );
    } else {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Đúng hạn
        </Tag>
      );
    }
  };

  const historyColumns = [
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
      title: "Ngày trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => (date ? formatDate(date) : <Tag>Chưa trả</Tag>),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getReturnStatus(record),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
            <HistoryOutlined style={{ marginRight: 8, color: "#722ed1" }} />
            <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
              Lịch sử mượn sách
            </Title>
          </div>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 8,
          background: "linear-gradient(135deg, #ffffff 0%, #f9f0ff 100%)",
        }}
        bodyStyle={{ padding: "12px 16px" }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : historyData.length > 0 ? (
          <Table
            columns={historyColumns}
            dataSource={historyData.map((book, index) => ({
              ...book,
              key: index,
            }))}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
            }}
            rowKey="key"
            size="middle"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text strong style={{ fontSize: 16 }}>
                Bạn chưa mượn quyển sách nào từ thư viện
              </Text>
            }
            style={{ padding: "20px 0" }}
          />
        )}
      </Card>
    </motion.div>
  );
}

export default BorrowHistory;
