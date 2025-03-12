import { useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Image,
  Button,
  Modal,
  DatePicker,
} from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function BookDetail() {
  const book = {
    title:
      "The Genius Engine: Where Memory, Reason, Passion, Violence, and Creativity Intersect in the Human Brain",
    author: "Robert C. Martin",
    available: 5,
    categories: ["Programming", "Software Engineering"],
    image: "/public/ex-sach.jpg",
    favorite: false,
    description:
      "Cuốn sách khám phá cách bộ não con người hoạt động, từ trí nhớ, lý trí đến cảm xúc và sáng tạo. Nó cung cấp một cái nhìn sâu sắc về những cơ chế tinh vi của trí óc và cách chúng ảnh hưởng đến cuộc sống hàng ngày của chúng ta.",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favorite, setFavorite] = useState(book.favorite);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log("Ngày mượn:", selectedDate?.format("DD/MM/YYYY"));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Card
      style={{
        background: "#f4f6f8",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Row gutter={[20, 20]} align="middle">
        <Col xs={24} sm={8} md={6} lg={5} style={{ textAlign: "center" }}>
          <Image
            src={book.image}
            alt={book.title}
            width={200}
            height={290}
            style={{
              objectFit: "cover",
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        </Col>
        <Col xs={24} sm={16} md={18} lg={19}>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ marginBottom: 15 }}>
              {book.title}
            </Title>
            <Text strong style={{ fontSize: "1.2rem" }}>
              Tác giả:{" "}
            </Text>
            <Text style={{ fontSize: "1.2rem" }}>{book.author}</Text>
            <br />
            <Text strong style={{ fontSize: "1.2rem" }}>
              Số bản còn lại:{" "}
            </Text>
            <Text style={{ fontSize: "1.2rem" }}>{book.available}</Text>
            <br />
            <Text strong style={{ fontSize: "1.2rem" }}>
              Danh mục:{" "}
            </Text>
            <Text style={{ fontSize: "1.2rem" }}>
              {book.categories.join(", ")}
            </Text>
            <br />
            <Text strong style={{ fontSize: "1.2rem" }}>
              Mô tả:{" "}
            </Text>
            <Text
              style={{ fontSize: "1.1rem", display: "block", marginTop: 5 }}
            >
              {book.description}
            </Text>
          </div>

          {/* Chỉnh lại layout của hai nút */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 10, // Khoảng cách giữa các nút
            }}
          >
            <Button type="primary" onClick={showModal}>
              Đặt mượn sách
            </Button>
            <Button
              type="text"
              onClick={toggleFavorite}
              style={{ verticalAlign: "middle" }}
            >
              {favorite ? (
                <HeartFilled style={{ color: "red", fontSize: 22 }} />
              ) : (
                <HeartOutlined style={{ fontSize: 22 }} />
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal đặt mượn sách */}
      <Modal
        title="Xác nhận đặt mượn sách"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy bỏ"
        centered
        style={{
          backgroundImage:
            "url(https://www.transparenttextures.com/patterns/paper-fibers.png)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <p style={{ fontSize: "1.1rem", marginBottom: 15 }}>
          Bạn muốn đặt mượn <strong>{book.title}</strong> của tác giả{" "}
          <strong>{book.author}</strong>.
        </p>
        <p style={{ fontSize: "1.1rem", marginBottom: 10 }}>
          Vui lòng chọn ngày lấy sách:
        </p>
        <DatePicker onChange={(date) => setSelectedDate(date)} />
      </Modal>
    </Card>
  );
}

export default BookDetail;
