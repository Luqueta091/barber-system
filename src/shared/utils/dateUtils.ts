export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map((part) => Number(part));
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

export function isAtLeastMinutesFromNow(date: Date, minutes: number): boolean {
  const now = new Date();
  const threshold = addMinutes(now, minutes);
  return date.getTime() >= threshold.getTime();
}
