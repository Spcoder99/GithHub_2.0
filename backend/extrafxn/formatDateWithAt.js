function formatDateWithAt(isoString) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const parts = formatter.formatToParts(new Date(isoString));

  const date = parts
    .filter(p => ["day", "month", "year"].includes(p.type))
    .map(p => p.value)
    .join(" ");

  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;
  const period = parts.find(p => p.type === "dayPeriod")?.value;

  return `${date} at ${hour}:${minute} ${period}`;
}

module.exports = { formatDateWithAt };