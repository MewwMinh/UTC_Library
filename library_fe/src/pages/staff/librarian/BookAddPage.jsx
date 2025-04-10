// src/pages/BookAddPage.jsx
import { Breadcrumb } from "antd";
import { HomeOutlined, BookOutlined, PlusOutlined } from "@ant-design/icons";
import BookAdd from "/src/components/staff/librarian/book/BookAdd";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/books/BookCatalogPage.module.css";

const BookAddPage = () => {
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
