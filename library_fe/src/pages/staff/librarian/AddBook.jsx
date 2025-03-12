import { CreateBook } from "/src/components/staff/librarian/book";

const BookDetails = () => {
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
      <CreateBook />
    </div>
  );
};

export default BookDetails;
