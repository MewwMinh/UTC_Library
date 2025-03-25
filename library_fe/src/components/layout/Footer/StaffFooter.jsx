import { Layout, Typography } from "antd";
import styles from "/src/styles/layout/staff/StaffFooter.module.css";

const { Footer } = Layout;
const { Text, Link } = Typography;

const StaffFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          <Text type="secondary">
            &copy; {currentYear} Thư viện trường Đại học Giao thông vận tải
          </Text>
        </div>
        <div className={styles.links}>
          <Link
            href="https://www.utc.edu.vn/"
            target="_blank"
            className={styles.link}
          >
            Trang chủ UTC
          </Link>
          <Link href="#" className={styles.link}>
            Hỗ trợ
          </Link>
          <Link href="#" className={styles.link}>
            Liên hệ
          </Link>
        </div>
      </div>
    </Footer>
  );
};

export default StaffFooter;
