// src/components/librarian/book/LibrarianBookReviews.jsx
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
  Button,
  Modal,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Input,
  Radio,
  Badge,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  FilterOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import bookReviewService from "/src/services/patronService.js";
import librarianService from "/src/services/librarian/bookService.js";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;
const { Search } = Input;

function LibrarianBookReviews() {
  const { bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [starFilter, setStarFilter] = useState(0); // 0 = Tất cả, 1-5 = Số sao tương ứng
  const [searchText, setSearchText] = useState("");
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

  const handleDeleteComment = (reviewId) => {
    confirm({
      title: "Xác nhận xóa bình luận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa bình luận này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setDeleteLoading(true);
          const response = await librarianService.deleteComment(reviewId);

          if (response.success) {
            notification.success({
              message: "Thành công",
              description: response.message || "Đã xóa bình luận thành công",
            });
            // Cập nhật danh sách bình luận sau khi xóa
            setReviews(
              reviews.filter((review) => review.reviewID !== reviewId)
            );
          } else {
            notification.error({
              message: "Lỗi",
              description: response.message || "Không thể xóa bình luận",
            });
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          notification.error({
            message: "Lỗi kết nối",
            description: "Không thể kết nối đến máy chủ",
          });
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  // Lọc đánh giá theo số sao và văn bản tìm kiếm
  const filterReviews = () => {
    return reviews.filter((review) => {
      // Lọc theo số sao
      const starMatch = starFilter === 0 || review.rating === starFilter;

      // Lọc theo text (tìm trong tên người dùng hoặc nội dung bình luận)
      const searchMatch =
        searchText === "" ||
        (review.fullName &&
          review.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
        (review.comment &&
          review.comment.toLowerCase().includes(searchText.toLowerCase()));

      return starMatch && searchMatch;
    });
  };

  const filteredReviews = filterReviews();

  // Tính toán đánh giá hiển thị cho trang hiện tại
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [starFilter, searchText]);

  // Tính số sao trung bình
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  // Tính số lượng đánh giá cho mỗi mức sao
  const getStarCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  };

  const starCounts = getStarCounts();

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Tiêu đề và thống kê */}
      <div
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          padding: "20px",
          marginTop: "-24px",
          marginLeft: "-24px",
          marginRight: "-24px",
          marginBottom: "24px",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space align="center" size="large">
              <Title level={3} style={{ margin: 0 }}>
                <CommentOutlined /> Đánh giá từ bạn đọc
              </Title>
              <Tag
                color="blue"
                style={{ fontSize: "14px", padding: "4px 8px" }}
              >
                {reviews.length} bình luận
              </Tag>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space size="large" align="center">
              <Statistic
                title="Số sao trung bình"
                value={averageRating}
                precision={1}
                prefix={<StarFilled style={{ color: "#fadb14" }} />}
                suffix={<Text type="secondary">/ 5</Text>}
                valueStyle={{ color: "#1677ff" }}
              />
              <Rate
                disabled
                allowHalf
                value={parseFloat(averageRating)}
                style={{ fontSize: 16 }}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm theo tên người dùng hoặc nội dung"
              allowClear
              enterButton
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FilterOutlined style={{ marginRight: "8px" }} />
              <Radio.Group
                onChange={(e) => setStarFilter(e.target.value)}
                value={starFilter}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value={0}>Tất cả ({reviews.length})</Radio.Button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Radio.Button key={star} value={star}>
                    <Badge count={starCounts[star] || 0} size="small">
                      <span style={{ marginRight: "4px" }}>
                        {star} <StarFilled style={{ color: "#fadb14" }} />
                      </span>
                    </Badge>
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </Col>
        </Row>
      </div>

      {/* Nội dung bình luận */}
      {loading ? (
        <>
          {[...Array(3)].map((_, index) => (
            <div key={index} style={{ marginBottom: "24px" }}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              {index < 2 && <Divider style={{ margin: "24px 0" }} />}
            </div>
          ))}
        </>
      ) : filteredReviews.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ fontSize: "16px" }}>
              {searchText || starFilter > 0
                ? "Không tìm thấy bình luận phù hợp"
                : "Chưa có đánh giá nào cho cuốn sách này"}
            </Text>
          }
        />
      ) : (
        <>
          <List
            itemLayout="vertical"
            dataSource={currentReviews}
            renderItem={(review, index) => (
              <>
                <List.Item
                  style={{
                    padding: "20px",
                    background: index % 2 === 0 ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                  actions={[
                    <Button
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteComment(review.reviewID)}
                      loading={deleteLoading}
                    >
                      Xóa bình luận
                    </Button>,
                  ]}
                >
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <Avatar
                      src={review.userImage}
                      icon={!review.userImage && <UserOutlined />}
                      size={48}
                      style={{
                        marginRight: "16px",
                        backgroundColor: !review.userImage
                          ? review.rating >= 4
                            ? "#52c41a"
                            : review.rating >= 3
                            ? "#1677ff"
                            : review.rating >= 2
                            ? "#faad14"
                            : "#f5222d"
                          : undefined,
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
                        <Text strong style={{ fontSize: "16px" }}>
                          {review.fullName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          <CalendarOutlined /> {formatDate(review.createdAt)}
                        </Text>
                      </div>
                      <Rate
                        disabled
                        value={review.rating}
                        style={{ fontSize: 16 }}
                      />
                      <div style={{ margin: "12px 0 0 0" }}>
                        {review.comment ? (
                          <Paragraph style={{ fontSize: "15px", margin: 0 }}>
                            {review.comment}
                          </Paragraph>
                        ) : (
                          <Text type="secondary" italic>
                            Không có bình luận
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                </List.Item>
              </>
            )}
          />

          {filteredReviews.length > pageSize && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredReviews.length}
                onChange={setCurrentPage}
                hideOnSinglePage
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default LibrarianBookReviews;
