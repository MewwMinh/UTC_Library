import { useState, useEffect, useRef } from "react";
import { Card, Typography, notification, Skeleton, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bookService from "/src/services/patronService.js";
import styles from "/src/styles/books/SuggestedBooks.module.css";

const { Title, Text } = Typography;

function SuggestedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestedBooks();
  }, []);

  const fetchSuggestedBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getSuggestedBooks();

      if (response.success) {
        setBooks(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải sách gợi ý",
        });
      }
    } catch (error) {
      console.error("Error fetching suggested books:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          <FireOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
          Sách gợi ý cho bạn
        </Title>
      }
      extra={
        <div className={styles.navigationControls}>
          <Tooltip title="Cuộn sang trái">
            <div onClick={scrollLeft} className={styles.navigationButton}>
              <LeftOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Cuộn sang phải">
            <div onClick={scrollRight} className={styles.navigationButton}>
              <RightOutlined />
            </div>
          </Tooltip>
        </div>
      }
      className={styles.suggestedCard}
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <Card key={index} className={styles.skeletonCard}>
              <Skeleton.Image style={{ width: 160, height: 200 }} active />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                title={{ width: "80%" }}
              />
            </Card>
          ))}
        </div>
      ) : (
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          {books.map((book) => (
            <Card
              key={book.bookID}
              hoverable
              className={styles.bookCard}
              bodyStyle={{ padding: 12 }}
              onClick={() => navigate(`/user/bookDetails/${book.bookID}`)}
            >
              <div className={styles.bookCover}>
                <img
                  alt={book.bookName}
                  src={book.bookImage || "/images/book-placeholder.png"}
                  className={styles.bookImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/book-placeholder.png";
                  }}
                />
              </div>
              <div className={styles.bookCardBody}>
                <Text
                  strong
                  ellipsis={{ rows: 2 }}
                  className={styles.bookTitle}
                >
                  {book.bookName}
                </Text>
                <Text
                  type="secondary"
                  ellipsis={{ rows: 1 }}
                  className={styles.bookAuthor}
                >
                  {book.bookAuthor}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}

export default SuggestedBooks;
