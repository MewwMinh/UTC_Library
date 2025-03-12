import { FindBook, BookList } from "/src/components/staff/librarian/book";

const ManageBook = () => {
  return (
    <div
      style={{
        padding: 20,
        marginRight: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Card tìm kiếm */}
      <FindBook />

      {/* Card danh sách bạn đọc */}
      <BookList />
    </div>
  );
};

export default ManageBook;
