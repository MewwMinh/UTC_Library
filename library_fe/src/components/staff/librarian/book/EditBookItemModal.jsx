/* eslint-disable react/prop-types */
// src/components/EditBookItemModal.jsx
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  notification,
} from "antd";
import moment from "moment";
import bookItemService from "/src/services/librarian/bookService.js";
import styles from "/src/styles/books/BookItemList.module.css";

const { TextArea } = Input;
const { Option } = Select;

const EditBookItemModal = ({ visible, bookItem, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Cập nhật form khi bookItem thay đổi
  useEffect(() => {
    if (bookItem && visible) {
      form.setFieldsValue({
        barcode: bookItem.barcode,
        status: bookItem.status,
        acquisitionDate: bookItem.acquisitionDate
          ? moment(bookItem.acquisitionDate)
          : null,
        location: bookItem.location,
        bookCondition: bookItem.bookCondition,
        notes: bookItem.notes,
      });
    }
  }, [bookItem, visible, form]);

  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Định dạng lại dữ liệu trước khi gửi
      const formattedValues = {
        ...values,
        acquisitionDate: values.acquisitionDate
          ? values.acquisitionDate.format("YYYY-MM-DD")
          : null,
      };

      const response = await bookItemService.updateBookItem(
        bookItem.itemID,
        formattedValues
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Cập nhật thông tin sách thành công",
        });
        onSuccess();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể cập nhật thông tin sách",
        });
      }
    } catch (error) {
      console.error("Form validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin bản sao sách"
      open={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" className={styles.modalForm}>
        <Form.Item name="barcode" label="Mã vạch">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value="Có sẵn">Có sẵn</Option>
            <Option value="Đang mượn">Đang mượn</Option>
            <Option value="Bảo trì">Bảo trì</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="acquisitionDate"
          label="Ngày nhập sách"
          rules={[{ required: true, message: "Vui lòng chọn ngày nhập sách" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="location"
          label="Vị trí"
          rules={[{ required: true, message: "Vui lòng nhập vị trí sách" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="bookCondition"
          label="Tình trạng sách"
          rules={[{ required: true, message: "Vui lòng nhập tình trạng sách" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <TextArea rows={4} className={styles.formTextArea} />
        </Form.Item>

        <div className={styles.modalFooter}>
          <Button onClick={onCancel}>Hủy bỏ</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditBookItemModal;
