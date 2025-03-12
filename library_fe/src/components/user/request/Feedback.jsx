import { Card } from "antd";

const FeedbackCard = () => {
  const feedback = {
    staffName: "Trần Thị B",
    detail:
      "Cuốn sách bạn yêu cầu đã có sẵn trong thư viện. Bạn có thể đến quầy để mượn vào giờ hành chính.",
  };
  return (
    <Card
      style={{
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        fontSize: "16px",
      }}
      title={feedback ? "Phản hồi" : "Thông báo"}
    >
      {feedback ? (
        <div>
          <p>
            <strong>Hỗ trợ viên:</strong> {feedback.staffName}
          </p>
          <p>
            <strong>Chi tiết phản hồi:</strong> {feedback.detail}
          </p>
        </div>
      ) : (
        <p>Yêu cầu đã đang được chờ xử lý, hãy kiên nhẫn chờ đợi !!!</p>
      )}
    </Card>
  );
};

export default FeedbackCard;
