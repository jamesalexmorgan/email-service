import { EnumStatusCode, EnumContentType } from 'src/types/Enums';
import { APIGatewayProxyResult } from 'aws-lambda';

function responseError(): APIGatewayProxyResult {
  return {
    statusCode: EnumStatusCode.error,
    body: JSON.stringify({ error: 'Something went wrong' }),
    headers: { 'Content-Type': EnumContentType.json },
  };
}

export default responseError;
