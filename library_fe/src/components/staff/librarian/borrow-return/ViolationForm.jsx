import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  notification,
  Space,
} from "antd";
import returnService from "/src/services/librarian/borrowReturnService.js";

const { Option } = Select;
const { TextArea } = Input;

const violationTypes = ["Mất sách", "Sách bị hư hỏng", "Khác"];

const ViolationForm = ({ visible, recordID, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [solution, setSolution] = useState("Nộp tiền phạt");

  // Reset form when modal becomes visible or recordID changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSolution("Nộp tiền phạt");
    }
  }, [visible, recordID, form]);

  // Handle solution change
  const handleSolutionChange = (value) => {
    setSolution(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Xử lý dữ liệu tùy theo hướng xử lý
      const violationData = {
        recordID: recordID,
        violationType: values.violationType,
        description: values.description || "",
        solution: values.solution,
      };

      // Thêm pointsDeducted chỉ khi solution là "Khác"
      if (values.solution === "Khác") {
        violationData.pointsDeducted = values.pointsDeducted;
      } else {
        violationData.pointsDeducted = 0; // Mặc định là 0 cho các trường hợp khác
      }

      // Thêm penaltyAmount chỉ khi solution là "Nộp tiền phạt" hoặc "Khác"
      if (values.solution === "Nộp tiền phạt" || values.solution === "Khác") {
        violationData.penaltyAmount = values.penaltyAmount;
      } else {
        violationData.penaltyAmount = 0; // Mặc định là 0 cho trường hợp "Bồi thường sách mới"
      }

      const response = await returnService.createViolation(violationData);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Đã ghi nhận vi phạm thành công",
          placement: "topRight",
        });
        onSuccess();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể ghi nhận vi phạm",
          placement: "topRight",
        });
      }
    } catch (error) {
      if (error.errorFields) {
        notification.warning({
          message: "Vui lòng điền đầy đủ thông tin",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Lỗi hệ thống",
          description: "Không thể kết nối đến máy chủ",
          placement: "topRight",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Ghi nhận vi phạm"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={submitting}
          onClick={handleSubmit}
        >
          Ghi nhận vi phạm
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          pointsDeducted: 5,
          penaltyAmount: 0,
        }}
      >
        <Form.Item
          name="violationType"
          label="Loại vi phạm"
          rules={[{ required: true, message: "Vui lòng chọn loại vi phạm" }]}
        >
          <Select placeholder="Chọn loại vi phạm">
            {violationTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[{ required: false }]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập mô tả chi tiết về vi phạm (không bắt buộc)"
          />
        </Form.Item>

        <Form.Item
          name="solution"
          label="Hướng xử lý"
          rules={[{ required: true, message: "Vui lòng chọn hướng xử lý" }]}
        >
          <Select
            placeholder="Chọn hướng xử lý"
            onChange={handleSolutionChange}
            value={solution}
          >
            <Option value="Nộp tiền phạt">Nộp tiền phạt</Option>
            <Option value="Bồi thường sách mới">Bồi thường sách mới</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        {/* Chỉ hiển thị số điểm trừ khi hướng xử lý là "Khác" */}
        {solution === "Khác" && (
          <Form.Item
            name="pointsDeducted"
            label="Số điểm trừ"
            rules={[{ required: true, message: "Vui lòng nhập số điểm trừ" }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        )}

        {/* Hiển thị số tiền phạt khi hướng xử lý là "Nộp tiền phạt" hoặc "Khác" */}
        {(solution === "Nộp tiền phạt" || solution === "Khác") && (
          <Form.Item
            name="penaltyAmount"
            label="Số tiền phạt (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập số tiền phạt" }]}
          >
            <InputNumber
              min={0}
              step={10000}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ViolationForm;
