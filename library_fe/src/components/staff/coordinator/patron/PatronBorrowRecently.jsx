import { BookOutlined } from "@ant-design/icons";
import { Card, Col, List, Row, Tag, Typography } from "antd";

function PatronBorrowRecently() {
  const borrowedBooks = [
    {
      title: "Lập trình Java cơ bản",
      borrowDate: "2025-02-01",
      dueDate: "2025-02-10",
      returnDate: "2025-02-09", // Đã trả đúng hạn
    },
    {
      title: "Học React từ cơ bản đến nâng cao",
      borrowDate: "2025-02-05",
      dueDate: "2025-02-15",
      returnDate: "2025-02-17", // Trả muộn
    },
    {
      title: "Cấu trúc dữ liệu và giải thuật",
      borrowDate: "2025-02-10",
      dueDate: "2025-02-20",
      returnDate: null, // Đang mượn
    },
    {
      title: "Hệ điều hành - Lý thuyết và thực hành",
      borrowDate: "2025-02-02",
      dueDate: "2025-02-12",
      returnDate: "2025-02-14", // Trả muộn
    },
    {
      title: "Cơ sở dữ liệu nâng cao",
      borrowDate: "2025-02-08",
      dueDate: "2025-02-18",
      returnDate: null, // Đang mượn
    },
  ];

  const getStatusTag = (item) => {
    if (!item.returnDate) {
      return (
        <Tag color="blue" style={{ fontSize: "14px" }}>
          Đang mượn
        </Tag>
      );
    }
    return new Date(item.returnDate) > new Date(item.dueDate) ? (
      <Tag color="gold" style={{ fontSize: "14px" }}>
        Trả muộn
      </Tag>
    ) : (
      <Tag color="green" style={{ fontSize: "14px" }}>
        Đã trả
      </Tag>
    );
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={
            <Typography.Title
              level={3}
              style={{
                textAlign: "center",
                margin: 0,
                color: "#333333",
              }}
            >
              Sách mượn gần đây
            </Typography.Title>
          }
          style={{
            marginBottom: "20px",
            color: "#F8F9FA",
            background:
              "url('https://www.transparenttextures.com/patterns/shattered.png'), linear-gradient( 135deg, #F9F9F9 0%, #E5E5E5 100%)",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={borrowedBooks}
            renderItem={(item) => (
              <List.Item extra={getStatusTag(item)}>
                <List.Item.Meta
                  avatar={
                    <BookOutlined
                      style={{
                        color: "#007BFF",
                        fontSize: "24px",
                        marginTop: "12px",
                      }}
                    />
                  }
                  title={
                    <span style={{ fontSize: "16px", color: "#333333" }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <span style={{ fontSize: "14px", color: "#666666" }}>
                      Ngày mượn: {item.borrowDate}
                      {item.returnDate && ` | Ngày trả: ${item.returnDate}`}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
export default PatronBorrowRecently;
