export const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map((value) => Number.parseInt(value, 10));
  const combined = new Date(date);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const isAtLeastMinutesFromNow = (date: Date, minutes: number): boolean => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return diffMs >= minutes * 60 * 1000;
};
