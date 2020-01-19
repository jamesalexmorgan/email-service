import { APIGatewayProxyEvent } from 'aws-lambda';
import TypeEmailDetails from 'src/types/TypeEmailDetails';
import {
  emailFieldMultipleRegex,
  emailFieldSingleRegex,
} from 'src/utils/regexes';

function checkInvalidInput(event: APIGatewayProxyEvent): string {
  if (event.httpMethod !== 'POST') {
    return 'This end point only supports POST http method';
  }

  // check valid json
  let emailDetails: TypeEmailDetails;
  try {
    emailDetails = JSON.parse(event.body);
  } catch (error) {
    return `JSON body invalid: ${error.message}`;
  }

  const { to, cc, bcc, from } = emailDetails;

  const requiredErrorText = 'field is required on the json body object';
  if (!emailDetails.to) return `"to" ${requiredErrorText}`;
  if (!emailDetails.from) return `"from" ${requiredErrorText}`;
  if (!emailDetails.text) return `"text" ${requiredErrorText}`;

  const invalidEmailsErrorText =
    'field is invalid format, please use the email address (optionally prefixed with name), separated by commas, like so... "Jim Jones<jim@jones.com>,john@smith.com"';
  if (to && !emailFieldMultipleRegex.test(to)) {
    return `"to" ${invalidEmailsErrorText}`;
  }
  if (cc && !emailFieldMultipleRegex.test(cc)) {
    return `"cc" ${invalidEmailsErrorText}`;
  }
  if (bcc && !emailFieldMultipleRegex.test(bcc)) {
    return `"bcc" ${invalidEmailsErrorText}`;
  }
  if (from && !emailFieldSingleRegex.test(from)) {
    return '"from" field is invalid format, please use a single email address like so... "Jim Jones<jim@jones.com>"';
  }

  // valid
  return null;
}

export default checkInvalidInput;
