import { ListRequest, FormSendRequest } from "/src/components/user/request";
const SupportRequests = () => {
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
      <ListRequest />

      {/* Gửi yêu cầu mới */}
      <FormSendRequest />
    </div>
  );
};

export default SupportRequests;
