export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = (Date.now() - date.getTime()) / 1000;
  const pluralize = (value: number, unit: string) => `${value} ${unit}${value === 1 ? "" : "s"}`;

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

  const days = Math.floor(seconds / 86400);

  if (days < 7) return pluralize(days, "day");

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    return [pluralize(weeks, "week"), remainingDays > 0 ? pluralize(remainingDays, "day") : ""]
      .filter(Boolean)
      .join(" ");
  }

  if (days < 365) {
    const months = Math.floor(days / 30);
    const daysAfterMonths = days % 30;
    const weeks = Math.floor(daysAfterMonths / 7);
    const remainingDays = daysAfterMonths % 7;

    return [
      pluralize(months, "month"),
      weeks > 0 ? pluralize(weeks, "week") : "",
      remainingDays > 0 ? pluralize(remainingDays, "day") : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const years = Math.floor(days / 365);
  const daysAfterYears = days % 365;
  const months = Math.floor(daysAfterYears / 30);
  const daysAfterMonths = daysAfterYears % 30;
  const weeks = Math.floor(daysAfterMonths / 7);
  const remainingDays = daysAfterMonths % 7;

  return [
    pluralize(years, "year"),
    months > 0 ? pluralize(months, "month") : "",
    weeks > 0 ? pluralize(weeks, "week") : "",
    remainingDays > 0 ? pluralize(remainingDays, "day") : "",
  ]
    .filter(Boolean)
    .join(" ");
}
