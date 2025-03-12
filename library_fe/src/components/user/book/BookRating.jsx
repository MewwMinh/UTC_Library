import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Form, Input, Rate, notification } from "antd";
import bookReviewSubmitService from "/src/services/patronService.js";

function BookRating() {
  const [form] = Form.useForm();
  const { id: bookId } = useParams();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    if (!values.rating) {
      notification.warning({
        message: "Vui lòng chọn số sao",
        description: "Bạn cần đánh giá số sao cho cuốn sách này.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await bookReviewSubmitService.submitBookReview(
        bookId,
        values.rating,
        values.comment || ""
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Đánh giá của bạn đã được gửi thành công!",
        });

        // Reset form sau khi gửi thành công
        form.resetFields();
      } else {
        notification.error({
          message: "Không thể gửi đánh giá",
          description: response.message || "Không thể gửi đánh giá",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi đánh giá",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title={
        <span style={{ fontSize: "1.5rem" }}>Đánh giá về cuốn sách này</span>
      }
      style={{
        backgroundColor: "#f4f6f8",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ rating: 0 }}
      >
        <Form.Item
          name="rating"
          label="Theo bạn, cuốn sách này xứng đáng"
          style={{ fontWeight: "bold" }}
          rules={[{ required: true, message: "Vui lòng đánh giá số sao" }]}
        >
          <Rate style={{ fontSize: "24px" }} />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Nhận xét"
          style={{ fontWeight: "bold" }}
        >
          <Input.TextArea
            rows={4}
            placeholder="Viết nhận xét của bạn..."
            style={{ borderRadius: "8px" }}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={submitting}
          style={{
            height: "45px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#1890ff",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Gửi đánh giá
        </Button>
      </Form>
    </Card>
  );
}

export default BookRating;
