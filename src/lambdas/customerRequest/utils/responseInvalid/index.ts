import { EnumStatusCode, EnumContentType } from 'src/types/Enums';
import { APIGatewayProxyResult } from 'aws-lambda';

function responseInvalid(errorMessage: string): APIGatewayProxyResult {
  return {
    statusCode: EnumStatusCode.invalidInput,
    body: JSON.stringify({ error: errorMessage }),
    headers: { 'Content-Type': EnumContentType.json },
  };
}

export default responseInvalid;
