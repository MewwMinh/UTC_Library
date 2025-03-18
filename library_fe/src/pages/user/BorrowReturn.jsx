import { Row, Col } from "antd";
import {
  ListBorrowingBook,
  ListCloseToDueBook,
  BorrowHistory,
  BookBorrowReturnHeader,
} from "/src/components/user/book";

export default function BorrowReturn() {
  return (
    <div>
      <BookBorrowReturnHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          animation: "fadeIn 1s ease 0.5s both",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <ListBorrowingBook />
          </Col>
          <Col xs={24}>
            <ListCloseToDueBook />
          </Col>

          <Col xs={24}>
            <BorrowHistory />
          </Col>
        </Row>
      </div>
    </div>
  );
}
