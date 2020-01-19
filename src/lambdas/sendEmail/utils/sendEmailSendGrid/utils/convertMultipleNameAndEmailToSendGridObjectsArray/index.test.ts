import convertMultipleNameAndEmailToSendGridObjectsArray from '.';

describe('convertMultipleNameAndEmailToSendGridObjectsArray', () => {
  test('John Smith<john@smith.com>,jim@jones.com', async () => {
    const result = convertMultipleNameAndEmailToSendGridObjectsArray(
      'John Smith<john@smith.com>,jim@jones.com',
    );
    expect(result).toEqual([
      { name: 'John Smith', email: 'john@smith.com' },
      { email: 'jim@jones.com' },
    ]);
  });

  test('Null', async () => {
    const result = convertMultipleNameAndEmailToSendGridObjectsArray(null);
    expect(result).toEqual([]);
  });
});
