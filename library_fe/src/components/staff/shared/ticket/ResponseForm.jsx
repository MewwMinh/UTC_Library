// src/components/supportRequest/ResponseForm.jsx
import { useState } from "react";
import { Card, Form, Input, Select, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import styles from "/src/styles/ticket/ResponseForm.module.css";
import supportService from "/src/services/shared/ticketService.js";

const { TextArea } = Input;
const { Option } = Select;

/**
 * Component form để gửi phản hồi yêu cầu hỗ trợ
 */
// eslint-disable-next-line react/prop-types
const ResponseForm = ({ ticketId, onResponseSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi gửi phản hồi
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const responseData = {
        status: values.status,
        title: values.title,
        message: values.message,
      };

      const response = await supportService.respondToTicket(
        ticketId,
        responseData
      );

      if (response.success) {
        message.success("Phản hồi đã được gửi thành công");
        form.resetFields();

        // Gọi callback để cập nhật UI
        if (onResponseSuccess) {
          onResponseSuccess();
        }
      } else {
        message.error(response.message || "Không thể gửi phản hồi");
      }
    } catch (error) {
      console.error("Error sending response:", error);
      message.error("Đã xảy ra lỗi khi gửi phản hồi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<div style={{ marginLeft: 15 }}>Phản hồi yêu cầu</div>}
      className={styles.formCard}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          name="status"
          label="Cập nhật trạng thái"
          initialValue="Đang xử lý"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Đã hoàn thành">Đã hoàn thành</Option>
            <Option value="Bị từ chối">Từ chối</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Tiêu đề phản hồi"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề phản hồi" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề phản hồi..." />
        </Form.Item>

        <Form.Item
          name="message"
          label="Nội dung phản hồi"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung phản hồi" },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Nhập nội dung phản hồi chi tiết..."
            className={styles.textarea}
          />
        </Form.Item>

        <Form.Item className={styles.submitBtn}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={loading}
          >
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResponseForm;
