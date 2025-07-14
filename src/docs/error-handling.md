# Error Handling in Bhraman

## Overview

This document outlines the error handling approach used in the Bhraman application. Proper error handling is crucial for providing a good user experience and for debugging issues in production.

## Error Types

The application defines several custom error types in `src/types/error.ts`:

- `AppError`: Base error class for all application-specific errors
- `ApiError`: For API-related errors with status codes
- `AuthError`: For authentication and authorization errors
- `ValidationError`: For data validation errors, with support for field-specific error messages

## Error Handling in Catch Blocks

When handling errors in catch blocks, use the following pattern:

```typescript
try {
  // Your code here
} catch (error) {
  // Process the error using type guards
  if (isApiError(error)) {
    // Handle API errors
  } else if (isAuthError(error)) {
    // Handle auth errors
  } else {
    // Handle other errors
  }
}
```

**Important**: Do not use type annotations in catch clauses like `catch (error: Error)` or `catch (error: unknown)`. This syntax is not supported in TypeScript when targeting certain JavaScript versions and can cause build errors, especially in production environments like Vercel.

## Error Utility Functions

The `src/lib/errorUtils.ts` file provides several utility functions for working with errors:

- `isAxiosError`: Type guard for Axios errors
- `isError`: Type guard for standard Error objects
- `isAppError`, `isApiError`, `isAuthError`, `isValidationError`: Type guards for custom error types
- `getErrorMessage`: Extracts a user-friendly message from any error type

## Best Practices

1. **Always use try/catch blocks** when dealing with asynchronous operations
2. **Use the appropriate error type** when throwing errors
3. **Provide meaningful error messages** that help users understand what went wrong
4. **Log errors** to the console or a logging service for debugging
5. **Use toast notifications** to display errors to users when appropriate
6. **Handle errors at the appropriate level** - don't catch errors too early if they should be handled higher up

## Example

```typescript
import { ApiError } from '../types/error';
import { getErrorMessage } from '../lib/errorUtils';
import { useToast } from '../components/ui/use-toast';

async function fetchData() {
  const { toast } = useToast();
  
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new ApiError(`Failed to fetch data: ${response.statusText}`, response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    toast({
      title: 'Error',
      description: getErrorMessage(error),
      variant: 'destructive',
    });
    return null;
  }
}
```