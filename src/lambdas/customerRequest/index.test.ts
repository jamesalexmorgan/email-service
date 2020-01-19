import customerRequest from '.';
import sqs from 'src/utils/awsClients/sqs';
import newTestEvent from 'src/utilsForTests/newTestEvent';

const goodEventBody = `
  { 
    "to": "John Smith<john@smith.com>",
    "cc": "john@smith.com",
    "bcc": "John Smith<john@smith.com>,john@smith.com",
    "from": "Jim Jones<jim@jones.com>",
    "subject": "Something awesome has happened",
    "text": "You sent an email"
  }
`;

describe('customerRequest', () => {
  test('Good input - returns good response and calls sqs.sendMessage', async () => {
    const event = newTestEvent(goodEventBody);
    const result = await customerRequest.handler(event);
    expect(result).toEqual({
      body: '{"success":true,"requestId":"IAmTheMockMessageId"}',
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    });

    expect(sqs.sendMessage).toHaveBeenCalledWith({
      MessageBody: `
  { 
    "to": "John Smith<john@smith.com>",
    "cc": "john@smith.com",
    "bcc": "John Smith<john@smith.com>,john@smith.com",
    "from": "Jim Jones<jim@jones.com>",
    "subject": "Something awesome has happened",
    "text": "You sent an email"
  }
`,
      QueueUrl: undefined,
    });
  });

  test('Wrong http method - fail', async () => {
    const event = newTestEvent(goodEventBody);
    event.httpMethod = 'GET';
    const result = await customerRequest.handler(event);
    expect(result).toEqual({
      body: '{"error":"This end point only supports POST http method"}',
      headers: { 'Content-Type': 'application/json' },
      statusCode: 422,
    });
  });
});
