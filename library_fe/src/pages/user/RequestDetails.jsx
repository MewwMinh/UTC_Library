import { RequestDetail } from "/src/components/user/request";

export default function RequestDetails() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <RequestDetail />
    </div>
  );
}
