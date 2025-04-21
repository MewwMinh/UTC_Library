import React from "react";
import { Layout, Typography, Space, Divider } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/layout/admin/AdminFooter.module.css";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <Text className={styles.copyright}>
            &copy; {currentYear} Thư viện trường Đại học Giao thông vận tải
          </Text>
          <Space
            split={<Divider type="vertical" />}
            className={styles.contactInfo}
          >
            <Text className={styles.contactItem}>
              <ClockCircleOutlined /> 08:00 - 20:00
            </Text>
            <Text className={styles.contactItem}>
              <PhoneOutlined /> (024) 3766 4053
            </Text>
            <Text className={styles.contactItem}>
              <EnvironmentOutlined /> 3 Cầu Giấy, Láng Thượng, Đống Đa, Hà Nội
            </Text>
          </Space>
        </div>

        <div className={styles.footerRight}>
          <Space className={styles.links}>
            <Link href="#" className={styles.link}>
              Trợ giúp
            </Link>
            <Link href="#" className={styles.link}>
              Chính sách
            </Link>
            <Link href="#" className={styles.link}>
              Điều khoản
            </Link>
          </Space>
        </div>
      </div>
    </Footer>
  );
};

export default AdminFooter;
