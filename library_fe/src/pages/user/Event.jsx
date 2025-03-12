import { ListEvent, RegisteredEvents } from "/src/components/user/event";

export default function Event() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <ListEvent />
      <RegisteredEvents />
    </div>
  );
}
