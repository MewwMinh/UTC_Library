// src/pages/BookAddPage.jsx
import { Breadcrumb } from "antd";
import { HomeOutlined, BookOutlined, PlusOutlined } from "@ant-design/icons";
import BookAdd from "/src/components/staff/librarian/book/BookAdd";

const BookAddPage = () => {
  // Định nghĩa items cho Breadcrumb theo cách mới
  const breadcrumbItems = [
    {
      title: (
        <a href="/staff/dashboard">
          <HomeOutlined /> Trang chủ
        </a>
      ),
      key: "home",
    },
    {
      title: (
        <a href="/staff/books">
          <BookOutlined /> Quản lý sách
        </a>
      ),
      key: "books",
    },
    {
      title: (
        <span>
          <PlusOutlined /> Thêm sách mới
        </span>
      ),
      key: "add",
    },
  ];

  return (
    <div className="book-add-page">
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <BookAdd />
    </div>
  );
};

export default BookAddPage;
