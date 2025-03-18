import {
  EventHeader,
  ListEvent,
  RegisteredEvents,
} from "/src/components/user/event";

export default function Event() {
  return (
    <div>
      <EventHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          animation: "fadeIn 1s ease 0.5s both",
        }}
      >
        <ListEvent />
        <RegisteredEvents />
      </div>
    </div>
  );
}
