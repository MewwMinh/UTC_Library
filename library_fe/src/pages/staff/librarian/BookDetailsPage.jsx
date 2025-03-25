// src/pages/librarian/BookDetailsPage.jsx
import { Row, Col, Breadcrumb } from "antd";

import { BookDetail, BookComment } from "/src/components/staff/librarian/book";
import { BookOutlined, EyeOutlined, HomeOutlined } from "@ant-design/icons";

const BookDetailsPage = () => {
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
          <BookComment />
        </Col>
      </Row>
    </div>
  );
};

export default BookDetailsPage;
