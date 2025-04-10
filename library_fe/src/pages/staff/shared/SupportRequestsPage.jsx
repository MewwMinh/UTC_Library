import {
  TicketStatistics,
  TicketList,
} from "/src/components/staff/shared/ticket";
import styles from "/src/styles/ticket/SupportRequests.module.css";

const SupportRequestsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Quản lý yêu cầu hỗ trợ</h1>
      <TicketStatistics />
      <TicketList />
    </div>
  );
};

export default SupportRequestsPage;
