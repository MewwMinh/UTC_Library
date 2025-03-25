// src/pages/BookEditPage.jsx
import { Breadcrumb } from "antd";
import { HomeOutlined, BookOutlined, EditOutlined } from "@ant-design/icons";
import BookEdit from "/src/components/staff/librarian/book/BookEdit";

const BookEditPage = () => {
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
          <EditOutlined /> Chỉnh sửa sách
        </span>
      ),
      key: "edit",
    },
  ];

  return (
    <div className="book-edit-page">
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <BookEdit />
    </div>
  );
};

export default BookEditPage;
