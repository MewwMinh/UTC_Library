// src/pages/librarian/BookDetailsPage.jsx
import { Row, Col, Breadcrumb } from "antd";

import {
  BookDetail,
  BookComment,
  BookItemList,
} from "/src/components/staff/librarian/book";
import { BookOutlined, EyeOutlined, HomeOutlined } from "@ant-design/icons";
import styles from "/src/styles/books/BookCatalogPage.module.css";
import { useNavigate } from "react-router-dom";

const BookDetailsPage = () => {
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
          <EyeOutlined /> Thông tin chi tiết
        </span>
      ),
      key: "edit",
    },
  ];
  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
        </Col>
        <Col span={24}>
          <BookDetail />
        </Col>
        <Col span={24}>
          <BookItemList />
        </Col>
        <Col span={24}>
          <BookComment />
        </Col>
      </Row>
    </div>
  );
};

export default BookDetailsPage;
