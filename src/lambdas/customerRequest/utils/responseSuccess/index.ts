import { EnumStatusCode, EnumContentType } from 'src/types/Enums';
import { APIGatewayProxyResult } from 'aws-lambda';

function responseSuccess(requestId: string): APIGatewayProxyResult {
  return {
    statusCode: EnumStatusCode.success,
    body: JSON.stringify({ success: true, requestId }),
    headers: { 'Content-Type': EnumContentType.json },
  };
}

export default responseSuccess;
