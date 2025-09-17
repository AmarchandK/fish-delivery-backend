export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  statusCode?: number;
}

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
): ApiResponse<T> {
  return {
    statusCode,
    success: true,
    message,
    data,
  };
}

export function errorResponse(
  error: any,
  message: string = 'Error',
  statusCode: number = 500,
): ApiResponse {
  return {
    statusCode,
    success: false,
    message,
    error: error?.message ?? 'Error',
  };
}

export function notFoundResponse(
  error: any,
  message: string = 'Not Found',
  statusCode: number = 404,
): ApiResponse {
  return errorResponse(error, message, statusCode);
}

export function unauthorizedResponse(
  error: any,
  message: string = 'Unauthorized',
  statusCode: number = 401,
): ApiResponse {
  return errorResponse(error, message, statusCode);
}
