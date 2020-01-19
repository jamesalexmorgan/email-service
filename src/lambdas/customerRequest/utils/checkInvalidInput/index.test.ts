import checkInvalidInput from '.';
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

describe('checkInvalidInput', () => {
  test('Good input - success', async () => {
    const event = newTestEvent(goodEventBody);
    const result = await checkInvalidInput(event);
    expect(result).toEqual(null);
  });

  test('Wrong http method - fail', async () => {
    const event = newTestEvent(goodEventBody);
    event.httpMethod = 'GET';
    const result = await checkInvalidInput(event);
    expect(result).toEqual('This end point only supports POST http method');
  });

  test('Bad JSON - fail', async () => {
    const event = newTestEvent('{ bad JSON }');
    const result = await checkInvalidInput(event);
    expect(result).toEqual(
      'JSON body invalid: Unexpected token b in JSON at position 2',
    );
  });

  test('No "to" attribute provided - fail', async () => {
    const event = newTestEvent('{ "from": "Test User<john@smith.com>" }');
    const result = await checkInvalidInput(event);
    expect(result).toEqual('"to" field is required on the json body object');
  });

  test('"cc" attribute - email invalid - fail', async () => {
    const event = newTestEvent(
      '{ "to": "John Smith<john@smith.com>", ' +
        '"from": "Test User<john@smith.com>", ' +
        '"cc": "Jim Jones<bademailaddress.com>" }',
    );
    const result = await checkInvalidInput(event);
    expect(result).toEqual(
      '"cc" field is invalid format, please use the email address (optionally prefixed with name), separated by commas, like so... "Jim Jones<jim@jones.com>,john@smith.com"',
    );
  });

  test('"bcc" attribute - email invalid - fail', async () => {
    const event = newTestEvent(
      '{ "to": "John Smith<john@smith.com>", ' +
        '"from": "Test User<john@smith.com>", ' +
        '"bcc": "bademailaddress.com" }',
    );
    const result = await checkInvalidInput(event);
    expect(result).toEqual(
      '"bcc" field is invalid format, please use the email address (optionally prefixed with name), separated by commas, like so... "Jim Jones<jim@jones.com>,john@smith.com"',
    );
  });
});
