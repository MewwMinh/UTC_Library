import { Breadcrumb, Card, Typography } from "antd";
import { BookOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BookList from "/src/components/staff/librarian/book/BookList";
import styles from "/src/styles/books/BookCatalogPage.module.css";

const { Title, Text } = Typography;

const BookCatalogPage = () => {
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
  ];

  return (
    <div className={styles.bookCatalogPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerBackground}>
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <BookOutlined className={styles.titleIcon} />
            <Title level={2} className={styles.title}>
              Danh mục sách
            </Title>
          </div>
          <Text className={styles.subtitle}>
            Quản lý, tìm kiếm và cập nhật thông tin sách trong thư viện
          </Text>
        </div>
      </div>

      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />

      <Card className={styles.mainCard}>
        <BookList />
      </Card>
    </div>
  );
};

export default BookCatalogPage;
