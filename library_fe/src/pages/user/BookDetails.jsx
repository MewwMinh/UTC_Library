import { BookDetail, BookReview, BookRating } from "/src/components/user/book";

const BookDetails = () => {
  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}
    >
      <BookDetail />
      <BookReview />
      <BookRating />
    </div>
  );
};

export default BookDetails;
