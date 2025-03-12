import React from "react";
import { Employee } from "/src/components/admin";

function ManageStaff() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <Employee />
    </div>
  );
}
export default ManageStaff;
