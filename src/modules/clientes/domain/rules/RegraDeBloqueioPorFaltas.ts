export const shouldBlockClient = (faltas: number, limit: number): boolean => {
  return faltas >= limit;
};
