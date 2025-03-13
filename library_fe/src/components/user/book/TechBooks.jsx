// src/components/BookSearch/TechBooks.jsx
import { useState, useEffect, useRef } from "react";
import { Card, Typography, notification, Skeleton, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, LaptopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bookService from "/src/services/patronService.js";
import styles from "/src/styles/books/TechBooks.module.css";

const { Title, Text } = Typography;

function TechBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Auto scroll effect
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollIntervalRef = useRef(null);

  useEffect(() => {
    fetchTechBooks();
  }, []);

  // Setup auto-scrolling when books are loaded
  useEffect(() => {
    if (books.length > 0 && isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const containerWidth = scrollContainerRef.current.scrollWidth;
          const viewportWidth = scrollContainerRef.current.clientWidth;
          const maxScrollPosition = containerWidth - viewportWidth;

          // Calculate new scroll position
          let newPosition = scrollPosition + 2; // Scroll 2px at a time for smooth effect

          // Reset to beginning when reaching the end
          if (newPosition >= maxScrollPosition) {
            newPosition = 0;
          }

          scrollContainerRef.current.scrollLeft = newPosition;
          setScrollPosition(newPosition);
        }
      }, 50); // Adjust timing for smoother or faster scroll
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [books, scrollPosition, isAutoScrolling]);

  const fetchTechBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getTechBooks();

      if (response.success) {
        setBooks(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải sách công nghệ",
        });
      }
    } catch (error) {
      console.error("Error fetching tech books:", error);
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
      setIsAutoScrolling(false); // Pause auto-scrolling when manual scrolling
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
      setScrollPosition(scrollContainerRef.current.scrollLeft - 240);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false); // Pause auto-scrolling when manual scrolling
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
      setScrollPosition(scrollContainerRef.current.scrollLeft + 240);
    }
  };

  // Handle mouse events for the scroll container
  const handleMouseEnter = () => {
    setIsAutoScrolling(false); // Pause auto-scrolling on hover
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true); // Resume auto-scrolling when mouse leaves
    setScrollPosition(scrollContainerRef.current?.scrollLeft || 0);
  };

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          <LaptopOutlined style={{ marginRight: 8, color: "#1677ff" }} />
          Sách chủ đề công nghệ
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
      className={styles.techCard}
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
        <div
          ref={scrollContainerRef}
          className={styles.scrollContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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

export default TechBooks;
