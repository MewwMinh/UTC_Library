import { useState } from "react";
import { Breadcrumb, Divider } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  SwapOutlined,
  ImportOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  BorrowBooks,
  ReturnBooks,
} from "/src/components/staff/librarian/borrow-return";
import styles from "/src/styles/borrow/BorrowReturnToggle.module.css";

const BorrowReturnPage = () => {
  const [showBorrow, setShowBorrow] = useState(true);

  const handleToggleChange = (checked) => {
    setShowBorrow(checked);
  };

  const breadcrumbItems = [
    {
      title: (
        <a href="/staff/dashboard">
          <HomeOutlined /> Trang chủ
        </a>
      ),
      key: "home",
    },
    {
      title: (
        <span>
          <SwapOutlined /> Mượn/Trả sách
        </span>
      ),
      key: "borrow-return",
    },
    {
      title: (
        <span>
          <BookOutlined /> {showBorrow ? "Mượn sách" : "Trả sách"}
        </span>
      ),
      key: "action",
    },
  ];

  return (
    <div className="borrow-return-page">
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <div style={{ marginBottom: 36, marginTop: 24 }}>
        <div className={styles.toggleContainer}>
          <div
            className={`${styles.toggleOption} ${
              showBorrow ? styles.activeOption : styles.inactiveOption
            }`}
            onClick={() => handleToggleChange(true)}
          >
            <ImportOutlined className={styles.toggleIcon} /> Mượn sách
          </div>

          <div className={styles.toggleDivider}></div>

          <div
            className={`${styles.toggleOption} ${
              !showBorrow ? styles.activeOption : styles.inactiveOption
            }`}
            onClick={() => handleToggleChange(false)}
          >
            <ExportOutlined className={styles.toggleIcon} /> Trả sách
          </div>
        </div>
      </div>

      <Divider />

      {showBorrow ? <BorrowBooks /> : <ReturnBooks />}
    </div>
  );
};

export default BorrowReturnPage;
