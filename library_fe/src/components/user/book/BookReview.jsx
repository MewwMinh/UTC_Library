import { Card, List, Rate } from "antd";

function BookReview() {
  const reviews = [
    {
      id: 1,
      name: "Nguyen Van A",
      rating: 5,
      comment: "Cuốn sách rất hữu ích!",
      date: "2025-02-21",
    },
    {
      id: 2,
      name: "Tran Thi B",
      rating: 4,
      comment: "Nội dung tốt nhưng hơi khó hiểu cho người mới.",
      date: "2025-02-20",
    },
    {
      id: 3,
      name: "Le Van C",
      rating: 3,
      comment: "Nội dung ổn nhưng cần cập nhật thêm.",
      date: "2025-02-19",
    },
    {
      id: 4,
      name: "Pham Thi D",
      rating: 5,
      comment: "Một quyển sách tuyệt vời!",
      date: "2025-02-18",
    },
    {
      id: 5,
      name: "Hoang Van E",
      rating: 2,
      comment: "Không thực sự hữu ích với tôi.",
      date: "2025-02-17",
    },
    {
      id: 6,
      name: "Bui Thi F",
      rating: 4,
      comment: "Khá hay, phù hợp cho người mới bắt đầu.",
      date: "2025-02-16",
    },
    {
      id: 7,
      name: "Do Van G",
      rating: 3,
      comment: "Nội dung chưa thực sự sâu sắc.",
      date: "2025-02-15",
    },
    {
      id: 8,
      name: "Vu Thi H",
      rating: 5,
      comment: "Rất đáng đọc, tôi sẽ giới thiệu cho bạn bè!",
      date: "2025-02-14",
    },
    {
      id: 9,
      name: "Ngo Van I",
      rating: 4,
      comment: "Tôi thích cách trình bày của sách.",
      date: "2025-02-13",
    },
    {
      id: 10,
      name: "Trinh Thi J",
      rating: 5,
      comment: "Sách hay, nội dung hấp dẫn.",
      date: "2025-02-12",
    },
  ];

  return (
    <Card
      title=<span style={{ fontSize: "1.5rem" }}>Đánh giá - Bình luận</span>
      style={{
        backgroundColor: "#f4f6f8",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        // margin: "auto",
        height: "670px",
        overflowY: "auto",
        padding: "16px",
      }}
    >
      <List
        dataSource={reviews}
        pagination={{ pageSize: 3 }} // Chỉ hiển thị 3 đánh giá mỗi trang
        renderItem={(review) => (
          <List.Item>
            <div style={{ fontSize: "16px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {review.name}
              </p>
              <p
                style={{
                  fontStyle: "italic",
                  marginBottom: "4px",
                  color: "#555",
                }}
              >
                {review.date}
              </p>
              <Rate disabled defaultValue={review.rating} />
              <p style={{ marginTop: "4px" }}>{review.comment}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default BookReview;
