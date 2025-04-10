// src/pages/BookEditPage.jsx
import { Breadcrumb } from "antd";
import { HomeOutlined, BookOutlined, EditOutlined } from "@ant-design/icons";
import BookEdit from "/src/components/staff/librarian/book/BookEdit";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/books/BookCatalogPage.module.css";

const BookEditPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const breadcrumbItems = [
    {
      title: (
        <span
          onClick={() => handleNavigate("/staff/dashboard")}
          className={styles.breadcrumbLink}
        >
          <HomeOutlined /> Trang chủ
        </span>
      ),
      key: "home",
    },
    {
      title: (
        <span
          onClick={() => handleNavigate("/staff/books")}
          className={styles.breadcrumbLink}
        >
          <BookOutlined /> Quản lý sách
        </span>
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
