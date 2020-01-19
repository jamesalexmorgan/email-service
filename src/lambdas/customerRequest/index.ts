import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import responseSuccess from './utils/responseSuccess';
import responseInvalid from './utils/responseInvalid';
import checkInvalidInput from './utils/checkInvalidInput';
import { SQS_QUEUE_URL } from 'src/configuration';
import sqs from 'src/utils/awsClients/sqs';
import responseError from './utils/responseError';

export const handler = async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log('INFO in src/lambdas/customerRequest: INVOKED', event);

    const invalidError = checkInvalidInput(event);
    if (invalidError) {
      const response = responseInvalid(invalidError);
      console.log('INFO in src/lambdas/customerRequest: response', response);
      return response;
    }

    const messageRequest: SendMessageRequest = {
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: event.body,
    };
    const result = await sqs.sendMessage(messageRequest).promise();

    const response = responseSuccess(result.MessageId);
    console.log('INFO in src/lambdas/customerRequest: response', response);
    return response;
  } catch (error) {
    console.log('ERROR in src/lambdas/customerRequest: ERROR', error);
    return responseError();
  }
};

export default { handler };
