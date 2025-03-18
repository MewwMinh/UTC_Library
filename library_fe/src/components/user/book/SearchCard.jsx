// src/components/BookSearch/SearchCard.jsx
import { useState, useEffect } from "react";
import {
  Input,
  Card,
  List,
  Skeleton,
  Empty,
  Pagination,
  notification,
  Typography,
  Badge,
} from "antd";
import { SearchOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import bookService from "/src/services/patronService.js";
import styles from "/src/styles/books/SearchCard.module.css";

const { Title, Text } = Typography;

function SearchCard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allResults, setAllResults] = useState([]); // Lưu tất cả kết quả
  const [displayedResults, setDisplayedResults] = useState([]); // Kết quả hiển thị trên trang hiện tại
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc query parameter khi component được tải
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryTerm = queryParams.get("q");

    if (queryTerm) {
      setSearchTerm(queryTerm);
      handleSearch(queryTerm);
    }
  }, [location.search]);

  // Khi có kết quả tìm kiếm hoặc trang thay đổi, cập nhật dữ liệu hiển thị
  useEffect(() => {
    updateDisplayedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResults, currentPage]);

  // Cập nhật dữ liệu hiển thị dựa trên trang hiện tại
  const updateDisplayedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedResults(allResults.slice(startIndex, endIndex));
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setAllResults([]);
      setDisplayedResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await bookService.searchBooks(value.trim());

      if (response.success) {
        setAllResults(response.data);
        setCurrentPage(1); // Reset về trang đầu tiên khi có kết quả tìm kiếm mới
      } else {
        notification.error({
          message: "Lỗi tìm kiếm",
          description: response.message,
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      notification.error({
        message: "Lỗi tìm kiếm",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Không cần gọi API lại, chỉ cần cập nhật dữ liệu hiển thị từ kết quả đã có
    // updateDisplayedData() sẽ được gọi tự động qua useEffect
  };

  // Cập nhật URL khi tìm kiếm từ trang này
  const handleLocalSearch = (value) => {
    setSearchTerm(value);
    // Cập nhật URL để phản ánh tìm kiếm hiện tại
    navigate(`/user/searchBook?q=${encodeURIComponent(value)}`, {
      replace: true,
    });
    handleSearch(value);
  };

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          <BookOutlined style={{ marginRight: 8 }} />
          Tìm kiếm sách
        </Title>
      }
      className={styles.searchCard}
    >
      <Input.Search
        placeholder="Nhập tên sách hoặc tác giả để tìm kiếm..."
        allowClear
        enterButton={
          <>
            <SearchOutlined /> Tìm kiếm
          </>
        }
        size="large"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleLocalSearch}
        className={styles.searchInput}
      />

      {loading ? (
        <div style={{ padding: "0 8px" }}>
          {[...Array(4)].map((_, index) => (
            <Skeleton active key={index} style={{ marginBottom: 16 }} />
          ))}
        </div>
      ) : searchTerm && allResults.length === 0 ? (
        <Empty
          description="Không tìm thấy sách phù hợp"
          style={{ margin: "40px 0" }}
        />
      ) : allResults.length > 0 ? (
        <>
          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
            dataSource={displayedResults}
            renderItem={(book) => (
              <List.Item key={book.bookID}>
                <Card
                  hoverable
                  className={styles.bookCard}
                  bodyStyle={{ padding: 16 }}
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
                    {book.availableCopies > 0 ? (
                      <Badge
                        count={`Còn ${book.availableCopies}`}
                        className={`${styles.availableBadge} ${styles.availableCount}`}
                      />
                    ) : (
                      <Badge
                        count="Hết sách"
                        className={`${styles.availableBadge} ${styles.unavailableCount}`}
                      />
                    )}
                  </div>
                  <div className={styles.bookBody}>
                    <Title
                      level={5}
                      ellipsis={{ rows: 2 }}
                      className={styles.bookTitle}
                    >
                      {book.bookName}
                    </Title>
                    <Text type="secondary" ellipsis={{ rows: 1 }}>
                      {book.bookAuthor}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Danh mục: {book.ddcName || "Chưa phân loại"}
                      </Text>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />

          {allResults.length > pageSize && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={allResults.length}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      ) : null}
    </Card>
  );
}

export default SearchCard;
