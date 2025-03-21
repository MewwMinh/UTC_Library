import { useState, useEffect, useRef } from "react";
import { Card, Typography, notification, Skeleton } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import bookService from "/src/services/patronService.js";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import styles from "/src/styles/books/TechBooks.module.css"; // Sử dụng CSS modules

const { Text } = Typography;

function TechBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    fetchTechBooks();
  }, []);

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

  // Xử lý khi chuột vào vùng sách
  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
      setIsAutoScrolling(false);
    }
  };

  // Xử lý khi chuột ra khỏi vùng sách
  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
      setIsAutoScrolling(true);
    }
  };

  // Xử lý khi component unmount
  useEffect(() => {
    return () => {
      if (swiperRef.current && swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
      }
    };
  }, []);

  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <LaptopOutlined style={{ marginRight: 12 }} />
          Sách chủ đề công nghệ
        </div>
      }
      className={styles.techCard}
      bodyStyle={{ padding: "24px 24px 32px" }}
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
          className={styles.swiperContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={1000}
            className="swiper-tech" // Class mặc định cho Swiper
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
                centeredSlides: false,
                effect: "slide",
              },
              1280: {
                slidesPerView: 5,
                centeredSlides: false,
                effect: "slide",
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book.bookID} className={styles.swiperSlide}>
                <div
                  className={styles.bookCard}
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
                  <div className={styles.bookDetails}>
                    <Text strong className={styles.bookTitle}>
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </Card>
  );
}

export default TechBooks;
