// src/components/librarian/book/LibrarianBookDetail.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Image,
  Tag,
  Space,
  Divider,
  Skeleton,
  notification,
  Avatar,
  Badge,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TranslationOutlined,
  FieldNumberOutlined,
  FileTextOutlined,
  RiseOutlined,
  SolutionOutlined,
  CodeOutlined,
  FormOutlined,
} from "@ant-design/icons";
import bookService from "/src/services/librarian/bookService.js";
import { useParams } from "react-router-dom";
import styles from "/src/styles/books/BookDetail.module.css";

const { Title, Text, Paragraph } = Typography;

function LibrarianBookDetail() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookId } = useParams();

  useEffect(() => {
    fetchBookData();
  }, [bookId]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookDetail(bookId);

      if (response.success) {
        setBook(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải thông tin sách",
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

  if (loading) {
    return (
      <Card className={styles.bookCard}>
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!book) {
    return (
      <Card
        className={styles.bookCard}
        style={{ textAlign: "center", padding: 24 }}
      >
        <Title level={3}>Không tìm thấy thông tin sách</Title>
        <Text type="secondary">
          Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </Text>
      </Card>
    );
  }

  // Xác định phân loại sách
  const getBookTypeTag = (bookType) => {
    if (!bookType) return null;

    switch (bookType.toLowerCase()) {
      case "giáo trình":
        return <Tag color="gold">Giáo trình</Tag>;
      case "tham khảo":
        return <Tag color="blue">Tham khảo</Tag>;
      case "sách ngoại văn":
        return <Tag color="purple">Ngoại văn</Tag>;
      default:
        return <Tag color="green">{bookType}</Tag>;
    }
  };

  return (
    <Card className={styles.bookCard} variant="borderless">
      {/* Banner phía trên */}
      <div className={styles.bookBanner}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="middle">
              <Avatar
                size={64}
                icon={<BookOutlined />}
                className={styles.bookAvatar}
              />
              <Title level={2} style={{ color: "white", margin: 0 }}>
                Thông tin sách
              </Title>
            </Space>
          </Col>
          <Col>
            <Badge
              count={book.availableCopies > 0 ? "Còn sách" : "Hết sách"}
              style={{
                backgroundColor:
                  book.availableCopies > 0 ? "#52c41a" : "#f5222d",
                fontSize: "14px",
                padding: "0 10px",
              }}
            />
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]} className={styles.bookContent}>
        {/* Ảnh bìa sách */}
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <div className={styles.bookCoverContainer}>
            <div className={styles.bookCoverWrapper}>
              <Image
                src={book.coverImage || "/placeholder-book.jpg"}
                alt={book.bookName}
                className={styles.bookCover}
                fallback="/placeholder-book.jpg"
                preview={false}
              />
            </div>
            <div className={styles.bookStats}>
              <div className={styles.statItem}>
                <Title level={5}>Tổng số</Title>
                <div className={styles.statValue}>{book.totalCopies}</div>
              </div>
              <div className={styles.statItem}>
                <Title level={5}>Có sẵn</Title>
                <div className={styles.statValue}>{book.availableCopies}</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Thông tin sách */}
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <div className={styles.bookInfo}>
            <Title level={2} className={styles.bookTitle}>
              {book.bookName}
              {getBookTypeTag(book.bookType)}
            </Title>

            <div className={styles.bookMeta}>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <SolutionOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Tác giả</Text>
                    <div className={styles.infoValue}>{book.author}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <FieldNumberOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">ISBN</Text>
                    <div className={styles.infoValue}>{book.isbn}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <CalendarOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Năm xuất bản</Text>
                    <div className={styles.infoValue}>
                      {book.publicationYear}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <TranslationOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Ngôn ngữ</Text>
                    <div className={styles.infoValue}>{book.language}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <FileTextOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Số trang</Text>
                    <div className={styles.infoValue}>{book.pageCount}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <FormOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Khổ sách</Text>
                    <div className={styles.infoValue}>{book.format}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <CodeOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Danh mục</Text>
                    <div className={styles.infoValue}>{book.ddcCode}</div>
                  </div>
                </Col>
                <Col xs={24} md={12} className={styles.infoItem}>
                  <RiseOutlined className={styles.infoIcon} />
                  <div>
                    <Text type="secondary">Tình trạng</Text>
                    <div className={styles.infoValue}>
                      <Tag
                        color={book.availableCopies > 0 ? "success" : "error"}
                      >
                        {book.availableCopies > 0 ? "Còn sách" : "Hết sách"}
                      </Tag>
                      <Text type="secondary">
                        ({book.availableCopies}/{book.totalCopies})
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: "24px 0", borderColor: "#f0f0f0" }} />

            {/* Mô tả sách */}
            <div className={styles.bookDescription}>
              <Title level={4}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Mô tả
              </Title>
              <Paragraph className={styles.description}>
                {book.description || "Không có mô tả."}
              </Paragraph>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default LibrarianBookDetail;
