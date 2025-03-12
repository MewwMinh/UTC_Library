import { Button, Card, Form, Input, Rate } from "antd";

function BookRating() {
  return (
    <Card
      title=<span style={{ fontSize: "1.5rem" }}>
        Đánh giá về cuốn sách này
      </span>
      style={{
        backgroundColor: "#f4f6f8",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "20px",
      }}
    >
      <Form layout="vertical">
        <Form.Item
          label="Theo bạn, cuốn sách này xứng đáng"
          style={{ fontWeight: "bold" }}
        >
          <Rate style={{ fontSize: "24px" }} />
        </Form.Item>
        <Form.Item label="Nhận xét" style={{ fontWeight: "bold" }}>
          <Input.TextArea
            rows={4}
            placeholder="Viết nhận xét của bạn..."
            style={{ borderRadius: "8px" }}
          />
        </Form.Item>
        <Button
          type="primary"
          block
          style={{
            height: "45px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#1890ff",
            border: "none",
            fontWeight: "bold",
          }}
          hoverable={{ backgroundColor: "#40a9ff" }}
        >
          Gửi đánh giá
        </Button>
      </Form>
    </Card>
  );
}

export default BookRating;
