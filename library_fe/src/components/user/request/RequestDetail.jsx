import { Card, Tag } from "antd";

const RequestDetail = () => {
  const request = {
    id: "REQ12345",
    fullName: "Nguyễn Văn A",
    type: "Mượn sách",
    title: "Yêu cầu mượn sách lập trình",
    detail: "Tôi muốn mượn cuốn 'Clean Code' trong vòng 2 tuần.",
    status: "Đang xử lý",
  };
  return (
    <Card
      style={{
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        fontSize: "16px",
      }}
      title={`Mã yêu cầu: ${request.id}`}
    >
      <p>
        <strong>Họ tên:</strong> {request.fullName}
      </p>
      <p>
        <strong>Loại yêu cầu:</strong> {request.type}
      </p>
      <p>
        <strong>Tiêu đề:</strong> {request.title}
      </p>
      <p>
        <strong>Chi tiết yêu cầu:</strong> {request.detail}
      </p>
      <p>
        <strong>Trạng thái: </strong>
        <Tag color={request.status === "Đang xử lý" ? "blue" : "green"}>
          {request.status}
        </Tag>
      </p>
    </Card>
  );
};

export default RequestDetail;
