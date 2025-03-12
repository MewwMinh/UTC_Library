import {
  Statistic,
  UserStatistics,
  BookBorrowingStatistics,
} from "/src/components/admin";

function AdminDashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <Statistic />
      <UserStatistics />
      <BookBorrowingStatistics />
    </div>
  );
}
export default AdminDashboard;
