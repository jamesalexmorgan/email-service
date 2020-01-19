import convertSingleNameAndEmailToSendGridObject from '.';

describe('convertSingleNameAndEmailToSendGridObject', () => {
  test('John Smith<john@smith.com>', async () => {
    const result = convertSingleNameAndEmailToSendGridObject(
      'John Smith<john@smith.com>',
    );
    expect(result).toEqual({ name: 'John Smith', email: 'john@smith.com' });
  });

  test('john@smith.com', async () => {
    const result = convertSingleNameAndEmailToSendGridObject('john@smith.com');
    expect(result).toEqual({ email: 'john@smith.com' });
  });
});
