import { LambdaResponse } from '../../global';

export const formatResponse = (body: any): LambdaResponse => {
  const response = {
    statusCode: 200,
    statusDescription: '200 OK',
    headers: {
      'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
    body: JSON.stringify(body),
  };
  return response;
};

export const formatError = (error: any): LambdaResponse => {
  const response = {
    statusCode: error.statusCode,
    headers: {
      'Content-Type': 'text/plain',
      'x-amzn-ErrorType': error.code,
    },
    isBase64Encoded: false,
    body: `${error.code}: ${error.message}`,
  };
  return response;
};
