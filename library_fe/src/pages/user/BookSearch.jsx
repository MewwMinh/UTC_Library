import { useState } from "react";
import { Input, Card, List, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const booksData = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    available: 5,
    categories: ["Programming", "Software Engineering"],
    image: "https://example.com/clean-code.jpg",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    available: 3,
    categories: ["Programming", "Software Development"],
    image: "https://example.com/pragmatic-programmer.jpg",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    available: 7,
    categories: ["Software Engineering", "Architecture"],
    image: "https://example.com/design-patterns.jpg",
  },
  {
    id: 4,
    title: "Refactoring",
    author: "Martin Fowler",
    available: 6,
    categories: ["Programming", "Software Engineering"],
    image: "https://example.com/refactoring.jpg",
  },
  {
    id: 5,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    available: 4,
    categories: ["JavaScript", "Web Development"],
    image: "https://example.com/ydkjs.jpg",
  },
  {
    id: 6,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    available: 8,
    categories: ["JavaScript", "Programming"],
    image: "https://example.com/eloquent-js.jpg",
  },
  {
    id: 7,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    available: 2,
    categories: ["Algorithms", "Computer Science"],
    image: "https://example.com/algorithms.jpg",
  },
  {
    id: 8,
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    available: 1,
    categories: ["Computer Science", "Mathematics"],
    image: "https://example.com/art-cp.jpg",
  },
  {
    id: 9,
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    available: 5,
    categories: ["Artificial Intelligence", "Machine Learning"],
    image: "https://example.com/deep-learning.jpg",
  },
  {
    id: 10,
    title: "Python Crash Course",
    author: "Eric Matthes",
    available: 9,
    categories: ["Python", "Programming"],
    image: "https://example.com/python-crash.jpg",
  },
];

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBooks = searchTerm
    ? booksData.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : booksData;

  return (
    <div style={{ padding: 20 }}>
      <Input
        placeholder="Tìm kiếm theo tên sách hoặc tác giả"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        style={{ marginBottom: 20 }}
      />

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={filteredBooks}
        renderItem={(book) => (
          <List.Item>
            <Card
              cover={
                <img
                  alt={book.title}
                  src="/public/ex-sach.jpg"
                  style={{ height: 500, objectFit: "cover" }}
                  onClick={() => navigate(`/user/bookDetails`)}
                />
              }
            >
              <p>
                <b>{book.title}</b>
              </p>
              <p>
                <b>Tác giả:</b> {book.author}
              </p>
              <p>
                <b>Số bản còn lại:</b> {book.available}
              </p>
              <p>
                <b>Danh mục:</b>{" "}
                {book.categories.map((cat) => (
                  <Tag key={cat}>{cat}</Tag>
                ))}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookSearch;
