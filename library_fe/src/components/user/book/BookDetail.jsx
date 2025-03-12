// src/components/BookDetail.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Image,
  Button,
  Modal,
  DatePicker,
  notification,
  Tag,
  Skeleton,
  Space,
  Divider,
  Spin,
} from "antd";
import {
  HeartFilled,
  HeartOutlined,
  CalendarOutlined,
  BookOutlined,
  TranslationOutlined,
  FieldNumberOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import bookService from "/src/services/patronService.js";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

const { Title, Text, Paragraph } = Typography;

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reserveLoading, setReserveLoading] = useState(false);

  // Lấy thông tin sách và kiểm tra yêu thích
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin sách
        const bookResponse = await bookService.getBookDetails(id);

        if (bookResponse.success) {
          setBook(bookResponse.data);

          // Kiểm tra sách có trong danh sách yêu thích không
          const favoriteResponse = await bookService.checkFavorite(id);
          if (favoriteResponse.success) {
            setFavorite(favoriteResponse.isFavorite);
          }
        } else {
          notification.error({
            message: "Lỗi",
            description: bookResponse.message || "Không thể tải thông tin sách",
            placement: "topRight",
          });
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookData();
    }
  }, [id]);

  // Xử lý thêm/xóa yêu thích
  const toggleFavorite = async () => {
    try {
      setFavoriteLoading(true);

      let response;
      if (favorite) {
        response = await bookService.removeFromFavorites(id);
      } else {
        response = await bookService.addToFavorites(id);
      }

      if (response.success) {
        setFavorite(!favorite);
        notification.success({
          message: "Thành công",
          description: response.message,
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thực hiện thao tác",
        placement: "bottomRight",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Hiển thị modal đặt sách
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Xử lý đặt mượn sách
  const handleReserveBook = async () => {
    if (!selectedDate) {
      notification.warning({
        message: "Chưa chọn ngày",
        description: "Vui lòng chọn ngày lấy sách",
        placement: "topRight",
      });
      return;
    }

    try {
      setReserveLoading(true);
      const response = await bookService.reserveBook(
        id,
        selectedDate.format("YYYY-MM-DD")
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message,
          placement: "topRight",
        });
        setIsModalVisible(false);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error reserving book:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể đặt mượn sách",
        placement: "topRight",
      });
    } finally {
      setReserveLoading(false);
    }
  };

  // Xử lý huỷ modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  // Disable các ngày không hợp lệ (ngày trước hôm nay)
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Phần hiển thị khi đang tải
  if (loading) {
    return (
      <Card style={{ borderRadius: 12, overflow: "hidden" }}>
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  // Phần hiển thị khi không tìm thấy sách
  if (!book) {
    return (
      <Card style={{ borderRadius: 12, textAlign: "center", padding: 24 }}>
        <Title level={3}>Không tìm thấy thông tin sách</Title>
        <Text type="secondary">
          Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </Text>
      </Card>
    );
  }

  return (
    <Card style={{ borderRadius: 12, overflow: "hidden" }}>
      {/* Banner phía trên */}
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          padding: "24px",
          marginTop: "-24px",
          marginLeft: "-24px",
          marginRight: "-24px",
          marginBottom: "24px",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Title level={2} style={{ color: "white", margin: 0 }}>
          Chi tiết sách
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Ảnh bìa sách */}
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <div style={{ textAlign: "center" }}>
            <Image
              src={book.coverImage || "/placeholder-book.jpg"}
              alt={book.bookName}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              fallback="/placeholder-book.jpg"
            />

            {/* Nút yêu thích */}
            <Button
              type="text"
              size="large"
              onClick={toggleFavorite}
              loading={favoriteLoading}
              icon={
                favorite ? (
                  <HeartFilled style={{ color: "#ff4d4f", fontSize: 24 }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 24 }} />
                )
              }
              style={{ marginTop: 16 }}
            >
              {favorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
            </Button>
          </div>
        </Col>

        {/* Thông tin sách */}
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <Title level={2} style={{ marginTop: 0, marginBottom: 16 }}>
            {book.bookName}
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                <BookOutlined /> Tác giả:
              </Text>
              <Text>{book.author}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                <FieldNumberOutlined /> ISBN:
              </Text>
              <Text>{book.isbn}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                <CalendarOutlined /> Năm xuất bản:
              </Text>
              <Text>{book.publicationYear}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                <TranslationOutlined /> Ngôn ngữ:
              </Text>
              <Text>{book.language}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                <FileTextOutlined /> Số trang:
              </Text>
              <Text>{book.pages}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                Khổ sách:
              </Text>
              <Text>{book.format}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                Danh mục:
              </Text>
              <Text>{book.ddcName}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ marginRight: 8 }}>
                Tình trạng:
              </Text>
              <Space>
                <Tag color={book.availableCopies > 0 ? "success" : "error"}>
                  {book.availableCopies > 0 ? "Còn sách" : "Hết sách"}
                </Tag>
                <Text type="secondary">
                  ({book.availableCopies}/{book.totalCopies} bản)
                </Text>
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Mô tả sách */}
          <div>
            <Title level={4}>Mô tả</Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
              {book.description || "Không có mô tả."}
            </Paragraph>
          </div>

          <Divider />

          {/* Nút đặt mượn sách */}
          <Button
            type="primary"
            size="large"
            onClick={showModal}
            disabled={book.availableCopies <= 0}
            style={{ marginTop: 16, minWidth: 150 }}
          >
            {book.availableCopies > 0 ? "Đặt mượn sách" : "Hết sách"}
          </Button>
        </Col>
      </Row>

      {/* Modal đặt mượn sách */}
      <Modal
        title={<Title level={4}>Đặt mượn sách</Title>}
        open={isModalVisible}
        onOk={handleReserveBook}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        confirmLoading={reserveLoading}
      >
        <Spin spinning={reserveLoading}>
          <div style={{ padding: "16px 0" }}>
            <Title level={5} style={{ margin: 0 }}>
              {book.bookName}
            </Title>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 16 }}
            >
              Tác giả: {book.author}
            </Text>

            <Divider />

            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Chọn ngày lấy sách:
            </Text>
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={(date) => setSelectedDate(date)}
              locale={locale}
              placeholder="Chọn ngày"
            />
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              Lưu ý: Bạn có thể đến lấy sách trong vòng 5 ngày kể từ ngày đã
              chọn
            </Text>
          </div>
        </Spin>
      </Modal>
    </Card>
  );
}

export default BookDetail;
