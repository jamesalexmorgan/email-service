import { SendMessageRequest } from 'aws-sdk/clients/sqs';

export const sendMessageMock = jest
  .fn()
  .mockImplementation(function({ MessageBody }: SendMessageRequest): any {
    return {
      promise: async function(): Promise<any> {
        return {
          MessageId: 'IAmTheMockMessageId',
          MessageResponse: `Successfully mocked sendMessage, MessageBody: '${JSON.stringify(
            MessageBody,
          )}'`,
        };
      },
    };
  });

const SQS = jest.fn().mockImplementation(() => {
  return {
    sendMessage: sendMessageMock,
  };
});

export default SQS;
