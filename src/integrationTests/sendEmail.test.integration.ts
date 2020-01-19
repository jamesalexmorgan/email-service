import axios from 'axios';

// we want to use the real axios, not the mocked one
jest.unmock('axios');

describe('customerRequest', () => {
  test('Good input - returns success', async () => {
    let axiosResult;
    try {
      axiosResult = await axios({
        method: 'POST',
        url:
          'https://1apdfrxcte.execute-api.ap-southeast-2.amazonaws.com/dev/v1/send-email',
        data: JSON.stringify({
          to: 'John Smith<jamesalexmorgan+totest@gmail.com>',
          cc: 'jamesalexmorgan+cctest@gmail.com',
          bcc:
            'Mike Tyson<jamesalexmorgan+bcc1test@gmail.com>,jamesalexmorgan+bcc2test@gmail.com',
          from: 'Jim Jones<jim@jones.com>',
          subject: 'Something awesome has happened',
          text: 'You sent an email',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.log('error.message', error.message);
      console.log('error.response.data', error.response.data);
    }

    expect(axiosResult.data).toEqual({
      success: true,
      requestId: expect.anything(),
    });
    // TODO here, use gmail api to log into test email account and check emails were received
  });

  test('Missing "to" attribute - returns 422', async () => {
    try {
      await axios({
        method: 'POST',
        url:
          'https://1apdfrxcte.execute-api.ap-southeast-2.amazonaws.com/dev/v1/send-email',
        data: JSON.stringify({
          // TO attribute missing
          cc: 'jamesalexmorgan+cctest.com',
          bcc:
            'Mike Tyson<jamesalexmorgan+bcc1test.com>,jamesalexmorgan+bcc2test.com',
          from: 'Jim Jones<jim@jones.com>',
          subject: 'Something awesome has happened',
          text: 'You sent an email',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      expect(error.message).toEqual('Request failed with status code 422');
      expect(error.response.data).toEqual({
        error: '"to" field is required on the json body object',
      });
    }
  });
});
