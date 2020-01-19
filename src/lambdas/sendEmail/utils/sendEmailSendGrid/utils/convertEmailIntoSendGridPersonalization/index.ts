import TypeEmailDetails from 'src/types/TypeEmailDetails';
import TypeSendGridPersonalization from 'src/types/TypeSendGridPersonalization';

import convertMultipleNameAndEmailToSendGridObjectsArray from '../convertMultipleNameAndEmailToSendGridObjectsArray';

function convertEmailIntoSendGridPersonalization(
  email: TypeEmailDetails,
): TypeSendGridPersonalization {
  const { to, cc, bcc } = email;

  const personalization: TypeSendGridPersonalization = {
    to: convertMultipleNameAndEmailToSendGridObjectsArray(to),
  };
  if (cc) {
    const ccArray = convertMultipleNameAndEmailToSendGridObjectsArray(cc);
    personalization.cc = ccArray;
  }
  if (bcc) {
    const bccArray = convertMultipleNameAndEmailToSendGridObjectsArray(bcc);
    personalization.bcc = bccArray;
  }
  return personalization;
}

export default convertEmailIntoSendGridPersonalization;
