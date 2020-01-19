import TypeEmailDetails from 'src/types/TypeEmailDetails';
import convertEmailIntoSendGridPersonalization from '.';

describe('convertEmailIntoSendGridPersonalization', () => {
  test('"to" and "bcc", mix', async () => {
    const email: TypeEmailDetails = {
      to: 'John Smith<john@smith.com>',
      // cc: 'john@smith.com', // no cc provided
      bcc: 'John Smith<john@smith.com>,john@smith.com',
      from: 'Jim Jones<jim@jones.com>',
      subject: 'Something awesome has happened',
      text: 'You sent an email',
    };

    const result = convertEmailIntoSendGridPersonalization(email);
    expect(result).toEqual({
      to: [{ email: 'john@smith.com', name: 'John Smith' }],
      bcc: [
        { email: 'john@smith.com', name: 'John Smith' },
        { email: 'john@smith.com' },
      ],
    });
  });
});
