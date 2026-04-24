type DashboardStatsProps = {
  label: string;
  value: string | number;
  helper: string;
};

export function DashboardStats({ label, value, helper }: DashboardStatsProps) {
  return (
    <div className="dashboard-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </div>
  );
}
