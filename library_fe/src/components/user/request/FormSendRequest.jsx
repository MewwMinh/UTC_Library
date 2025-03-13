import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  notification,
  Divider,
  Space,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import requestService from "/src/services/patron/requestService.js";
import { motion } from "framer-motion";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Các loại yêu cầu từ document
const REQUEST_TYPES = [
  "Mượn/trả sách",
  "Gia hạn sách",
  "Đặt chỗ phòng đọc",
  "Lỗi hệ thống website/ứng dụng",
  "Cập nhật thông tin cá nhân",
  "Đề xuất sách mới",
  "Khiếu nại về phạt",
  "Hỗ trợ tìm tài liệu",
  "Tài khoản và đăng nhập",
  "Báo cáo sách hỏng",
  "Đề xuất sự kiện/hội thảo",
  "Góp ý cải thiện dịch vụ",
  "Báo cáo cơ sở vật chất/thiết bị",
  "Thắc mắc về điểm thành viên",
  "Vấn đề khác",
];

const FormSendRequest = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setCharCount] = useState(0);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await requestService.sendRequest({
        title: values.title,
        problem: values.type,
        description: values.details,
      });

      if (response.success) {
        notification.success({
          message: "Gửi yêu cầu thành công",
          description:
            "Yêu cầu của bạn đã được gửi tới nhân viên thư viện. Chúng tôi sẽ phản hồi sớm nhất có thể.",
          placement: "topRight",
          duration: 4,
        });

        // Reset form
        form.resetFields();
        setCharCount(0);
      } else {
        notification.error({
          message: "Gửi yêu cầu thất bại",
          description:
            response.message ||
            "Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      notification.error({
        message: "Lỗi kết nối",
        description:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
        placement: "topRight",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailsChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={cardVariants}>
      <Card
        variant="filled"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
            margin: "-24px -24px 24px",
            padding: "20px 24px",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <FormOutlined style={{ fontSize: "24px", color: "white" }} />
          <Title level={3} style={{ margin: 0, color: "white" }}>
            Gửi yêu cầu hỗ trợ
          </Title>
        </div>

        <Text
          type="secondary"
          style={{
            display: "block",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark="optional"
        >
          <motion.div variants={itemVariants}>
            <Form.Item
              name="title"
              label={
                <Space>
                  <Text strong>Tiêu đề yêu cầu</Text>
                  <Tooltip title="Nhập tiêu đề ngắn gọn mô tả vấn đề của bạn">
                    <QuestionCircleOutlined style={{ color: "#1677ff" }} />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề yêu cầu" },
                { max: 100, message: "Tiêu đề không được vượt quá 100 ký tự" },
              ]}
            >
              <Input
                prefix={<FileTextOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Ví dụ: Cần gia hạn sách 'Toán cao cấp 1'"
                maxLength={100}
                showCount
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              name="type"
              label={<Text strong>Loại yêu cầu</Text>}
              rules={[
                { required: true, message: "Vui lòng chọn loại yêu cầu" },
              ]}
            >
              <Select
                placeholder="Chọn loại yêu cầu phù hợp"
                dropdownStyle={{ maxHeight: 400 }}
                showSearch
                optionFilterProp="children"
              >
                {REQUEST_TYPES.map((type, index) => (
                  <Option key={index} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              name="details"
              label={
                <Space>
                  <Text strong>Chi tiết yêu cầu</Text>
                  <Tooltip title="Mô tả chi tiết vấn đề bạn đang gặp phải">
                    <QuestionCircleOutlined style={{ color: "#1677ff" }} />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: "Vui lòng nhập chi tiết yêu cầu" },
                { min: 20, message: "Chi tiết yêu cầu cần ít nhất 20 ký tự" },
              ]}
            >
              <TextArea
                placeholder="Mô tả chi tiết về vấn đề của bạn..."
                rows={6}
                showCount
                maxLength={1000}
                onChange={handleDetailsChange}
              />
            </Form.Item>
          </motion.div>

          <Divider style={{ margin: "16px 0" }} />

          <motion.div variants={itemVariants}>
            <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={isSubmitting}
                size="large"
                style={{
                  minWidth: "200px",
                  height: "46px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(22, 119, 255, 0.3)",
                }}
              >
                {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default FormSendRequest;
