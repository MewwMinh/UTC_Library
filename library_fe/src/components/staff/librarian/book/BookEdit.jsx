import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  Row,
  Col,
  Typography,
  Spin,
  notification,
  Space,
  Divider,
  Upload,
  message,
  Modal,
  Tooltip,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import bookService from "/src/services/librarian/bookService.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Danh sách mã phân loại DDC
const ddcClassifications = [
  { code: "000", name: "Tổng quát" },
  { code: "100", name: "Triết học & Tâm lý học" },
  { code: "200", name: "Tôn giáo" },
  { code: "300", name: "Khoa học xã hội" },
  { code: "400", name: "Ngôn ngữ học" },
  { code: "500", name: "Khoa học tự nhiên & Toán học" },
  { code: "600", name: "Công nghệ & Khoa học ứng dụng" },
  { code: "700", name: "Nghệ thuật & Giải trí" },
  { code: "800", name: "Văn học" },
  { code: "900", name: "Lịch sử & Địa lý" },
];

const BookEdit = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [book, setBook] = useState(null);
  const [, setCoverImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const yearNow = new Date().getFullYear();

  useEffect(() => {
    fetchBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookDetail(bookId);

      if (response.success) {
        const bookData = response.data;
        setBook(bookData);
        setImageUrl(bookData.coverImage || "");

        // Set form values
        form.setFieldsValue({
          isbn: bookData.isbn,
          bookName: bookData.bookName,
          author: bookData.author,
          bookType: bookData.bookType,
          language: bookData.language,
          publicationYear: bookData.publicationYear,
          totalCopies: bookData.totalCopies,
          pageCount: bookData.pageCount,
          format: bookData.format || "16 cm x 24 cm",
          description: bookData.description,
          ddcCode: bookData.ddcCode,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải thông tin sách",
        });
        navigate("/staff/books");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
      console.error("Error fetching book details:", error);
      navigate("/staff/books");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Prepare form data with coverImage
      const bookData = {
        ...values,
        coverImage: imageUrl, // Keep existing URL if image wasn't changed
      };

      const response = await bookService.updateBook(bookId, bookData);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin sách thành công",
        });
        navigate("/staff/books");
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể cập nhật thông tin sách",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
      console.error("Error updating book:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Chuyển đổi file thành base64 để hiển thị ngay
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận định dạng ảnh JPG/PNG!");
      return false;
    }

    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    try {
      setUploadingImage(true);

      // Chuyển đổi file thành base64 để hiển thị tạm thời
      const base64Image = await fileToBase64(file);

      // Upload image to server
      const response = await bookService.changeBookCover(book.isbn, file);

      if (response.success) {
        // Cập nhật ảnh hiển thị với base64 image
        setImageUrl(base64Image);
        setCoverImage(file);
        message.success(response.message || "Thay đổi ảnh thành công!");
      } else {
        message.error(response.message || "Không thể thay đổi ảnh bìa!");
      }
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên server!");
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }

    return false; // Prevent auto-upload
  };

  // Removed handleRemoveImage as it's no longer needed

  const handleDeleteBook = async () => {
    try {
      setSubmitting(true);
      const response = await bookService.deleteBook(bookId);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Xóa sách thành công",
        });
        navigate("/staff/books");
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể xóa sách",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
      console.error("Error deleting book:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sách này?",
      icon: <ExclamationCircleOutlined />,
      content: "Dữ liệu sẽ không thể khôi phục sau khi xóa!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteBook();
      },
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải thông tin sách...</p>
      </div>
    );
  }

  return (
    <Card
      title={
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Chỉnh sửa thông tin sách</Title>
        </div>
      }
      extra={
        <Space>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate("/staff/books")}
          >
            Quay lại
          </Button>
          <Tooltip title="Xóa sách">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
            >
              Xóa sách
            </Button>
          </Tooltip>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          language: "Tiếng Việt",
          bookType: "Giáo trình",
          publicationYear: yearNow,
          format: "16 cm x 24 cm",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={24} md={16} lg={18}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="isbn"
                  label="Mã ISBN"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã ISBN" },
                    {
                      pattern: /^[0-9-]+$/,
                      message: "ISBN chỉ gồm số và dấu gạch ngang",
                    },
                  ]}
                >
                  <Input placeholder="VD: 978-3-16-148410-0" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bookType"
                  label="Loại sách"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại sách" },
                  ]}
                >
                  <Select placeholder="Chọn loại sách">
                    <Option value="Giáo trình">Giáo trình</Option>
                    <Option value="Tài liệu tham khảo">
                      Tài liệu tham khảo
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="bookName"
              label="Tên sách"
              rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
            >
              <Input placeholder="VD: Giáo trình Mạng máy tính" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Tác giả"
              rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
            >
              <Input placeholder="VD: Nguyễn Văn A" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="publicationYear"
                  label="Năm xuất bản"
                  rules={[
                    { required: true, message: "Vui lòng nhập năm xuất bản" },
                  ]}
                >
                  <InputNumber
                    min={1900}
                    max={yearNow}
                    style={{ width: "100%" }}
                    placeholder={yearNow.toString()}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="language"
                  label="Ngôn ngữ"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngôn ngữ" },
                  ]}
                >
                  <Select placeholder="Chọn ngôn ngữ">
                    <Option value="Tiếng Việt">Tiếng Việt</Option>
                    <Option value="Tiếng Anh">Tiếng Anh</Option>
                    <Option value="Tiếng Pháp">Tiếng Pháp</Option>
                    <Option value="Tiếng Trung">Tiếng Trung</Option>
                    <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="totalCopies"
                  label="Tổng số bản"
                  rules={[
                    { required: true, message: "Vui lòng nhập tổng số bản" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="VD: 10"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="pageCount" label="Số trang">
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="VD: 350"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="format" label="Khổ sách">
                  <Select placeholder="Chọn khổ sách">
                    <Option value="14,5 cm x 20,5 cm">14,5 cm x 20,5 cm</Option>
                    <Option value="16 cm x 24 cm">16 cm x 24 cm</Option>
                    <Option value="19 cm × 27 cm">19 cm × 27 cm</Option>
                    <Option value="13 cm × 19 cm">13 cm × 19 cm</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="ddcCode" label="Mã phân loại DDC">
                  <Select
                    placeholder="Chọn mã phân loại"
                    showSearch
                    optionFilterProp="children"
                  >
                    {ddcClassifications.map((ddc) => (
                      <Option key={ddc.code} value={ddc.code}>
                        {ddc.code} - {ddc.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả">
              <TextArea rows={6} placeholder="Nhập mô tả sách..." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <Text strong>Ảnh bìa sách</Text>
                </div>
              }
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {imageUrl ? (
                  <div style={{ display: "inline-block" }}>
                    <img
                      src={imageUrl}
                      alt="Ảnh bìa sách"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #d9d9d9",
                      borderRadius: 4,
                    }}
                  >
                    <Text type="secondary">Chưa có ảnh bìa</Text>
                  </div>
                )}
              </div>

              <Upload
                name="coverImage"
                listType="picture"
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpeg"
              >
                <Button
                  icon={<UploadOutlined />}
                  block
                  loading={uploadingImage}
                >
                  Chọn ảnh bìa
                </Button>
              </Upload>
              <Text
                type="secondary"
                style={{ display: "block", marginTop: 8, fontSize: 12 }}
              >
                Chỉ chấp nhận ảnh JPG/PNG, dung lượng &lt; 2MB
              </Text>
            </Card>

            <div style={{ marginTop: 24 }}>
              <Text type="secondary">
                <strong>Lưu ý:</strong> Các thông tin về tác giả, năm xuất bản
                và mã ISBN phải chính xác để đảm bảo việc quản lý sách được hiệu
                quả.
              </Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              Lưu thay đổi
            </Button>
            <Button
              danger
              onClick={() => navigate("/staff/books")}
              size="large"
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BookEdit;
