import axios, { AxiosRequestConfig } from 'axios';

import TypeEmailDetails from 'src/types/TypeEmailDetails';

import {
  API_URL_MAILGUN,
  API_USERNAME_MAILGUN,
  API_KEY_MAILGUN,
} from 'src/configuration';
import removeFalseyAttributes from 'src/utils/removeFalseyAttributes';

// return true/false to indicate success
async function sendEmailMailGun(email: TypeEmailDetails): Promise<boolean> {
  try {
    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailMailGun: SENDING MAILGUN REQUEST',
      email,
    );

    const strippedEmail = removeFalseyAttributes(email);

    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: API_URL_MAILGUN,
      auth: { username: API_USERNAME_MAILGUN, password: API_KEY_MAILGUN },
      params: strippedEmail,
      timeout: 5000,
    };
    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailMailGun: REQUEST CONFIG',
      requestConfig,
    );

    const result = await axios(requestConfig);
    console.log(
      'INFO in src/lambdas/sendEmail/sendEmailMailGun: MAILGUN DONE',
      result,
    );
    return true;
  } catch (error) {
    console.log(
      'ERROR in src/lambdas/sendEmail/sendEmailMailGun:',
      error.message,
      error.response ? error.response.data : '',
    );
    return false;
  }
}

export default sendEmailMailGun;
