import { SystemConfigManagement } from "/src/components/admin";
export default function ConfigSystem() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <SystemConfigManagement />
    </div>
  );
}
