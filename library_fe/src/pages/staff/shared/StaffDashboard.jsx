import styles from "/src/styles/manager/Page.module.css";
import { StatisticsCardGrid } from "/src/components/statistic";

import {
  UserRecentActivity,
  WeeklyBorrowReturnStats,
} from "/src/components/staff/shared/dashboard";

const StaffDashboard = () => {
  return (
    <div className={styles.bookCatalogPage}>
      <div style={{ marginBottom: 24 }}>
        <StatisticsCardGrid />
      </div>

      <div style={{ marginBottom: 24 }}>
        <WeeklyBorrowReturnStats />
      </div>

      <div style={{ marginBottom: 24 }}>
        <UserRecentActivity />
      </div>
    </div>
  );
};

export default StaffDashboard;
