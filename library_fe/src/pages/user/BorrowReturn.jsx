import {
  ListBorrowingBook,
  ListCloseToDueBook,
  BorrowHistory,
} from "/src/components/user/book";

const BorrowReturn = () => {
  return (
    <div style={{ padding: 20 }}>
      <ListBorrowingBook /> <ListCloseToDueBook /> <BorrowHistory />
    </div>
  );
};

export default BorrowReturn;
