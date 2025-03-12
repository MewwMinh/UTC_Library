import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";

export default function FindBook() {
  const navigate = useNavigate();
  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên sách, tác giả, ISBN, thể loại..."
          style={{ width: 400 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary">Tìm kiếm</Button>
        <Button
          type="primary"
          onClick={() => {
            navigate("/staff/add-book");
          }}
        >
          Them sach
        </Button>
      </Space>
    </Card>
  );
}
