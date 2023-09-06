export function getStartAndEndOfMonth(monthNumber: number) {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Invalid month number. Use a number from 1 to 12.");
  }

  const firstDayOfMonth = new Date(new Date().getFullYear(), monthNumber, 1);

  const lastDayOfMonth = new Date(new Date().getFullYear(), monthNumber + 1, 0);

  return {
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  };
}
