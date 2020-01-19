import { SQSEvent } from 'aws-lambda';

import sendEmailMailGun from './utils/sendEmailMailGun';
import sendEmailSendGrid from './utils/sendEmailSendGrid';

export const handler = async function handler(
  event: SQSEvent,
): Promise<{ success: true } | Error> {
  try {
    const record = event.Records[0];
    const email = JSON.parse(record.body);
    console.log('INFO in src/lambdas/sendEmail: EMAIL SENDING...', email);

    // no validation of body as it should already be valid at this stage

    const mailGunSuccess = await sendEmailMailGun(email);
    if (mailGunSuccess) {
      return { success: true };
    }

    const sendGridSuccess = await sendEmailSendGrid(email);
    if (sendGridSuccess) {
      return { success: true };
    }

    console.log('WARNING in src/lambdas/sendEmail: BOTH SERVICES FAILED');
    return new Error('Both email api services failed to send');
  } catch (error) {
    console.log('ERROR in src/lambdas/sendEmail: ', error);
    return error;
  }
};

export default { handler };
