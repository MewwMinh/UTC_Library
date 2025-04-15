// src/components/patron/AddPatronModal.jsx
import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  notification,
} from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import patronService from "/src/services/coordinator/patronService.js";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const AddPatronModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Format date to YYYY-MM-DD
      const formattedValues = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
      };

      const response = await patronService.createPatron(formattedValues);

      if (response.code === 1000) {
        notification.success({
          message: "Thành công",
          description: response.message || "Tạo mới bạn đọc thành công!",
        });
        form.resetFields();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tạo bạn đọc",
        });
      }
    } catch (error) {
      console.error("Error creating patron:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo bạn đọc. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm bạn đọc mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<UserAddOutlined />}
        >
          Tạo bạn đọc
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          gender: "Nam",
        }}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ và tên!",
            },
          ]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="nationalID"
          label="Số CCCD"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số CCCD!",
            },
            {
              pattern: /^\d{12}$/,
              message: "Số CCCD phải gồm 12 chữ số!",
            },
          ]}
        >
          <Input placeholder="Nhập số CCCD (12 chữ số)" />
        </Form.Item>

        <Form.Item
          name="userID"
          label="Mã bạn đọc"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã bạn đọc!",
            },
          ]}
        >
          <Input placeholder="Nhập mã bạn đọc" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn giới tính!",
            },
          ]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dob"
          label="Ngày sinh"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày sinh!",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPatronModal;
