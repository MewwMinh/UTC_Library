import { ActivityLog } from "/src/components/admin";
function ActivityLogs() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <ActivityLog />
    </div>
  );
}

export default ActivityLogs;
