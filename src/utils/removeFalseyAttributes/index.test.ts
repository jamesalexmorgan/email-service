import removeFalseyAttributes from '.';

describe('removeFalseyAttributes', () => {
  test('strip some', async () => {
    const result = await removeFalseyAttributes({
      to: 'John Smith<jamesalexmorgan@gmail.com>',
      cc: undefined,
      bcc: '',
      from: 'Jim Jones<jim@jones.com>',
      subject: '',
      text: 'You sent an email',
    });
    expect(result).toEqual({
      to: 'John Smith<jamesalexmorgan@gmail.com>',
      from: 'Jim Jones<jim@jones.com>',
      text: 'You sent an email',
    });
  });
});
