import {
  ListPatron,
  FindPatron,
} from "/src/components/staff/coordinator/patron";

const QuanLyBanDoc = () => {
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
      <FindPatron />

      {/* Card danh sách bạn đọc */}
      <ListPatron />
    </div>
  );
};

export default QuanLyBanDoc;
