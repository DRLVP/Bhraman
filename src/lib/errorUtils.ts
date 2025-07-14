import { AxiosError } from 'axios';
import { isAppError, isApiError, isAuthError, isValidationError } from '../types/error';

/**
 * Type guard to check if an error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return error !== null && typeof error === 'object' && 'isAxiosError' in error;
}

/**
 * Type guard to check if an error is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Extract a user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // Handle Axios errors
    return error.response?.data?.message || error.message || 'An error occurred with the request';
  } else if (isApiError(error)) {
    // Handle API errors
    return `${error.message} (Status: ${error.statusCode})`;
  } else if (isValidationError(error)) {
    // Handle validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      return Object.values(error.errors)[0] || error.message;
    }
    return error.message;
  } else if (isAuthError(error)) {
    // Handle auth errors
    return error.message || 'Authentication error';
  } else if (isAppError(error)) {
    // Handle general app errors
    return error.message || 'Application error';
  } else if (isError(error)) {
    // Handle standard Error objects
    return error.message || 'An unexpected error occurred';
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    // Handle error-like objects with message property
    return error.message;
  } else if (typeof error === 'string') {
    // Handle string errors
    return error;
  }
  
  // Fallback for completely unknown error types
  return 'An unknown error occurred';
}