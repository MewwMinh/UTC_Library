import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Select, Space } from "antd";
import { Option } from "antd/es/mentions";
import { useState } from "react";

function FindPatron() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = () => {
    setLoading(true);
    // Giả lập API call tìm kiếm
    setTimeout(() => {
      // Trong thực tế sẽ gọi API backend ở đây
      setLoading(false);
    }, 500);
  };

  return (
    <Card title="Tìm kiếm bạn đọc" style={{ marginBottom: 16 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên, mã bạn đọc hoặc email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Space>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <div>
          <span style={{ marginRight: "8px" }}>Hạng thành viên:</span>
          <Select
            style={{ width: 120 }}
            placeholder="Chọn hạng"
            allowClear
            onChange={(value) =>
              console.log("Lọc theo hạng thành viên:", value)
            }
          >
            <Option value="Vàng">Vàng</Option>
            <Option value="Bạc">Bạc</Option>
            <Option value="Đồng">Đồng</Option>
          </Select>
        </div>

        <div>
          <span style={{ marginRight: "8px" }}>Trạng thái:</span>
          <Select
            style={{ width: 120 }}
            placeholder="Chọn trạng thái"
            allowClear
            onChange={(value) => console.log("Lọc theo trạng thái:", value)}
          >
            <Option value="Hoạt động">Hoạt động</Option>
            <Option value="Tạm khóa">Tạm khóa</Option>
            <Option value="Khóa">Khóa</Option>
          </Select>
        </div>

        <div>
          <span style={{ marginRight: "8px" }}>Năm sinh:</span>
          <DatePicker
            picker="year"
            placeholder="Chọn năm sinh"
            allowClear
            onChange={(date) =>
              console.log(
                "Lọc theo năm sinh:",
                date ? date.format("YYYY") : null
              )
            }
          />
        </div>
      </div>
    </Card>
  );
}
export default FindPatron;
