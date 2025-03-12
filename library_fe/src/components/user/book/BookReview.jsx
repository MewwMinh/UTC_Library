// src/components/BookReviews.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  List,
  Rate,
  Typography,
  Avatar,
  Divider,
  Empty,
  Skeleton,
  notification,
  Pagination,
} from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import bookReviewService from "/src/services/patronService.js";

const { Title, Text } = Typography;

function BookReviews() {
  const { id: bookId } = useParams(); // Lấy bookId từ param URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchBookReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const fetchBookReviews = async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      const response = await bookReviewService.getBookReviews(bookId);

      if (response.success) {
        setReviews(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải đánh giá sách",
        });
      }
    } catch (error) {
      console.error("Error fetching book reviews:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Tính toán đánh giá hiển thị cho trang hiện tại
  const currentReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={<Title level={4}>Đánh giá từ bạn đọc</Title>}
      style={{
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      {loading ? (
        <>
          {[...Array(3)].map((_, index) => (
            <div key={index} style={{ marginBottom: "24px" }}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              {index < 2 && <Divider style={{ margin: "24px 0" }} />}
            </div>
          ))}
        </>
      ) : reviews.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có đánh giá nào cho cuốn sách này"
        />
      ) : (
        <>
          <List
            itemLayout="vertical"
            dataSource={currentReviews}
            renderItem={(review, index) => (
              <>
                <List.Item style={{ padding: "0 0 16px 0" }}>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <Avatar
                      icon={<UserOutlined />}
                      size="large"
                      style={{
                        marginRight: "16px",
                        backgroundColor: "#1677ff",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong>{review.fullName}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <CalendarOutlined /> {formatDate(review.createdAt)}
                        </Text>
                      </div>
                      <Rate
                        disabled
                        value={review.rating}
                        style={{ fontSize: 14 }}
                      />
                      <div style={{ margin: "8px 0 0 0" }}>
                        {review.comment || (
                          <Text type="secondary" italic>
                            Không có bình luận
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                </List.Item>
                {index < currentReviews.length - 1 && (
                  <Divider style={{ margin: "0 0 16px 0" }} />
                )}
              </>
            )}
          />

          {reviews.length > pageSize && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={reviews.length}
                onChange={setCurrentPage}
                hideOnSinglePage
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default BookReviews;
