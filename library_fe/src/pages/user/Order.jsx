import { BookOrder, SeatOrder } from "/src/components/user/order";

export default function Order() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* Danh sách yêu cầu */}
      <BookOrder />
      <SeatOrder />
    </div>
  );
}
