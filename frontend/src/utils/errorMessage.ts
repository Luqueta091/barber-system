import axios from 'axios';

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data) {
      if (typeof data === 'string') {
        return data;
      }

      if (typeof data.message === 'string') {
        return data.message;
      }

      if (typeof data.error === 'string') {
        return data.error;
      }

      if (data.error && typeof data.error.message === 'string') {
        return data.error.message;
      }

      const fieldErrors = data.error?.fieldErrors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstField = Object.values(fieldErrors)[0];
        if (Array.isArray(firstField) && firstField[0]) {
          return firstField[0];
        }
      }

      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === 'string') return first;
        if (first?.message) return first.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
