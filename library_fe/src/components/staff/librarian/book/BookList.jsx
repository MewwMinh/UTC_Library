// src/components/staff/librarian/book/BookList.jsx
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Card,
  Tooltip,
  Empty,
  notification,
  Spin,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bookService from "/src/services/librarian/bookService";

const { Option } = Select;
const { Text } = Typography;

const BookList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [bookType, setBookType] = useState("");
  const [language, setLanguage] = useState("");
  const [publicationYear, setPublicationYear] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks();

      if (response.success) {
        setAllBooks(response.data);
        setFilteredBooks(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách sách",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bookId) => {
    navigate(`/staff/books/details/${bookId}`);
  };

  const handleSearch = () => {
    let results = [...allBooks];

    // Lọc theo từ khóa (tìm trong tên sách hoặc tác giả)
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter(
        (book) =>
          book.bookName.toLowerCase().includes(lowerKeyword) ||
          book.author.toLowerCase().includes(lowerKeyword) ||
          (book.isbn && book.isbn.toLowerCase().includes(lowerKeyword))
      );
    }

    // Lọc theo loại sách
    if (bookType) {
      results = results.filter((book) => book.bookType === bookType);
    }

    // Lọc theo ngôn ngữ
    if (language) {
      results = results.filter((book) => book.language === language);
    }

    // Lọc theo năm xuất bản
    if (publicationYear) {
      const year = publicationYear.year();
      results = results.filter((book) => book.publicationYear === year);
    }

    setFilteredBooks(results);
  };

  const handleReset = () => {
    setKeyword("");
    setBookType("");
    setLanguage("");
    setPublicationYear(null);
    setFilteredBooks(allBooks);
  };

  const getAvailabilityTagColor = (availableCopies, totalCopies) => {
    const ratio = availableCopies / totalCopies;
    if (ratio === 0) return "error";
    if (ratio < 0.3) return "warning";
    return "success";
  };

  const columns = [
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      width: 130,
      ellipsis: true,
    },
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
      ellipsis: true,
      render: (text) => (
        <Text strong style={{ fontSize: "16px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Loại sách",
      dataIndex: "bookType",
      key: "bookType",
      width: 130,
      ellipsis: true,
    },
    {
      title: "Năm XB",
      dataIndex: "publicationYear",
      key: "publicationYear",
      width: 90,
      align: "center",
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Số lượng",
      key: "copies",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Tooltip
          title={`Có sẵn: ${record.availableCopies}/${record.totalCopies}`}
        >
          <Tag
            color={getAvailabilityTagColor(
              record.availableCopies,
              record.totalCopies
            )}
          >
            {record.availableCopies}/{record.totalCopies}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record.bookID)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/staff/books/edit/${record.bookID}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && allBooks.length === 0) {
    return (
      <div
        className="loading-container"
        style={{ textAlign: "center", padding: "40px 0" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="book-list">
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="start">
          <Col xs={24} sm={24} md={16} lg={12}>
            <Space>
              <Input
                placeholder="Tìm kiếm sách..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
                size="large"
                onPressEnter={handleSearch}
              />
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                icon={<FilterOutlined />}
              >
                {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
              <Button onClick={handleReset} icon={<ClearOutlined />}>
                Đặt lại
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8} lg={12}>
            <Row justify="end" gutter={[8, 8]}>
              <Col>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/staff/add-books")}
                  >
                    Thêm sách mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>

          {showFilters && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Loại sách"
                  style={{ width: "100%" }}
                  value={bookType || undefined}
                  onChange={(value) => setBookType(value)}
                  allowClear
                >
                  <Option value="Giáo trình">Giáo trình</Option>
                  <Option value="Tài liệu tham khảo">Tài liệu tham khảo</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Ngôn ngữ"
                  style={{ width: "100%" }}
                  value={language || undefined}
                  onChange={(value) => setLanguage(value)}
                  allowClear
                >
                  <Option value="Tiếng Việt">Tiếng Việt</Option>
                  <Option value="Tiếng Anh">Tiếng Anh</Option>
                  <Option value="Tiếng Pháp">Tiếng Pháp</Option>
                  <Option value="Tiếng Trung">Tiếng Trung</Option>
                  <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <DatePicker
                  placeholder="Năm xuất bản"
                  style={{ width: "100%" }}
                  picker="year"
                  value={publicationYear}
                  onChange={(date) => setPublicationYear(date)}
                />
              </Col>
            </>
          )}
        </Row>
      </Card>

      {filteredBooks.length === 0 ? (
        <Empty
          description="Không tìm thấy sách nào"
          style={{ margin: "40px 0" }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredBooks}
          rowKey="bookID"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} sách`,
            defaultPageSize: 10,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      )}
    </div>
  );
};

export default BookList;
