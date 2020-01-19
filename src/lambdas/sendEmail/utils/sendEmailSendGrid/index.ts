import axios, { AxiosRequestConfig } from 'axios';

import TypeEmailDetails from 'src/types/TypeEmailDetails';

import { API_URL_SENDGRID, API_KEY_SENDGRID } from 'src/configuration';
import convertEmailIntoSendGridPersonalization from './utils/convertEmailIntoSendGridPersonalization';
import convertSingleNameAndEmailToSendGridObject from './utils/convertSingleNameAndEmailToSendGridObject';

// return true/false to indicate success
async function sendEmailSendGrid(email: TypeEmailDetails): Promise<boolean> {
  try {
    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailSendGrid: SENDING SENDGRID REQUEST',
      email,
    );

    const { from, subject, text } = email;

    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: API_URL_SENDGRID,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY_SENDGRID}`,
      },
      // params: { to, cc, bcc, from, subject, text },
      data: JSON.stringify({
        personalizations: [convertEmailIntoSendGridPersonalization(email)], // [{ to: [{ email: 'test@example.com' }] }]
        from: convertSingleNameAndEmailToSendGridObject(from),
        subject,
        content: [{ type: 'text/plain', value: text }],
      }),
      timeout: 5000,
    };

    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailSendGrid: REQUEST CONFIG',
      requestConfig,
    );

    const result = await axios(requestConfig);
    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailSendGrid: SENDGRID DONE',
      result,
    );
    return true;
  } catch (error) {
    console.log(
      'ERROR in src/lambdas/sendEmail/sendEmailSendGrid:',
      error.message,
      error.response ? error.response.data : '',
    );
    return false;
  }
}

export default sendEmailSendGrid;
