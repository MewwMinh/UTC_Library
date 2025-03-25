import { Card, Typography } from "antd";
import BookList from "/src/components/staff/librarian/book/BookList";

const { Title } = Typography;

const BookCatalogPage = () => {
  return (
    <div className="book-catalog-page">
      <Card>
        <Title level={2}>Danh mục sách</Title>
        <BookList />
      </Card>
    </div>
  );
};

export default BookCatalogPage;
