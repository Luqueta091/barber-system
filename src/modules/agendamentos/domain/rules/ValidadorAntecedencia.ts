import { isAtLeastMinutesFromNow } from '@/shared/utils/dateUtils';

export const isValidLeadTime = (targetDate: Date, minMinutes: number): boolean => {
  return isAtLeastMinutesFromNow(targetDate, minMinutes);
};
