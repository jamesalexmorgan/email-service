import axios from 'axios';

import sendEmail from '.';
import { SQSRecord } from 'aws-lambda';

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

function newRecord(): SQSRecord {
  // @ts-ignore // ignoring all the other attributes that should be on an SQSRecord (not needed for these tests)
  return {
    messageId: '1234567890',
    body: goodEventBody,
  };
}

// NOTE: not testing invalid body here as validation has already been done on it
describe('sendEmail (invoked by SQS)', () => {
  beforeEach(() => {
    ((axios as unknown) as jest.Mock).mockReset();
  });

  test('MailGun succeeds - success', async () => {
    const record = newRecord();

    // invoke the lambda as if sqs were passing the event
    const result = await sendEmail.handler({ Records: [record] });
    expect(result).toEqual({ success: true });

    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      method: 'POST',
      url:
        'https://api.mailgun.net/v3/PlaceHolderTestApiUrlMailGun.mailgun.org/messages', // from .env-test file
      auth: {
        password: 'PlaceHolderTestApiKeyMailGunASDFGHJKL', // from .env-test file
        username: 'api',
      },
      params: {
        bcc: 'John Smith<john@smith.com>,john@smith.com',
        cc: 'john@smith.com',
        from: 'Jim Jones<jim@jones.com>',
        subject: 'Something awesome has happened',
        text: 'You sent an email',
        to: 'John Smith<john@smith.com>',
      },
      timeout: 5000,
    });
  });

  test('MailGun fails, SendGrid succeeds - success', async () => {
    // make sure the first axios request (MailGun) fails
    ((axios as unknown) as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Uh oh, sorry Mailgun is down at the moment');
    });

    const record = newRecord();

    const result = await sendEmail.handler({ Records: [record] });
    expect(result).toEqual({ success: true });

    // was called once for MailGun, again for SendGrid
    expect(axios).toHaveBeenCalledTimes(2);
    expect(axios).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers: {
        Authorization: 'Bearer PlaceHolderTestApiKeySendGridASDFGHJKL', // from .env-test file
        'Content-Type': 'application/json',
      },
      data:
        '{"personalizations":[{' +
        '"to":[{"name":"John Smith","email":"john@smith.com"}],' +
        '"cc":[{"email":"john@smith.com"}],' +
        '"bcc":[{"name":"John Smith","email":"john@smith.com"},{"email":"john@smith.com"}]' +
        '}],' +
        '"from":{"name":"Jim Jones",' +
        '"email":"jim@jones.com"},' +
        '"subject":"Something awesome has happened",' +
        '"content":[{"type":"text/plain","value":"You sent an email"}]}',
      timeout: 5000,
    });
  });

  test('MailGun fails, SendGrid fails - error', async () => {
    // make sure the first axios request (MailGun) fails
    ((axios as unknown) as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Uh oh, sorry Mailgun is down at the moment');
    });
    // Queue up another response for SendGrid failure
    ((axios as unknown) as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Uh oh, sorry SendGrid is down at the moment');
    });

    const record = newRecord();

    const result = await sendEmail.handler({ Records: [record] });
    expect(result).toEqual(new Error('Both email api services failed to send'));

    // was called once for MailGun, again for SendGrid
    expect(axios).toHaveBeenCalledTimes(2);
  });
});
