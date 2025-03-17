import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Empty,
  Card,
  Typography,
  notification,
  Spin,
  Tooltip,
  Drawer,
  Descriptions,
  Space,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import orderService from "/src/services/patron/orderService";
import "./order.css";

const { Text } = Typography;

const BookOrder = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const fetchBookReservations = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllBookReservations();
      if (response.success) {
        setBookings(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách đặt sách",
        });
      }
    } catch (error) {
      console.error("Error fetching book reservations:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookReservations();
  }, []);

  const statusColors = {
    "Đang đợi xử lý": "processing",
    "Đã hủy đặt sách": "default",
    "Đồng ý": "success",
    "Từ chối": "error",
  };

  const statusIcons = {
    "Đang đợi xử lý": <ClockCircleOutlined />,
    "Đã hủy đặt sách": <CloseCircleOutlined />,
    "Đồng ý": <CheckCircleOutlined />,
    "Từ chối": <ExclamationCircleOutlined />,
  };

  const showDetails = (record) => {
    setCurrentBook(record);
    setDetailVisible(true);
  };

  const handleCancelBooking = async () => {
    try {
      const response = await orderService.cancelBookReservation(
        selectedBook.reservationID
      );
      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message,
        });
        setModalVisible(false);
        // Refetch to update the list
        fetchBookReservations();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể hủy đặt sách",
        });
      }
    } catch (error) {
      console.error("Error canceling book reservation:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    }
  };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text) => (
        <Text strong style={{ color: "#1890ff" }}>
          <BookOutlined style={{ marginRight: 8 }} />
          {text}
        </Text>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "reservationDate",
      key: "reservationDate",
      render: (date) => (
        <Tooltip title={`Đặt ngày: ${date}`}>
          <span>
            <CalendarOutlined style={{ marginRight: 5 }} />
            {date}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày lấy dự kiến",
      dataIndex: "pickupDate",
      key: "pickupDate",
      render: (date) => (
        <Tooltip title={`Dự kiến lấy ngày: ${date}`}>
          <span>
            <ShopOutlined style={{ marginRight: 5 }} />
            {date}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag icon={statusIcons[status]} color={statusColors[status]}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "Đang đợi xử lý", value: "Đang đợi xử lý" },
        { text: "Đồng ý", value: "Đồng ý" },
        { text: "Từ chối", value: "Từ chối" },
        { text: "Đã hủy đặt sách", value: "Đã hủy đặt sách" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => showDetails(record)}
          >
            Chi tiết
          </Button>
          {record.status === "Đang đợi xử lý" && (
            <Button
              danger
              type="link"
              onClick={() => {
                setSelectedBook(record);
                setModalVisible(true);
              }}
            >
              Hủy đặt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={4} style={{ margin: 0, color: "#2c6e49" }}>
            <BookOutlined style={{ marginRight: 8 }} />
            Đặt mượn sách
          </Typography.Title>
          <Text style={{ color: "#4c956c" }}>
            Quản lý và theo dõi các sách bạn đã đặt mượn
          </Text>
        </div>
      }
      headStyle={{
        background: "linear-gradient(135deg, #d8f3dc 0%, #95d5b2 100%)",
        padding: "16px",
        borderBottom: "1px solid #b7e4c7",
      }}
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fefefe",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải danh sách đặt sách...</p>
        </div>
      ) : bookings.length > 0 ? (
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="reservationID"
          pagination={{ pageSize: 5 }}
          rowClassName={(record) => {
            if (record.status === "Đang đợi xử lý") return "row-processing";
            if (record.status === "Đồng ý") return "row-success";
            if (record.status === "Từ chối") return "row-rejected";
            return "";
          }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              Bạn chưa đặt mượn cuốn sách nào.
              <br />
              Hãy tìm kiếm và đặt mượn sách để học tập và nghiên cứu!
            </span>
          }
        />
      )}

      <Modal
        title={
          <div>
            <BookOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
            Xác nhận hủy đặt sách
          </div>
        }
        open={modalVisible}
        onOk={handleCancelBooking}
        onCancel={() => setModalVisible(false)}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn hủy đặt cuốn sách{" "}
          <b>{selectedBook?.bookName}</b> không?
        </p>
        <p>Lưu ý: Hành động này không thể hoàn tác sau khi xác nhận.</p>
      </Modal>

      <Drawer
        title={
          <span>
            <BookOutlined style={{ marginRight: 8 }} />
            Chi tiết đặt mượn sách
          </span>
        }
        placement="right"
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        width={480}
      >
        {currentBook && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên sách">
              <Text strong>{currentBook.bookName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt mượn">
              {currentBook.reservationID}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {currentBook.reservationDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày lấy dự kiến">
              {currentBook.pickupDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">
              {currentBook.expirationDate}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                icon={statusIcons[currentBook.status]}
                color={statusColors[currentBook.status]}
              >
                {currentBook.status}
              </Tag>
            </Descriptions.Item>
            {currentBook.reason && (
              <Descriptions.Item label="Lý do">
                {currentBook.reason}
              </Descriptions.Item>
            )}
            {currentBook.acceptedBy && (
              <Descriptions.Item label="Người xử lý">
                {currentBook.acceptedBy}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>

      {/* CSS styles applied via className in Table's rowClassName prop */}
    </Card>
  );
};

export default BookOrder;
