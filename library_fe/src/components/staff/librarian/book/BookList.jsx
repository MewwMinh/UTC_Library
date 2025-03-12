import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Giả lập dữ liệu sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Trong thực tế, thay thế bằng URL API thực
        // const response = await axios.get('/api/books');
        // setBooks(response.data);

        // Dữ liệu mẫu cho mục đích demo
        const mockData = [
          {
            id: 1,
            isbn: "978-3-16-148410-0",
            title: "Kỹ thuật xây dựng cầu đường",
            author: "Nguyễn Văn A",
            category: "Kỹ thuật",
            language: "Tiếng Việt",
            publishYear: 2020,
            pages: 350,
            size: "21x28 cm",
            availableCopies: 5,
            totalCopies: 10,
            coverImage: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            isbn: "978-3-16-148410-1",
            title: "Cơ sở dữ liệu phân tán",
            author: "Trần Thị B",
            category: "Công nghệ thông tin",
            language: "Tiếng Việt",
            publishYear: 2021,
            pages: 250,
            size: "20x25 cm",
            availableCopies: 3,
            totalCopies: 8,
            coverImage: "https://via.placeholder.com/150",
          },
          {
            id: 3,
            isbn: "978-3-16-148410-2",
            title: "Quản lý dự án xây dựng",
            author: "Lê Văn C",
            category: "Quản lý",
            language: "Tiếng Việt",
            publishYear: 2019,
            pages: 300,
            size: "20x27 cm",
            availableCopies: 0,
            totalCopies: 6,
            coverImage: "https://via.placeholder.com/150",
          },
          {
            id: 4,
            isbn: "978-3-16-148410-3",
            title: "Logistics và vận tải đa phương thức",
            author: "Phạm Thị D",
            category: "Vận tải",
            language: "Tiếng Việt",
            publishYear: 2022,
            pages: 280,
            size: "19x26 cm",
            availableCopies: 7,
            totalCopies: 10,
            coverImage: "https://via.placeholder.com/150",
          },
          {
            id: 5,
            isbn: "978-3-16-148410-4",
            title: "Artificial Intelligence for Transportation",
            author: "John Smith",
            category: "Công nghệ thông tin",
            language: "Tiếng Anh",
            publishYear: 2023,
            pages: 420,
            size: "21x29 cm",
            availableCopies: 2,
            totalCopies: 5,
            coverImage: "https://via.placeholder.com/150",
          },
        ];

        setBooks(mockData);
        setFilteredBooks(mockData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchText.toLowerCase()) ||
        book.category.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý thêm/xóa sách khỏi danh sách yêu thích
  const toggleFavorite = (bookId) => {
    if (favorites.includes(bookId)) {
      setFavorites(favorites.filter((id) => id !== bookId));
    } else {
      setFavorites([...favorites, bookId]);
    }
  };

  // Định nghĩa các cột cho bảng dữ liệu
  const columns = [
    {
      title: "Ảnh bìa",
      dataIndex: "coverImage",
      key: "coverImage",
      width: 80,
      render: (image) => (
        <img
          src={image}
          alt="Ảnh bìa sách"
          style={{ width: 60, height: 80, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: "bold" }}>{text}</span>
          <span style={{ fontSize: "12px", color: "#666" }}>
            ISBN: {record.isbn}
          </span>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Loại sách",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: "Kỹ thuật", value: "Kỹ thuật" },
        { text: "Công nghệ thông tin", value: "Công nghệ thông tin" },
        { text: "Quản lý", value: "Quản lý" },
        { text: "Vận tải", value: "Vận tải" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      filters: [
        { text: "Tiếng Việt", value: "Tiếng Việt" },
        { text: "Tiếng Anh", value: "Tiếng Anh" },
      ],
      onFilter: (value, record) => record.language === value,
    },
    {
      title: "Năm XB",
      dataIndex: "publishYear",
      key: "publishYear",
      sorter: (a, b) => a.publishYear - b.publishYear,
    },
    {
      title: "Số trang",
      dataIndex: "pages",
      key: "pages",
    },
    {
      title: "Khổ cỡ",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Số bản",
      key: "copies",
      render: (_, record) => (
        <span>
          <span
            style={{
              color: record.availableCopies === 0 ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {record.availableCopies}
          </span>
          /{record.totalCopies}
        </span>
      ),
      sorter: (a, b) => a.availableCopies - b.availableCopies,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              shape="circle"
              icon={<BookOutlined />}
              size="small"
              onClick={() => navigate("/staff/book-details")}
            />
          </Tooltip>
          <Tooltip
            title={
              favorites.includes(record.id)
                ? "Xóa khỏi yêu thích"
                : "Thêm vào yêu thích"
            }
          >
            <Button
              type="default"
              shape="circle"
              icon={
                favorites.includes(record.id) ? (
                  <HeartFilled style={{ color: "red" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              size="small"
              onClick={() => toggleFavorite(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2} style={{ marginBottom: 20 }}>
        <BookOutlined style={{ marginRight: 8 }} />
        Danh sách sách
      </Title>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredBooks}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} mục`,
        }}
        scroll={{ x: 1200 }}
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={9}>
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Tổng số sách:
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <div style={{ fontWeight: "bold" }}>{filteredBooks.length}</div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
};

export default BookList;
