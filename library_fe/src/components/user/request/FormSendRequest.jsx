import { Button, Card, Input, Select, Typography } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";

const requestTypes = [
  { label: "Account Issue", value: "ACCOUNT_ISSUE" },
  { label: "Borrowing Issue", value: "BORROWING_ISSUE" },
  { label: "Technical Issue", value: "TECHNICAL_ISSUE" },
  { label: "Other", value: "OTHER" },
];

const FormSendRequest = ({ onSendRequest }) => {
  const [newRequest, setNewRequest] = useState({
    type: null,
    title: "",
    details: "",
  });

  const handleCreateRequest = () => {
    if (!newRequest.type || !newRequest.title || !newRequest.details) return;
    onSendRequest({
      id: Date.now(),
      title: newRequest.title,
      name: "User Name",
      type: newRequest.type,
      status: "PENDING",
      details: newRequest.details,
    });
    setNewRequest({ type: "", title: "", details: "" });
  };

  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Gửi yêu cầu mới
        </Typography.Title>
      }
      style={{
        marginBottom: 20,
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), #ffffff",
      }}
    >
      <Input
        placeholder="Nhập tiêu đề"
        style={{ width: "100%", marginBottom: "10px" }}
        value={newRequest.title}
        onChange={(e) =>
          setNewRequest({ ...newRequest, title: e.target.value })
        }
      />
      <Select
        placeholder="Chọn loại yêu cầu"
        style={{ width: "100%", marginBottom: "10px" }}
        options={requestTypes}
        value={newRequest.type}
        onChange={(value) => setNewRequest({ ...newRequest, type: value })}
      />
      <Input.TextArea
        placeholder="Nhập chi tiết yêu cầu"
        rows={4}
        value={newRequest.details}
        onChange={(e) =>
          setNewRequest({ ...newRequest, details: e.target.value })
        }
      />
      <Button
        type="primary"
        block
        style={{ marginTop: "10px" }}
        onClick={handleCreateRequest}
      >
        Gửi yêu cầu
      </Button>
    </Card>
  );
};

FormSendRequest.propTypes = {
  onSendRequest: PropTypes.func.isRequired,
};

export default FormSendRequest;
