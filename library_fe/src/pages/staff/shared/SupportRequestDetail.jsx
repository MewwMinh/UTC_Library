// src/pages/SupportRequestDetail.jsx
import { useState, useEffect } from "react";
import { Row, Col, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import supportService from "/src/services/shared/ticketService.js";

import {
  RequestHeader,
  UserInfo,
  ResponseForm,
  RequestInfo,
  ResponseHistory,
} from "/src/components/staff/shared/ticket";

import styles from "/src/styles/ticket/SupportRequestDetail.module.css";

const SupportRequestDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [responses, setResponses] = useState([]);

  // Hàm lấy thông tin chi tiết yêu cầu
  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTicketDetails(ticketId);

      if (response.success) {
        setTicketDetails(response.data);
      } else {
        message.error(response.message || "Không thể tải thông tin yêu cầu");
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      message.error("Đã xảy ra lỗi khi tải thông tin yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách phản hồi
  const fetchResponses = async () => {
    try {
      const response = await supportService.getTicketResponses(ticketId);

      if (response.success) {
        setResponses(response.data);
      } else {
        message.error(response.message || "Không thể tải danh sách phản hồi");
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách phản hồi");
    }
  };

  // Hàm xử lý khi có phản hồi mới
  const handleResponseSuccess = () => {
    // Cập nhật lại danh sách phản hồi và thông tin yêu cầu
    fetchTicketDetails();
    fetchResponses();
  };

  // Hàm quay lại trang danh sách
  const handleBackClick = () => {
    navigate("/support-requests");
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchTicketDetails();
    fetchResponses();
  }, [ticketId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tải thông tin yêu cầu..." />
      </div>
    );
  }

  // Nếu không tìm thấy thông tin yêu cầu
  if (!ticketDetails) {
    return (
      <div className={styles.errorContainer}>
        <p>Không tìm thấy thông tin yêu cầu hoặc yêu cầu không tồn tại.</p>
        <button onClick={handleBackClick}>Quay lại danh sách</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <RequestHeader
        ticketId={ticketDetails.ticketID}
        title={ticketDetails.title}
        status={ticketDetails.status}
        onBackClick={handleBackClick}
      />

      {/* Main content */}
      <Row gutter={[16, 16]}>
        {/* Left column - Request details and responses */}
        <Col xs={24} lg={16}>
          {/* Request Info */}
          <RequestInfo ticketDetails={ticketDetails} />

          {/* Response History */}
          <ResponseHistory
            responses={responses}
            requestCreatedAt={ticketDetails.createdAt}
          />

          {/* Response Form */}
          <ResponseForm
            ticketId={ticketDetails.ticketID}
            onResponseSuccess={handleResponseSuccess}
          />
        </Col>

        {/* Right column - User info and quick actions */}
        <Col xs={24} lg={8}>
          {/* User Info */}
          <UserInfo userDetails={ticketDetails} />

          {/* Quick Actions 
          <QuickActions
            ticketId={ticketDetails.ticketID}
            status={ticketDetails.status}
            onActionSuccess={handleResponseSuccess}
          />*/}
        </Col>
      </Row>
    </div>
  );
};

export default SupportRequestDetail;
