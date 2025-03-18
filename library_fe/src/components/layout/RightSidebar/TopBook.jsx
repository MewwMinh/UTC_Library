import { useState, useEffect, useRef } from "react";
import { Card, Skeleton, Empty, Typography, notification } from "antd";
import { FireFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import userService from "/src/services/userService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import component styles
import "./TopBook.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function TopBook() {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopBooks();
  }, []);

  const fetchTopBooks = async () => {
    try {
      setLoading(true);
      const response = await userService.getTopBooks();

      if (response.success) {
        setTopBooks(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách sách phổ biến",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching top books:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankStyles = (index) => {
    if (index === 0) {
      return {
        barStyle: {
          background: "#FFD700", // Gold
        },
        rankColor: "#FFD700",
      };
    } else if (index === 1) {
      return {
        barStyle: {
          background: "#C0C0C0", // Silver
        },
        rankColor: "#C0C0C0",
      };
    } else if (index === 2) {
      return {
        barStyle: {
          background: "#CD7F32", // Bronze
        },
        rankColor: "#CD7F32",
      };
    } else {
      return {
        barStyle: {
          background: "#1677ff", // Default
        },
        rankColor: "#999",
      };
    }
  };

  const renderBookCard = (book, index) => {
    const styles = getRankStyles(index);
    const defaultCover = "https://i.imgur.com/uDYejhJ.png"; // Placeholder for books without image

    const navigateToBookDetails = () => {
      navigate(`/user/bookDetails/${book.bookID}`);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        style={{
          padding: "6px 0",
          width: "100%",
        }}
      >
        <div
          className="book-card book-card-hover"
          onClick={navigateToBookDetails}
        >
          <div className="book-card-bar" style={styles.barStyle} />

          <div className="book-rank-number" style={{ color: styles.rankColor }}>
            {index + 1}
          </div>

          <img
            src={book.bookImage || defaultCover}
            alt={book.bookName}
            className="book-cover"
          />

          <div className="book-info">
            <div className="book-name-container">
              <Text strong className="book-name">
                {book.bookName}
              </Text>
            </div>

            <div className="book-stats">
              <FireFilled className="borrow-icon" />
              <Text type="secondary" className="borrow-count">
                {book.borrowedTimesCount} lượt mượn
              </Text>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card
      title={
        <Title level={4} className="top-book-title">
          Sách được mượn nhiều
        </Title>
      }
      styles={{
        header: {
          background: "#1677ff",
          color: "white",
          borderBottom: "none",
          borderRadius: "12px 12px 0 0",
          padding: "16px",
          marginTop: "-1px",
          marginLeft: "-1px",
          marginRight: "-1px",
        },
        body: {
          flex: 1,
          overflow: "hidden",
          padding: "16px 12px 24px 12px",
        },
      }}
      className="top-book-card"
    >
      {loading ? (
        <div className="loading-container">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              active
              avatar={{ size: 56, shape: "square" }}
              paragraph={{ rows: 1, width: "60%" }}
              style={{ padding: "0 10px" }}
            />
          ))}
        </div>
      ) : topBooks.length === 0 ? (
        <Empty
          description="Không có dữ liệu"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 60 }}
        />
      ) : (
        <div style={{ height: "100%" }}>
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 15000, // 15 seconds
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            style={{ paddingBottom: "25px" }}
          >
            {/* Chia danh sách sách thành 2 trang, mỗi trang 5 cuốn */}
            {[0, 5].map((startIndex) => (
              <SwiperSlide key={`slide-${startIndex}`}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "10px 0",
                  }}
                >
                  {topBooks
                    .slice(startIndex, startIndex + 5)
                    .map((book, idx) => (
                      <div key={`book-${startIndex + idx}-${book.id || idx}`}>
                        {renderBookCard(book, startIndex + idx)}
                      </div>
                    ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </Card>
  );
}

export default TopBook;
