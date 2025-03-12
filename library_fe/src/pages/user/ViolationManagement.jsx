import {
  ListViolation,
  Statistic1,
  ListAchievement,
} from "/src/components/user/common";

function ViolationPage() {
  return (
    <div style={{ padding: 20 }}>
      <Statistic1 />
      <ListAchievement />
      <ListViolation />
    </div>
  );
}

export default ViolationPage;
