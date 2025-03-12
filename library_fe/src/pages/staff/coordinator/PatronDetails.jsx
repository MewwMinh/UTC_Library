import {
  PatronDetail,
  PatronReward,
  PatronBorrowRecently,
} from "/src/components/staff/coordinator/patron";
function PatronDetails() {
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
      <PatronDetail />
      <PatronBorrowRecently />
      <PatronReward />
    </div>
  );
}
export default PatronDetails;
